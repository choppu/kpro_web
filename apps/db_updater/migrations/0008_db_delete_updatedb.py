# Generated by Django 4.2.3 on 2023-07-28 12:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db_updater', '0007_updatedb_db_hash_alter_updatedb_version'),
    ]

    operations = [
        migrations.CreateModel(
            name='DB',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('erc20_url', models.CharField(blank=True, max_length=2000, null=True)),
                ('chain_url', models.CharField(blank=True, max_length=2000, null=True)),
                ('version', models.CharField(default='202307281439', max_length=12)),
                ('creation_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('db_hash', models.CharField(blank=True, default=None, max_length=64, null=True, unique=True)),
            ],
        ),
        migrations.DeleteModel(
            name='UpdateDB',
        ),
    ]