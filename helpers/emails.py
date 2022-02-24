import time

from django.contrib.sites.shortcuts import get_current_site
from graphql_auth.settings import graphql_auth_settings as app_settings
from graphql_auth.utils import get_token
from templated_email import send_templated_mail


# --------------------------------
# Django-Templated-Email support
# --------------------------------
def send_email(user, template, context, recipient_list=None):
    send_templated_mail(
        template_name=template,
        from_email=app_settings.EMAIL_FROM,
        recipient_list=(
            recipient_list or [getattr(user, user.EMAIL_FIELD)]
        ),
        context=context
    )


def get_full_email_context(user, info, path, action, **kwargs):
    token = get_token(user, action, **kwargs)
    site = get_current_site(info.context)
    return {
        "user": user,
        "request": info.context,
        "token": token,
        "port": info.context.get_port(),
        "site_name": site.name,
        "domain": site.domain,
        "protocol": "https",
        "path": path,
        "timestamp": time.time(),
        **app_settings.EMAIL_TEMPLATE_VARIABLES,
    }


def get_trimmed_email_context(user, info):
    site = get_current_site(info.context)
    return {
        "user": user,
        "request": info.context,
        "port": info.context.get_port(),
        "site_name": site.name,
        "domain": site.domain,
        "protocol": "https",
        "timestamp": time.time(),
        **app_settings.EMAIL_TEMPLATE_VARIABLES,
    }