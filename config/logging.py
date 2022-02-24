import logging.config
import os

LOGGING_CONFIG = None

LOGLEVEL = os.environ.get('LOGLEVEL', 'info').upper()

logging.config.dictConfig({
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'default': {
            'format': '[%(levelname)s] [%(asctime)s] | %(filename)s:%(lineno)s | %(message)s',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'default',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
        }
    },
    'loggers': {
        '': {
            'level': LOGLEVEL,
            'handlers': ['console'],
        },
        'django.request': {
            'level': LOGLEVEL,
            'handlers': ['console', 'mail_admins'],
            'propagate': False,
        },
    },
})