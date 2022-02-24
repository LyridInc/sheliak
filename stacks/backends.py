from django.utils.translation import gettext_lazy as _
from django.core.mail.backends.smtp import EmailBackend as SMTPBackend
from django.core.mail.backends.dummy import EmailBackend as DummyEmailBackend
from django.core.mail.backends.console import EmailBackend as ConsoleEmailBackend
from django.core.mail.backends.locmem import EmailBackend as InMemoryEmailBackend
from django_ses import SESBackend

from stacks.models import Stack


class SESEmailBackend(SESBackend):
    def __init__(self, stack=None, fail_silently=False, aws_access_key=None, aws_secret_key=None, aws_region_name=None,
                 aws_region_endpoint=None, aws_auto_throttle=None, aws_config=None, dkim_domain=None, dkim_key=None,
                 dkim_selector=None, dkim_headers=None, ses_source_arn=None, ses_from_arn=None,
                 ses_return_path_arn=None, **kwargs):

        self.stack = stack
        super().__init__(
            fail_silently=stack.email.fail_silently if fail_silently is None else fail_silently,
            aws_access_key=stack.email.aws_access_key_id if aws_access_key is None else aws_access_key,
            aws_secret_key=stack.email.aws_secret_access_key if aws_secret_key is None else aws_secret_key,
            aws_region_name=stack.email.aws_ses_region_name if aws_region_name is None else aws_region_name,
            aws_region_endpoint=stack.email.aws_ses_region_endpoint if aws_region_endpoint is None else aws_region_endpoint,
            aws_auto_throttle=stack.email.aws_ses_auto_throttle if aws_auto_throttle is None else aws_auto_throttle,
            aws_config=stack.email.aws_ses_config if aws_config is None else aws_config,
            dkim_domain=stack.email.dkim_domain if dkim_domain is None else dkim_domain,
            dkim_key=stack.email.dkim_key if dkim_key is None else dkim_key,
            dkim_selector=stack.email.dkim_selector if dkim_selector is None else dkim_selector,
            dkim_headers=stack.email.dkim_headers if dkim_headers is None else dkim_headers,
            ses_source_arn=stack.email.aws_ses_source_arn if ses_source_arn is None else ses_source_arn,
            ses_from_arn=stack.email.aws_ses_from_arn if ses_from_arn is None else ses_from_arn,
            ses_return_path_arn=stack.email.aws_ses_return_path_arn if ses_return_path_arn is None else ses_return_path_arn,
            **kwargs
        )

    def send_messages(self, email_messages):
        for email in email_messages:
            email.from_email = self.stack.email.from_email or email.from_email
        super().send_messages(email_messages)


class SMTPEmailBackend(SMTPBackend):
    def __init__(self, stack=None, host=None, port=None, username=None, password=None, use_tls=None, fail_silently=None,
                 use_ssl=None, timeout=None, ssl_keyfile=None, ssl_certfile=None, **kwargs):

        self.stack = stack
        super().__init__(
            host=stack.email.host if host is None else host,
            port=stack.email.port if port is None else port,
            username=stack.email.username if username is None else username,
            password=stack.email.password if password is None else password,
            use_tls=stack.email.use_tls if use_tls is None else use_tls,
            fail_silently=stack.email.fail_silently if fail_silently is None else fail_silently,
            use_ssl=stack.email.use_ssl if use_ssl is None else use_ssl,
            timeout=stack.email.timeout if timeout is None else timeout,
            ssl_keyfile=ssl_keyfile,  # TODO: stack.email.ssl_keyfile if ssl_keyfile is not None else ssl_keyfile,
            ssl_certfile=ssl_certfile,  # TODO: stack.email.ssl_certfile if ssl_certfile is not None else ssl_certfile,
            **kwargs)

    def send_messages(self, email_messages):
        for email in email_messages:
            email.from_email = self.stack.email.from_email or email.from_email
        super().send_messages(email_messages)


class StackEmailBackend:
    def __new__(cls, *args, **kwargs):
        stack = Stack.objects.all().first()
        if stack:
            if stack.email.backend == "SES":
                return SESEmailBackend(stack=stack, **kwargs)
            elif stack.email.backend == "SMTP":
                return SMTPEmailBackend(stack=stack, **kwargs)
            elif stack.email.backend == "CONSOLE":
                return ConsoleEmailBackend(*args, **kwargs)
            elif stack.email.backend == "IN_MEMORY":
                return InMemoryEmailBackend(*args, **kwargs)
            elif stack.email.backend == "DUMMY":
                return DummyEmailBackend(**kwargs)
            else:
                raise Exception(_("Invalid backend"))
        else:
            return ""
