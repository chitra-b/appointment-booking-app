# Generated by Django 2.2.1 on 2019-07-19 13:26

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_auto_20190719_1325'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpreferences',
            name='available_days',
            field=django_mysql.models.ListCharField(models.CharField(max_length=15), default="['mon', 'tue', 'wed', 'thu', 'fri']", max_length=112, size=7),
        ),
    ]
