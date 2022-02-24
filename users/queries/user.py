import graphene
from graphql_jwt.decorators import staff_member_required, login_required

from users.types import UserType
from users.filters import UsersFilterConnectionField


class UserQuery(graphene.ObjectType):
    me = graphene.Field(UserType)
    user = graphene.Field(UserType, id=graphene.ID())
    users = UsersFilterConnectionField(
        UserType,
        orderBy=graphene.List(of_type=graphene.String),
        search=graphene.String()
    )

    @login_required
    def resolve_me(self, info):
        user = info.context.user
        if user.is_authenticated:
            return user
        return None

    @staff_member_required
    def resolve_user(self, info, id):
        return graphene.relay.Node.get_node_from_global_id(info, id)
