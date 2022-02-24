from django.utils.translation import gettext as _
from graphql_auth.bases import MutationMixin
from graphql_jwt.decorators import staff_member_required
from graphene_django_cud.mutations import DjangoCreateMutation, DjangoPatchMutation

from stacks.models import Stack


class CreateStackMutation(DjangoCreateMutation, MutationMixin):
    """
    Create dynamic settings
    An organization should have only one stack available to them.
    """

    class Meta:
        model = Stack
        exclude_fields = ('modified', 'created', 'created_by', 'email__modified', 'email__created')
        one_to_one_extras = {"email": {"type": "auto"}}
        auto_context_fields = {
            'created_by': 'user'
        }

    @classmethod
    @staff_member_required
    def mutate(cls, root, info, input):
        has_stack = Stack.objects.exists()
        if has_stack:
            return cls(success=False, errors=[{"message": _("Stack already exists."), "code": "stack_exist"}])
        return super().mutate(root, info, input)


class PatchStackMutation(DjangoPatchMutation, MutationMixin):
    """
    Patch dynamic settings
    """

    class Meta:
        model = Stack
        exclude_fields = ('modified', 'created', 'created_by', 'email__modified', 'email__created')
        one_to_one_extras = {"email": {"type": "auto"}}
        auto_context_fields = {
            'created_by': 'user'
        }

    @classmethod
    @staff_member_required
    def mutate(cls, root, info, input, id):
        return super().mutate(root, info, input, id)
