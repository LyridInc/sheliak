from functools import wraps

from django.utils.translation import ugettext_lazy as _

from promise import Promise, is_thenable
from social_core.exceptions import MissingBackend
from social_django.utils import load_backend, load_strategy
from social_django.views import _do_login
from graphql_jwt.settings import jwt_settings
from graphql_jwt.refresh_token.shortcuts import refresh_token_lazy

from . import exceptions, mixins


def psa(f):
    @wraps(f)
    def wrapper(cls, root, info, provider, access_token, **kwargs):
        strategy = load_strategy(info.context)

        try:
            backend = load_backend(strategy, provider, redirect_uri=None)
        except MissingBackend:
            raise exceptions.GraphQLSocialAuthError(_('Provider not found'))

        if info.context.user.is_authenticated:
            authenticated_user = info.context.user
        else:
            authenticated_user = None

        user = backend.do_auth(access_token, user=authenticated_user)

        if user is None:
            raise exceptions.DoAuthError("NOT_REGISTERED", {})

        user_model = strategy.storage.user.user_model()

        if not isinstance(user, user_model):
            msg = _('`{}` is not a user instance').format(type(user).__name__)
            raise exceptions.DoAuthError(msg, user)

        if not issubclass(cls, mixins.JSONWebTokenMixin):
            _do_login(backend, user, user.social_user)

        return f(cls, root, info, user.social_user, **kwargs)
    return wrapper


def social_auth(f):
    @psa
    @wraps(f)
    def wrapper(cls, root, info, social, **kwargs):
        def on_resolve(payload):
            payload.social = social

            if jwt_settings.JWT_LONG_RUNNING_REFRESH_TOKEN:
                payload.refresh_token = refresh_token_lazy(social.user)

            return payload

        result = f(cls, root, info, social, **kwargs)

        if is_thenable(result):
            return Promise.resolve(result).then(on_resolve)
        return on_resolve(result)
    return wrapper