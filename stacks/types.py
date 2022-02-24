import graphene
from graphene_django.types import DjangoObjectType

from stacks.models import Stack, Email
from helpers.utils import PaginatorConnection


class EmailType(DjangoObjectType):
    class Meta:
        model = Email


class StackType(DjangoObjectType):
    class Meta:
        model = Stack
        filter_fields = {
            "email__backend": ["exact"],
        }
        interfaces = (graphene.Node,)
        connection_class = PaginatorConnection

    @classmethod
    def get_queryset(cls, queryset, info):
        return queryset.select_related("email")
