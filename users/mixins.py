import graphene
from smtplib import SMTPException

from django.contrib.auth import get_user_model
from django.contrib.auth.forms import SetPasswordForm
from django.core.exceptions import ObjectDoesNotExist
from django.utils.module_loading import import_string
from graphene_django_cud.util import disambiguate_id
from graphql_jwt.settings import jwt_settings
from graphql_jwt.signals import token_issued
from graphql_jwt.decorators import staff_member_required
from graphql_auth.constants import Messages
from graphql_auth.settings import graphql_auth_settings as app_settings
from graphql_auth.decorators import verification_required
from users.exceptions import DoAuthError


if app_settings.EMAIL_ASYNC_TASK and isinstance(app_settings.EMAIL_ASYNC_TASK, str):
    async_email_func = import_string(app_settings.EMAIL_ASYNC_TASK)
else:
    async_email_func = None

User = get_user_model()


class SocialAuthMixin:
    @classmethod
    def __init_subclass_with_meta__(cls, name=None, **options):
        assert getattr(cls, 'resolve', None), (
            '{name}.resolve method is required in a SocialAuthMutation.'
        ).format(name=name or cls.__name__)

        super().__init_subclass_with_meta__(name=name, **options)


class ResolveMixin:

    @classmethod
    def resolve(cls, *args, **kwargs):
        return cls()


class JSONWebTokenMixin:
    token = graphene.String()

    @classmethod
    def Field(cls, *args, **kwargs):
        if jwt_settings.JWT_LONG_RUNNING_REFRESH_TOKEN:
            cls._meta.fields['refresh_token'] = graphene.Field(graphene.String)

        return super().Field(*args, **kwargs)

    @classmethod
    def resolve(cls, root, info, social, **kwargs):
        try:
            from graphql_jwt.shortcuts import get_token
        except ImportError:
            raise ImportError(
                'django-graphql-jwt not installed.\n'
                "Use `pip install 'django-graphql-social-auth[jwt]'`.")
        try:
            token = get_token(social.user)
            token_issued.send(sender=cls, request=info.context, user=social.user)
            return cls(token=token)
        except AttributeError:
            raise DoAuthError("NOT_REGISTERED", {})


class SendWelcomeEmailMixin:
    """
    Send Welcome email.
    """

    @classmethod
    @verification_required
    def resolve_mutation(cls, root, info, **kwargs):
        try:
            user = info.context.user
            if async_email_func:
                async_email_func(
                    user.send_welcome_email, (info, [user.email])
                )
            else:
                user.send_welcome_email(info, [user.email])
            return cls(success=True)
        except ObjectDoesNotExist:
            return cls(success=True)
        except SMTPException:
            return cls(success=False, errors=Messages.EMAIL_FAIL)


class PasswordSetAdminMixin:
    """
    Change user password via admin panel.
    Staff user only
    """

    form = SetPasswordForm

    @classmethod
    @staff_member_required
    def resolve_mutation(cls, root, info, **kwargs):
        # find user
        user = User.objects.get(pk=disambiguate_id(kwargs.get("id")))

        f = cls.form(user, kwargs)
        if f.is_valid():
            user = f.save()
            return cls(success=True)
        return cls(success=False, errors=f.errors.get_json_data())