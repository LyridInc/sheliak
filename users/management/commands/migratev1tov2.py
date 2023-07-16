import json
from io import StringIO
from django.db import connection
from django.core.management.base import BaseCommand
from django.core.management import call_command

V1_DUMP_1 = '/mnt/c/drive/lyrid/sheliakv2/dump_1.json'
V1_DUMP_2 = '/mnt/c/drive/lyrid/sheliakv2/dump_2.json'
V2_DUMP_1 = '/mnt/c/drive/lyrid/sheliakv2/v2_dump_1.json'
V2_DUMP_2 = '/mnt/c/drive/lyrid/sheliakv2/v2_dump_2.json'


def format_dumps():
    v2_dump_1_data = []
    v2_dump_2_data = []

    with open(V1_DUMP_1, 'r', encoding='utf-8') as data_file:
        data = json.load(data_file)
        for d in data:
            if d['model'] == 'users.user':
                new_dict_dump_1 = {
                    "model": "users.user",
                    "pk": d['pk'],
                    "fields": {
                        "password": d['fields']['password'],
                        "last_login": d['fields']['last_login'],
                        "is_superuser": d['fields']['is_superuser'],
                        "email": d['fields']['email'],
                        "first_name": d['fields']['first_name'],
                        "middle_name": d['fields']['middle_name'],
                        "last_name": d['fields']['last_name'],
                        "is_staff": d['fields']['is_staff'],
                        "is_active": d['fields']['is_active'],
                        "date_joined": d['fields']['date_joined'],
                        "mobile_number": d['fields']['mobile_number'],
                        "modified": d['fields']['modified'],
                        "groups": d['fields']['groups'],
                        "user_permissions": d['fields']['user_permissions']
                    }
                }
                v2_dump_1_data.append(new_dict_dump_1)

                new_dict_dump_2 = {
                    "model": "users.profile",
                    "fields": {
                        "created": d['fields']['date_joined'],
                        "modified": d['fields']['modified'],
                        "gender": d['fields']['gender'],
                        "picture": d['fields']['picture'],
                        "date_of_birth": d['fields']['date_of_birth'],
                        "nationality": d['fields']['nationality'],
                        "timezone": d['fields']['timezone'],
                        "address": d['fields']['address'],
                        "invite_code": d['fields']['invite_code'],
                        "company": d['fields']['company'],
                        "legacy_id": d['fields']['legacy_id'],
                        "user": [
                            d['fields']['email'],
                        ]
                    }
                }
                v2_dump_2_data.append(new_dict_dump_2)
            else:
                v2_dump_1_data.append(d)

    with open(V2_DUMP_1, 'w', encoding='utf-8') as f:
        json.dump(v2_dump_1_data, f, indent=4)

    with open(V1_DUMP_2, 'r', encoding='utf-8') as data_file_2:
        data2 = json.load(data_file_2)
        data2 = data2 + v2_dump_2_data

    with open(V2_DUMP_2, 'w', encoding='utf-8') as f:
        json.dump(data2, f, indent=4)


def truncate():
    cursor = connection.cursor()
    cursor.execute("TRUNCATE graphql_auth_userstatus;")
    cursor.execute("TRUNCATE users_profile;")


class Command(BaseCommand):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def handle(self, *args, **options):
        call_command('migrate', verbosity=1)
        format_dumps()
        call_command('loaddata', V2_DUMP_1, verbosity=2)
        truncate()
        call_command('loaddata', V2_DUMP_2, verbosity=2)
