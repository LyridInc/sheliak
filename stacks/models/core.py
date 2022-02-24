from django.db import models
from django.contrib.auth import get_user_model
from model_utils.models import TimeStampedModel

from .email import Email

User = get_user_model()


class Stack(TimeStampedModel):
    """
    An organization should have only one stack available to them.
    There maybe multiple records in the future, when we introduce the concept of tenancy.
    """
    site_title = models.CharField(null=True, blank=True, max_length=256)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT)
    email = models.OneToOneField(Email, on_delete=models.CASCADE)
