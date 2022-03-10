import graphene
from django.contrib.auth import get_user_model
from graphql_auth.bases import MutationMixin
from django.utils.translation import gettext as _
from graphql_jwt.decorators import staff_member_required, login_required
from graphene_django_cud.mutations import DjangoCreateMutation, DjangoPatchMutation, DjangoDeleteMutation

User = get_user_model()


class UserRegisterAdmin(DjangoCreateMutation, MutationMixin):
    """Create User - Staff only"""

    class Meta:
        model = User
        only_fields = ("first_name", "email", "mobile_number", "is_staff", "is_superuser", "is_active", "password")

    @classmethod
    def before_save(cls, root, info, input, obj):
        obj.set_password(input["password"])
        return obj

    @classmethod
    @staff_member_required
    def mutate(cls, root, info, input):
        return super().mutate(root, info, input)


class UserPatch(DjangoPatchMutation, MutationMixin):
    """Patch User data - logged user"""
    ACCOUNT_PERMISSION_ERROR = [{"message": _("You don't have permission to modify this account"),
                                 "code": "account_permission_error"}]

    class Meta:
        model = User
        only_fields = ("first_name", "middle_name", "last_name", "email", "mobile_number", "profile")
        one_to_one_extras = {
            "profile": {
                "type": "auto"
            },
        }

    @classmethod
    @login_required
    def mutate(cls, root, info, input, id):
        user = info.context.user
        if user == graphene.relay.Node.get_node_from_global_id(info, id):
            return super().mutate(root, info, input, id)
        return cls(success=False, errors=cls.ACCOUNT_PERMISSION_ERROR)


class UserPatchAdmin(DjangoPatchMutation, MutationMixin):
    """Patch User data - Staff only"""

    class Meta:
        model = User
        type_name = "UpdateUserInputStaff"
        only_fields = ("first_name", "middle_name", "last_name", "email", "mobile_number", "is_staff", "is_superuser",
                       "is_active", "password", "profile")
        one_to_one_extras = {
            "profile": {"type": "auto"},
        }

    @classmethod
    def before_save(cls, root, info, input, id, obj):
        if input.get("password"):
            obj.set_password(input["password"])
        return obj

    @classmethod
    @staff_member_required
    def mutate(cls, root, info, input, id):
        return super().mutate(root, info, input, id)


class DeleteUserAdmin(DjangoDeleteMutation, MutationMixin):
    """
    Delete User by admin form
    """

    class Meta:
        model = User

    @classmethod
    @staff_member_required
    def mutate(cls, root, info, id):
        return super().mutate(root, info, id)