import pytz
import datetime
from graphene import ObjectType, String, List
from graphql_jwt.decorators import staff_member_required


class TimezoneType(ObjectType):
    label = String(required=True)
    value = String(required=True)


class TimezoneQuery(ObjectType):
    all_timezones = List(TimezoneType)

    @staff_member_required
    def resolve_all_timezones(self, info):
        timezones = []
        for tz in pytz.all_timezones:
            tz_offset = datetime.datetime.now(pytz.timezone(tz)).strftime('%z')
            tz_name = tz.replace('_', ' ')
            value = tz.upper().replace('/', '_')
            timezones.append({'label': tz_name, 'value': value})

        sorted_timezones = sorted(timezones, key=lambda x: x['value'])
        empty_option = {'label': '-', 'value': ''}
        sorted_timezones.insert(0, empty_option)

        return [TimezoneType(**tz) for tz in sorted_timezones]
