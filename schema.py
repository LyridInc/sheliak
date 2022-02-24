import graphene
from graphene_django.debug import DjangoDebug
from users.schema import Mutation as AuthMutation, Query as AuthQuery
from stacks.schema import Mutation as StackMutation, Query as StackQuery


class DebugQuery(graphene.ObjectType):
    debug = graphene.Field(DjangoDebug, name='_debug')


# Main schema related stuffs starts here
class Query(
    AuthQuery,
    StackQuery,
    DebugQuery,
    graphene.ObjectType
):
    pass


class Mutation(
    AuthMutation,
    StackMutation,
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)