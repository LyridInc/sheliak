import re
from graphene import Connection, Int

dashed_to_camel_regex = re.compile(r'(?!^)_([a-zA-Z])')


def dashed_to_camel(dashed_data):
    data = {}
    for key, value in dashed_data.items():
        if isinstance(value, dict):
            value = dashed_to_camel(value)

        dashed_key = dashed_to_camel_regex \
            .sub(lambda match: match.group(1).upper(), key)

        data[dashed_key] = value
    return data


def percentage_change(previous, current):
    if previous is None or current is None:
        return 0

    diff = current - previous
    change = 0
    try:
        if diff > 0:
            change = (diff / previous) * 100
        elif diff < 0:
            diff = previous - current
            change = -((diff / previous) * 100)
    except ZeroDivisionError:
        return 100
    return round(change, 2)


class PaginatorConnection(Connection):
    class Meta:
        abstract = True

    total_count = Int()
    edge_count = Int()

    def resolve_total_count(root, info, **kwargs):
        return root.length

    def resolve_edge_count(root, info, **kwargs):
        return len(root.edges)
