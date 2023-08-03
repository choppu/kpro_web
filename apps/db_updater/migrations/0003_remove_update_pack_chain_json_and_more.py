# Generated by Django 4.2.3 on 2023-07-17 09:35

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('db_updater', '0002_rename_db_pack_update_pack'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='update_pack',
            name='chain.json',
        ),
        migrations.RemoveField(
            model_name='update_pack',
            name='erc20.json',
        ),
        migrations.RemoveField(
            model_name='update_pack',
            name='pub_date',
        ),
        migrations.AddField(
            model_name='update_pack',
            name='chain_url',
            field=models.TextField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='update_pack',
            name='creation_date',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='update_pack',
            name='erc20_url',
            field=models.TextField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='update_pack',
            name='version',
            field=models.TextField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
