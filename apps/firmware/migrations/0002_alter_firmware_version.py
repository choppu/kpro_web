# Generated by Django 4.2.3 on 2023-11-15 06:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('firmware', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='firmware',
            name='version',
            field=models.CharField(default='1.0.0', max_length=10, unique=True),
        ),
    ]