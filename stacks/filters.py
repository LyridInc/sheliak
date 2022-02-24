from django.db.models import Q
from graphene.utils.str_converters import to_snake_case
from graphene_django.filter.fields import DjangoFilterConnectionField
from graphql_jwt.decorators import staff_member_required


class StacksFilterConnectionField(DjangoFilterConnectionField):

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
            filters = Q(site_title__icontains=search) | \
                      Q(email__from_email__icontains=search) | \
                      Q(email__host__icontains=search)
            qs = qs.filter(filters)

        order = args.get('orderBy', None)
        if order:
            if type(order) is str:
                snake_order = to_snake_case(order)
            else:
                snake_order = [to_snake_case(o) for o in order]
            qs = qs.order_by(*snake_order)
        return qs
