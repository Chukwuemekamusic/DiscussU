# Generated by Django 4.2 on 2023-07-19 08:10

import base.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_user_profile_pic'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to=base.models.get_upload_path),
        ),
    ]
