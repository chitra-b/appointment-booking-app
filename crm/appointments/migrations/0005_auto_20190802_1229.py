# Generated by Django 2.2.1 on 2019-08-02 12:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0004_auto_20190802_1200'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='appointments',
            options={'permissions': [('can_view_own_appointments', 'Can view own appointments'), ('can_view_peers_appointments', 'Can view peers appointments')]},
        ),
    ]
