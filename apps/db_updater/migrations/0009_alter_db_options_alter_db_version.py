# Generated by Django 4.2.3 on 2023-09-19 02:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db_updater', '0008_db_delete_updatedb'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='db',
            options={'verbose_name_plural': 'DB'},
        ),
        migrations.AlterField(
            model_name='db',
            name='version',
            field=models.CharField(default='20230919', max_length=12),
        ),
    ]
