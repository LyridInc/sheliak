from smtplib import SMTPException

import graphene
from django.utils.translation import gettext as _
from django.core.exceptions import ObjectDoesNotExist
from django.utils.module_loading import import_string
from graphql_auth.bases import MutationMixin, DynamicArgsMixin
from graphql_auth.constants import Messages
from graphql_auth.settings import graphql_auth_settings as app_settings
from graphql_jwt.decorators import staff_member_required

from stacks.models import Stack

if app_settings.EMAIL_ASYNC_TASK and isinstance(app_settings.EMAIL_ASYNC_TASK, str):
    async_email_func = import_string(app_settings.EMAIL_ASYNC_TASK)
else:
    async_email_func = None


class SendTestEmail(MutationMixin, DynamicArgsMixin, graphene.Mutation):
    """
    Send Test email.
    """
    EMAIL_CONFIG_ERROR = [{"message": _("Improper email configuration"), "code": "email_config_error"}]

    @classmethod
    @staff_member_required
    def resolve_mutation(cls, root, info, **kwargs):
        try:
            stack = Stack.objects.all().first()
            if stack:
                user = info.context.user
                if async_email_func:
                    async_email_func(
                        stack.email.send_test_email, (info, [user.email])
                    )
                else:
                    stack.email.send_test_email(info, [user.email])
                return cls(success=True)
            else:
                return cls(success=False, errors=cls.EMAIL_CONFIG_ERROR)
        except ObjectDoesNotExist:
            return cls(success=False)
        except SMTPException:
            return cls(success=False, errors=Messages.EMAIL_FAIL)