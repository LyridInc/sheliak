import uuid

from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _
from model_utils import Choices
from model_utils.models import TimeStampedModel
from timezone_field import TimeZoneField

User = get_user_model()


class Profile(TimeStampedModel):
    GENDER_CHOICES = Choices(
        ('M', _("Male")),
        ('F', _("Female")),
        ('O', _("Others")),
        ('', None),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    gender = models.CharField(max_length=1, blank=True, choices=GENDER_CHOICES)
    picture = models.URLField(max_length=1024, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    nationality = models.CharField(blank=True, max_length=100)
    timezone = TimeZoneField(default='UTC')
    address = models.TextField(blank=True)
    invite_code = models.CharField(blank=True, max_length=255)
    company = models.CharField(blank=True, max_length=1024)
    legacy_id = models.CharField(max_length=255, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return str(self.user.first_name + " " + self.user.last_name + "[" + str(self.user.id) + "] Profile")

    def get_gender(self):
        return dict(self.GENDER_CHOICES)[self.gender]
