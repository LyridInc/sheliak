import json
from datetime import datetime, time

from django.db.models import Q
from graphql_jwt.decorators import staff_member_required

from django.forms import DateField, Field
from django_filters import FilterSet
from django_filters.utils import handle_timezone
from django_filters.filters import RangeFilter
from django.contrib.auth import get_user_model
from graphene.utils.str_converters import to_snake_case
from graphene_django.filter.fields import DjangoFilterConnectionField

from users.models import UserLogin

User = get_user_model()


class UsersFilterConnectionField(DjangoFilterConnectionField):

    @classmethod
    @staff_member_required
    def resolve_queryset(
        cls, connection, iterable, info, args, filtering_args, filterset_class
    ):
        qs = super(DjangoFilterConnectionField, cls).resolve_queryset(
            connection, iterable, info, args
        )
        filter_kwargs = {k: v for k, v in args.items() if k in filtering_args}
        qs = filterset_class(data=filter_kwargs, queryset=qs, request=info.context).qs

        search = args.get('search', None)
        if search:
            filters = Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains=search)
            qs = qs.filter(filters)

        order = args.get('orderBy', None)
        if order:
            if type(order) is str:
                snake_order = to_snake_case(order)
            else:
                snake_order = [to_snake_case(o) for o in order]
            qs = qs.order_by(*snake_order)
        return qs


class DateRangeField(Field):

    def compress(self, data_list):
        if data_list:
            start_date, stop_date = data_list
            if start_date:
                start_date = handle_timezone(
                    datetime.combine(start_date, time.min))
            if stop_date:
                stop_date = handle_timezone(
                    datetime.combine(stop_date, time.max))
            return slice(start_date, stop_date)
        return None

    def clean(self, value):
        if value:
            clean_data = []
            values = json.loads(value)
            if isinstance(values, (list, tuple)):
                for field_value in values:
                    clean_data.append(DateField().clean(field_value))
            return self.compress(clean_data)
        else:
            return self.compress([])


class DateFromToRangeFilter(RangeFilter):
    field_class = DateRangeField


class UserLoginFilter(FilterSet):
    date_range = DateFromToRangeFilter(field_name='timestamp')

    class Meta:
        model = UserLogin
        fields = ['date_range']


class UserGrowthFilter(FilterSet):
    date_range = DateFromToRangeFilter(field_name='date_joined')

    class Meta:
        model = User
        fields = ['date_range']
