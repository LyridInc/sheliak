import graphene
from stacks.queries import StackQuery
from stacks.mutations import CreateStackMutation, PatchStackMutation, SendTestEmail


class Query(
    StackQuery,
):
    pass


class Mutation(graphene.ObjectType):
    create_stack = CreateStackMutation.Field()
    patch_stack = PatchStackMutation.Field()
    send_test_email = SendTestEmail.Field()


