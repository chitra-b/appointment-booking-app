# Generated by Django 2.2.1 on 2019-07-19 13:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20190719_1255'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpreferences',
            name='available_days',
            field=models.CharField(choices=[(0, 'Sunday'), (1, 'Monday'), (2, 'Tuesday'), (3, 'Wednesday'), (4, 'Thursday'), (5, 'Friday'), (6, 'Saturday')], max_length=15),
        ),
    ]
