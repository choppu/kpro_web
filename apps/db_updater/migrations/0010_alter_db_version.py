# Generated by Django 4.2.3 on 2023-11-15 06:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db_updater', '0009_alter_db_options_alter_db_version'),
    ]

    operations = [
        migrations.AlterField(
            model_name='db',
            name='version',
            field=models.CharField(default='20231115', max_length=12),
        ),
    ]