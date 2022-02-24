import logging

from django.utils import timezone
from graphql_jwt.signals import token_issued
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.contrib.auth.signals import user_logged_in

from users.models import Profile


logger = logging.getLogger(__name__)
User = get_user_model()


def get_ip(request):
    x_forward = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forward:
        ip = x_forward.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def update_and_capture_last_login(user, request, **kwargs):
    user.user_logins.create(provider=user.backend, ip_address=get_ip(request))
    user.last_login = timezone.now()
    user.save(update_fields=['last_login'])


# This is required if user is logging in from admin panel.
# Admin panel emits user_logged_in signal
def capture_login_event(user, request, **kwargs):
    user.user_logins.create(ip_address=get_ip(request))
    user.save()


@receiver(post_save, sender=User)
def create_favorites(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


token_issued.connect(update_and_capture_last_login)
user_logged_in.connect(capture_login_event)
