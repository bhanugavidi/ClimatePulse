import os
from supabase import create_client
url = 'https://qbmqafjpreqsgwvlwwsl.supabase.co'
key = 'sb_publishable_XKglSFs0QtO46OqhO_VytQ_tZGiuYtt'
supabase = create_client(url, key)
supabase.table('users').delete().eq('email', 'officer@brics.org').execute()
print('Deleted')
