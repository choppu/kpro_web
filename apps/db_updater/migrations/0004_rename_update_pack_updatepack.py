# Generated by Django 4.2.3 on 2023-07-17 10:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('db_updater', '0003_remove_update_pack_chain_json_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Update_Pack',
            new_name='UpdatePack',
        ),
    ]
