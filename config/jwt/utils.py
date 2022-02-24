import jwt
from calendar import timegm
from datetime import datetime
from django.conf import settings
from graphql_jwt.settings import jwt_settings


def jwt_payload(user, context=None):
    username = user.get_username()

    if hasattr(username, 'pk'):
        username = username.pk

    payload = {
        user.USERNAME_FIELD: username,
        'sub': str(user.id),
        'exp': datetime.utcnow() + jwt_settings.JWT_EXPIRATION_DELTA,
    }

    if jwt_settings.JWT_ALLOW_REFRESH:
        payload['iat'] = timegm(datetime.utcnow().utctimetuple())

    if jwt_settings.JWT_AUDIENCE is not None:
        payload['aud'] = jwt_settings.JWT_AUDIENCE

    if jwt_settings.JWT_ISSUER is not None:
        payload['iss'] = jwt_settings.JWT_ISSUER

    payload['modified'] = str(user.modified)
    payload['email'] = user.email
    payload['verified'] = user.status.verified
    payload['name'] = user.get_full_name()

    payload['alternate_ids'] = []
    if user.profile and user.profile.legacy_id:
        payload['alternate_ids'].append(user.profile.legacy_id)

    return payload


def jwt_encode(payload, context=None):
    return jwt.encode(
        payload,
        getattr(settings, 'JWT_PRIVATE_KEY', jwt_settings.JWT_SECRET_KEY),
        jwt_settings.JWT_ALGORITHM,
    )


def jwt_decode(token, context=None):
    return jwt.decode(
        token,
        getattr(settings, 'JWT_PUBLIC_KEY', jwt_settings.JWT_SECRET_KEY),
        options={
            'verify_exp': jwt_settings.JWT_VERIFY_EXPIRATION,
            "verify_aud": jwt_settings.JWT_AUDIENCE is not None,
            "verify_signature": jwt_settings.JWT_VERIFY,
        },
        leeway=jwt_settings.JWT_LEEWAY,
        audience=jwt_settings.JWT_AUDIENCE,
        issuer=jwt_settings.JWT_ISSUER,
        algorithms=[jwt_settings.JWT_ALGORITHM],
    )
