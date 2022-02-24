import graphene
from graphql_jwt.decorators import staff_member_required

from stacks.types import StackType
from stacks.filters import StacksFilterConnectionField


class StackQuery(graphene.ObjectType):
    stack = graphene.Field(StackType, id=graphene.ID())
    stacks = StacksFilterConnectionField(
        StackType,
        orderBy=graphene.List(of_type=graphene.String),
        search=graphene.String()
    )

    @staff_member_required
    def resolve_stack(self, info, id):
        return graphene.relay.Node.get_node_from_global_id(info, id)