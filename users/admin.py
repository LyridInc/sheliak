from django import forms
from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.admin.utils import model_ngettext
from graphql_auth.models import UserStatus
from social_django.models import UserSocialAuth

from users.models import Profile
from users.emails import force_user_to_reset_password, force_user_to_reset_password_security_update

User = get_user_model()


class UserSocialInlineForm(forms.ModelForm):
    class Meta:
        model = UserSocialAuth
        exclude = ()


class UserSocialInline(admin.StackedInline):
    model = UserSocialAuth
    form = UserSocialInlineForm
    can_delete = False
    verbose_name_plural = ''
    max_num = 0

    fieldsets = (
        (None, {
            'fields': ('provider', 'uid', 'extra_data', )
        }),
    )
    readonly_fields = ('provider', 'uid', 'extra_data', )


class UserProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    fk_name = 'user'
    max_num = 1


class UserStatusInline(admin.StackedInline):
    model = UserStatus
    can_delete = False
    verbose_name_plural = ''
    fk_name = 'user'
    max_num = 1

    fieldsets = (
        (None, {
            'fields': ('verified', 'archived', 'secondary_email')
        }),
    )
    readonly_fields = ('secondary_email', )


class CustomUserAdmin(UserAdmin):
    def get_fieldsets(self, request, obj=None):
        if not obj:
            self.add_fieldsets = (
                (None, {
                    'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
                    'description': '<p class="text-primary">Please complete this form to create user.</p>'
                }),
            )
            return self.add_fieldsets

        self.fieldsets = (
            (None, {
                'fields': ('email', 'first_name', 'middle_name', 'last_name', 'mobile_number')
            }),
            ('Settings', {
                'fields': ('password', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
            }),
            ('Statistics', {
                'fields': ('last_login', 'date_joined', 'modified')
            }),
        )
        return self.fieldsets

    ordering = ('-date_joined',)
    empty_value_display = '-'
    actions = ('send_force_password_set_email', 'send_force_password_set_email_security_update')
    search_fields = ('first_name', 'middle_name', 'last_name', 'email', )
    readonly_fields = ('last_login', 'date_joined', 'modified')
    list_display = ('email', 'get_full_name', 'is_staff', 'date_joined', 'last_login' )

    def add_view(self, *args, **kwargs):
        self.inlines = []
        return super().add_view(*args, **kwargs)

    def change_view(self, *args, **kwargs):
        self.inlines = [UserProfileInline, UserStatusInline, UserSocialInline ]
        return super().change_view(*args, **kwargs)

    def send_force_password_set_email(self, request, queryset):
        """
        Sends an email to force the user to reset their passwords.
        THIS WILL MAKE CURRENT PASSWORD AS UNUSABLE.
        """
        n = 0
        for user in queryset:
            user.set_unusable_password()
            user.save()
            force_user_to_reset_password(user)
            n += 1

        self.message_user(request, 'Force password reset email sent to %(count)d %(items)s.' %
                          {'count': n, 'items': model_ngettext(self.opts, n)}, messages.SUCCESS)
    send_force_password_set_email.short_description = 'Force user to reset their password'

    def send_force_password_set_email_security_update(self, request, queryset):
        """
        Sends an email to force the user to reset their passwords due to security updates.
        THIS WILL MAKE CURRENT PASSWORD AS UNUSABLE.
        """
        n = 0
        for user in queryset:
            user.set_unusable_password()
            user.save()
            force_user_to_reset_password_security_update(user)
            n += 1

        self.message_user(request, 'Force password reset email (security update) sent to %(count)d %(items)s.' %
                          {'count': n, 'items': model_ngettext(self.opts, n)}, messages.SUCCESS)
    send_force_password_set_email_security_update.short_description = '[Security Update] Force user to reset their ' \
                                                                      'password'


admin.site.register(User, CustomUserAdmin)
