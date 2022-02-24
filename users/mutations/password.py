import graphene
from graphql_auth.bases import MutationMixin, DynamicArgsMixin
from users.mixins import PasswordSetAdminMixin


class PasswordSetAdmin(MutationMixin, DynamicArgsMixin, PasswordSetAdminMixin, graphene.Mutation):
    _required_args = ["new_password1", "new_password2"]

    class Arguments:
        id = graphene.ID(required=True)
