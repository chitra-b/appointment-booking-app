# Generated by Django 2.2.1 on 2019-07-19 12:55

from django.db import migrations
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20190719_0709'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpreferences',
            name='available_days',
            field=multiselectfield.db.fields.MultiSelectField(choices=[(0, 'Sunday'), (1, 'Monday'), (2, 'Tuesday'), (3, 'Wednesday'), (4, 'Thursday'), (5, 'Friday'), (6, 'Saturday')], max_length=13),
        ),
    ]
