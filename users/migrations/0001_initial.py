# Generated by Django 3.0.5 on 2020-11-29 16:01

from django.db import migrations, models
import django.utils.timezone
import phonenumber_field.modelfields
import timezone_field.fields
import users.models.user
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('email', users.models.user.LowercaseEmailField(error_messages={'unique': 'A user is already registered with this email address'}, max_length=254, unique=True, verbose_name='email address')),
                ('gender', models.CharField(blank=True, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Others'), ('', None)], max_length=1)),
                ('first_name', models.CharField(max_length=150, verbose_name='first name')),
                ('middle_name', models.CharField(blank=True, max_length=150, verbose_name='middle name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('picture', models.URLField(blank=True, max_length=1024)),
                ('date_of_birth', models.DateField(blank=True, null=True)),
                ('nationality', models.CharField(blank=True, max_length=100)),
                ('address', models.TextField(blank=True)),
                ('mobile_number', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, region=None)),
                ('timezone', timezone_field.fields.TimeZoneField(default='UTC')),
                ('invite_code', models.CharField(blank=True, max_length=255)),
                ('company', models.CharField(blank=True, max_length=1024)),
                ('legacy_id', models.CharField(blank=True, max_length=255)),
                ('logins_count', models.PositiveIntegerField(default=0)),
                ('last_ip', models.GenericIPAddressField(blank=True, null=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'ordering': ['id'],
            },
            managers=[
                ('objects', users.models.user.UserManager()),
            ],
        ),
    ]