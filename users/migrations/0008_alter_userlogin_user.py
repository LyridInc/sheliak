# Generated by Django 3.2.15 on 2023-01-09 08:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_profile_extra_info'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userlogin',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_logins', to=settings.AUTH_USER_MODEL),
        ),
    ]