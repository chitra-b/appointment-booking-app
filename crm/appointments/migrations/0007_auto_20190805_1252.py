# Generated by Django 2.2.1 on 2019-08-05 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0006_auto_20190805_1218'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appointments',
            name='status',
        ),
        migrations.AddField(
            model_name='appointments',
            name='lead_status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Closed', 'Closed'), ('Not Interested', 'Not Interested')], default='pending', max_length=50),
        ),
    ]
