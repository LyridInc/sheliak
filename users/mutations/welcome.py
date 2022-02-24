import graphene
from graphql_auth.bases import MutationMixin, DynamicArgsMixin
from users.mixins import SendWelcomeEmailMixin


class SendWelcomeEmail(
    MutationMixin, DynamicArgsMixin, SendWelcomeEmailMixin, graphene.Mutation
):
    __doc__ = SendWelcomeEmailMixin.__doc__
