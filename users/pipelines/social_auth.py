from social_core.exceptions import AuthException


def uid_check(backend, details, uid, user=None, *args, **kwargs):
    if not uid:
        raise AuthException(
            backend,
            "The social user didn't returned the UID. Please try again after sometime."
        )