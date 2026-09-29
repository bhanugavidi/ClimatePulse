import numpy as np
from datetime import datetime, timezone
from sklearn.cluster import DBSCAN
from db.supabase_client import supabase

# Earth radius in kilometers
EARTH_RADIUS_KM = 6371.0088

def update_hotspots_for_region(region_id: str, eps_km: float = 1.0, min_samples: int = 2):
    """
    Groups recent reports within `eps_km` into clusters using DBSCAN,
    and updates the pollution_hotspots table.
    """
    # 1. Fetch recent reports for this region that have moderate/high/severe ratings
    response = (
        supabase.table("pollution_reports")
        .select("id, lat, lng, severity, ai_score")
        .eq("region_id", region_id)
        .in_("severity", ["moderate", "high", "severe"])
        .execute()
    )
    
    reports = response.data
    if not reports or len(reports) < min_samples:
        return []

    # 2. Convert coordinates to radians for Haversine distance metric
    coords = np.array([[r["lat"], r["lng"]] for r in reports])
    kms_per_radian = EARTH_RADIUS_KM
    epsilon = eps_km / kms_per_radian

    # 3. Fit DBSCAN
    db = DBSCAN(eps=epsilon, min_samples=min_samples, metric="haversine")
    coords_rad = np.radians(coords)
    db.fit(coords_rad)
    labels = db.labels_

    unique_labels = set(labels)
    new_hotspots = []

    # 4. Clear old hotspots for this region before inserting new active clusters
    supabase.table("pollution_hotspots").delete().eq("region_id", region_id).execute()

    for label in unique_labels:
        if label == -1:
            # -1 is noise (isolated reports that don't form a cluster)
            continue

        # Points in this cluster
        cluster_mask = labels == label
        cluster_coords = coords[cluster_mask]
        cluster_reports = [reports[i] for i, m in enumerate(cluster_mask) if m]

        # Calculate centroid
        center_lat = float(np.mean(cluster_coords[:, 0]))
        center_lng = float(np.mean(cluster_coords[:, 1]))
        report_count = len(cluster_reports)

        # Determine aggregate risk level
        avg_score = np.mean([r.get("ai_score") or 50 for r in cluster_reports])
        if avg_score >= 80:
            risk = "severe"
        elif avg_score >= 65:
            risk = "high"
        elif avg_score >= 45:
            risk = "moderate"
        else:
            risk = "low"

        hotspot_entry = {
            "region_id": region_id,
            "center_lat": round(center_lat, 6),
            "center_lng": round(center_lng, 6),
            "radius_m": int(eps_km * 1000),
            "risk_level": risk,
            "report_count": report_count,
            "last_updated": datetime.now(timezone.utc).isoformat()
        }

        insert_res = supabase.table("pollution_hotspots").insert(hotspot_entry).execute()
        if insert_res.data:
            created_hs = insert_res.data[0]
            new_hotspots.append(created_hs)

            # Auto-generate Authority Alert for high/severe clusters
            if risk in ["high", "severe"]:
                alert_entry = {
                    "hotspot_id": created_hs["id"],
                    "region_id": region_id,
                    "message": f"CRITICAL: {risk.upper()} pollution cluster formed ({report_count} reports) near ({round(center_lat, 3)}, {round(center_lng, 3)}).",
                    "severity": risk,
                    "status": "open",
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                supabase.table("alerts").insert(alert_entry).execute()

                # Trigger Federated Cross-Border Packet to demo partner country (e.g. São Paulo)
                try:
                    target_res = (
                        supabase.table("regions")
                        .select("id")
                        .neq("id", region_id)
                        .limit(1)
                        .execute()
                    )
                    if target_res.data:
                        target_id = target_res.data[0]["id"]
                        fed_packet = {
                            "source_region_id": region_id,
                            "target_region_id": target_id,
                            "risk_summary_json": {
                                "cluster_center": [round(center_lat, 4), round(center_lng, 4)],
                                "severity": risk,
                                "plume_vector_degrees": 125,
                                "transboundary_drift_probability": 0.88,
                                "confidence": 0.92
                            },
                            "shared_at": datetime.now(timezone.utc).isoformat()
                        }
                        supabase.table("federated_predictions").insert(fed_packet).execute()
                except Exception as fed_err:
                    print(f"Federated auto-share notice: {fed_err}")

    return new_hotspots