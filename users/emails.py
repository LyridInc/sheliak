import logging
import time

from graphql.utils.ast_to_dict import ast_to_dict
from graphql_auth.constants import TokenAction
from graphql_auth.settings import graphql_auth_settings as app_settings
from graphql_auth.utils import get_token

logger = logging.getLogger(__name__)


def graphql_auth_async_email(func, args):
    user_status = func.__self__
    info = ast_to_dict(args[0].field_asts[0])

    if info['name']['value'] == 'resendActivationEmail':
        return user_status.user.resend_activation_email(args[0])

    elif info['name']['value'] == 'register':
        return user_status.user.send_activation_email(args[0])

    elif info['name']['value'] == 'sendPasswordResetEmail':
        return user_status.user.send_password_reset_email(args[0])

    elif info['name']['value'] == 'sendPasswordSetEmail':
        return user_status.user.send_password_set_email(args[0])

    else:
        return func(*args)


def force_user_to_reset_password(user):
    logger.info("Force user to reset password - %s {%s}" % (user, user.email))

    token = get_token(user, TokenAction.PASSWORD_RESET)
    email_context = {
        "user": user,
        "token": token,
        "protocol": "https",
        "path": app_settings.PASSWORD_RESET_PATH_ON_EMAIL,
        "timestamp": time.time(),
        **app_settings.EMAIL_TEMPLATE_VARIABLES,
    }

    user.send_password_set_email_for_import_users(email_context)


def force_user_to_reset_password_security_update(user):
    logger.info("Force user to reset password security update - %s {%s}" % (user, user.email))

    token = get_token(user, TokenAction.PASSWORD_RESET)
    email_context = {
        "user": user,
        "token": token,
        "protocol": "https",
        "path": app_settings.PASSWORD_RESET_PATH_ON_EMAIL,
        "timestamp": time.time(),
        **app_settings.EMAIL_TEMPLATE_VARIABLES,
    }

    user.send_password_set_email_for_security_update(email_context)