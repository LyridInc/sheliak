import os
import dj_database_url
from pathlib import Path
from datetime import timedelta
from corsheaders.defaults import default_headers
from django.core.management.utils import get_random_secret_key

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    SECRET_KEY = get_random_secret_key()

ALLOWED_HOSTS = ['*']

MODE = 'DEV'  # PROD will hide admin screens
DEBUG = True
LOGLEVEL = "DEBUG"

# Application definition
INSTALLED_APPS = [
    'whitenoise.runserver_nostatic',
    'corsheaders',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'graphene_django',
    'graphql_jwt.refresh_token.apps.RefreshTokenConfig',
    'django_filters',
    'graphql_auth',
    'social_django',
    'users',
    'stacks',

    'django.contrib.admin',
]

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get("DB_CONN_STRING"),
        conn_max_age=600
    )
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates', os.path.join(BASE_DIR, "frontend/build")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',

                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
AUTH_USER_MODEL = 'users.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 8},
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

STATIC_HOST = os.environ.get('CLOUDFRONT_HOST', '')
STATIC_URL = STATIC_HOST + '/static/'
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "frontend/build/static"),
)

GRAPHENE = {
    'SCHEMA': 'schema.schema',
    'MIDDLEWARE': [
        'graphql_jwt.middleware.JSONWebTokenMiddleware',
        'graphene_django.debug.DjangoDebugMiddleware',
    ],
}

AUTHENTICATION_BACKENDS = [
    'social_core.backends.facebook.FacebookOAuth2',
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.github.GithubOAuth2',
    'social_core.backends.twitter.TwitterOAuth',
    'graphql_auth.backends.GraphQLAuthBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# Social
SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.social_auth.associate_by_email',
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
)

# Facebook Login
SOCIAL_AUTH_FACEBOOK_KEY = os.environ.get("FACEBOOK_APP_ID")
SOCIAL_AUTH_FACEBOOK_SECRET = os.environ.get("FACEBOOK_APP_SECRET")
SOCIAL_AUTH_FACEBOOK_API_VERSION = '9.0'
SOCIAL_AUTH_FACEBOOK_SCOPE = ["email", ]
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {"fields": "id, gender, first_name, last_name, email, picture"}

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.environ.get("GOOGLE_APP_ID")
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.environ.get("GOOGLE_APP_SECRET")

SOCIAL_AUTH_GITHUB_KEY = os.environ.get("GITHUB_APP_ID")
SOCIAL_AUTH_GITHUB_SECRET = os.environ.get("GITHUB_APP_SECRET")
SOCIAL_AUTH_GITHUB_SCOPE = ['user:email']

SOCIAL_AUTH_TWITTER_KEY = os.environ.get("TWITTER_APP_ID")
SOCIAL_AUTH_TWITTER_SECRET = os.environ.get("TWITTER_APP_SECRET")
SOCIAL_AUTH_TWITTER_CALLBACK = os.environ.get("TWITTER_APP_CALLBACK")

# Since graphql_auth support only graphql_jwt v0.3.0, this is a workaround for public, private key.
# Process to generate RS256 Keys
# ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
# # Don't add passphrase
# openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
# cat jwtRS256.key
# cat jwtRS256.key.pub

# JWT_PRIVATE_KEY_PATH = os.path.join(BASE_DIR, 'config/jwt/jwtRS256.key')
# JWT_PUBLIC_KEY_PATH = os.path.join(BASE_DIR, 'config/jwt/jwtRS256.key.pub')
# JWT_PRIVATE_KEY = open(JWT_PRIVATE_KEY_PATH, 'rb').read()
# JWT_PUBLIC_KEY = open(JWT_PUBLIC_KEY_PATH, 'rb').read()

GRAPHQL_JWT = {
    "JWT_ALGORITHM": "HS256",
    "JWT_ISSUER": os.environ.get("JWT_ISSUER_DOMAIN"),
    "JWT_VERIFY_EXPIRATION": True,
    "JWT_LONG_RUNNING_REFRESH_TOKEN": True,
    "JWT_EXPIRATION_DELTA": timedelta(minutes=120),
    "JWT_REFRESH_EXPIRATION_DELTA": timedelta(days=180),
    "JWT_ENCODE_HANDLER": "config.jwt.utils.jwt_encode",
    "JWT_DECODE_HANDLER": "config.jwt.utils.jwt_decode",
    "JWT_PAYLOAD_HANDLER": "config.jwt.utils.jwt_payload",
    "JWT_AUTH_HEADER_PREFIX": "Bearer",
    "JWT_ALLOW_ANY_CLASSES": [
        "graphql_auth.mutations.Register",
        "graphql_auth.mutations.VerifyAccount",
        "graphql_auth.mutations.ResendActivationEmail",
        "graphql_auth.mutations.SendPasswordResetEmail",
        "graphql_auth.mutations.PasswordReset",
        "graphql_auth.mutations.ObtainJSONWebToken",
        "graphql_auth.mutations.VerifyToken",
        "graphql_auth.mutations.RefreshToken",
        "graphql_auth.mutations.RevokeToken",
        "graphql_auth.mutations.VerifySecondaryEmail",
    ],
}

EMAIL_BACKEND = 'stacks.backends.StackEmailBackend'
EMAIL_TEMPLATE_ACTIVATION = 'users/activation'
EMAIL_TEMPLATE_PASSWORD_RESET = 'users/password_reset'
EMAIL_TEMPLATE_PASSWORD_SET = 'users/password_set'
EMAIL_TEMPLATE_WELCOME = 'users/welcome'
GRAPHQL_AUTH = {
    'LOGIN_ALLOWED_FIELDS': ['email'],
    'REGISTER_MUTATION_FIELDS': ["email", "first_name"],
    'REGISTER_MUTATION_FIELDS_OPTIONAL': ["middle_name", "last_name", "mobile_number"],
    'SEND_ACTIVATION_EMAIL': True,
    'EMAIL_ASYNC_TASK': 'users.emails.graphql_auth_async_email',
    "EMAIL_TEMPLATE_VARIABLES": {
        "frontend_domain": os.environ.get("EMAIL_DOMAIN"),
        "company_name": os.environ.get("COMPANY_NAME"),
    },
    'USER_NODE_FILTER_FIELDS': {
        "first_name": ["istartswith", "exact"],
        "is_staff": ["exact", ],
        "email": ["exact", ],
        "is_active": ["exact"],
        "status__verified": ["exact"],
    },
    'USER_NODE_EXCLUDE_FIELDS': [
        'password',
    ],
    # Email Templates
    'EMAIL_TEMPLATE_ACTIVATION': EMAIL_TEMPLATE_ACTIVATION,
    'EMAIL_TEMPLATE_ACTIVATION_RESEND': EMAIL_TEMPLATE_ACTIVATION,
    'EMAIL_TEMPLATE_PASSWORD_RESET': EMAIL_TEMPLATE_PASSWORD_RESET,
    'EMAIL_TEMPLATE_PASSWORD_SET': EMAIL_TEMPLATE_PASSWORD_SET,

    'PASSWORD_RESET_PATH_ON_EMAIL': 'reset',
    'PASSWORD_SET_PATH_ON_EMAIL': 'set',
}
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = list(default_headers) + [
    'content-transfer-encoding',
]

from .logging import *
