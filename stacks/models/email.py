from django.db import models
from django.conf import settings
from model_utils import Choices
from model_utils.models import TimeStampedModel
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from helpers.emails import get_trimmed_email_context, send_email


class Email(TimeStampedModel):
    BACKEND_CHOICES = Choices(
        ('SES', _("Amazon SES")),
        ('SMTP', _("SMTP")),
        ('CONSOLE', _("Console")),
        ('IN_MEMORY', _("Console")),
        ('DUMMY', _("Dummy")),
    )

    backend = models.CharField(choices=BACKEND_CHOICES, default=BACKEND_CHOICES.SES, max_length=10)
    from_email = models.CharField(blank=True, null=True, max_length=256, verbose_name=_("Default From Email"))
    fail_silently = models.BooleanField(default=False, verbose_name=_("Fail Silently"))

    # Regular SMTP
    host = models.CharField(blank=True, null=True, max_length=256, verbose_name=_("Email Host"))
    port = models.SmallIntegerField(blank=True, null=True,verbose_name=_("Email Port"))
    username = models.CharField(blank=True, null=True, max_length=256, verbose_name=_("Email Authentication Username"))
    password = models.CharField(blank=True, null=True, max_length=256, verbose_name=_("Email Authentication Password"))
    use_tls = models.BooleanField(default=False, verbose_name=_("Use TLS"))
    use_ssl = models.BooleanField(default=False, verbose_name=_("Use SSL"))
    timeout = models.SmallIntegerField(blank=True, null=True, verbose_name=_("Email Send Timeout (seconds)"))

    # SES Related
    aws_access_key_id = models.CharField(blank=True, null=True, max_length=256, verbose_name=_("AWS Access Key ID"))
    aws_secret_access_key = models.CharField(
        blank=True, null=True,
        max_length=256, verbose_name=_("AWS Secret Access Key")
    )
    aws_ses_region_name = models.CharField(blank=True, null=True, max_length=256, verbose_name=_("AWS SES Region Name"))
    aws_ses_region_endpoint = models.CharField(
        blank=True, null=True,
        max_length=256, verbose_name=_("AWS SES Region Endpoint")
    )
    aws_ses_auto_throttle = models.DecimalField(blank=True, null=True, max_digits=3, decimal_places=1)
    aws_ses_config = models.CharField(blank=True, null=True, max_length=256)
    dkim_domain = models.CharField(blank=True, null=True, max_length=256)
    dkim_key = models.CharField(blank=True, null=True, max_length=256)
    dkim_selector = models.CharField(blank=True, null=True, max_length=256)
    dkim_headers = models.CharField(blank=True, null=True, max_length=256)
    aws_ses_source_arn = models.CharField(blank=True, null=True, max_length=256)
    aws_ses_from_arn = models.CharField(blank=True, null=True, max_length=256)
    aws_ses_return_path_arn = models.CharField(blank=True, null=True, max_length=256)

    def clean(self):
        if self.use_ssl and self.use_tls:
            raise ValidationError(
                _("\"Use TLS\" and \"Use SSL\" are mutually exclusive, "
                  "so only set one of those settings to True."))

    def __str__(self):
        return _("Email")

    def send_test_email(self, info, *args, **kwargs):
        email_context = get_trimmed_email_context(self, info)
        template = settings.EMAIL_TEMPLATE_TEST_EMAIL
        return send_email(self, template, email_context, *args, **kwargs)

    class Meta:
        verbose_name = _("Email")
