from django.db import models
from users import models as user_model
from timezone_field import TimeZoneField
import pytz

class Clients(models.Model):
    client_name = models.CharField(
        max_length=50, blank=True, null=True)
    client_email_id = models.CharField(
        max_length=50, blank=False, null=False, unique=False)
    client_contact_mobile_number = models.CharField(
        max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'clients'

    def __str__(self):
        return "{}".format(self.client_name)


class ClientMeta(models.Model):
    client = models.ForeignKey(
        Clients, null=False, blank=False, on_delete=models.CASCADE)
    meta_key = models.CharField(
        max_length=255, blank=False, null=False)
    meta_value = models.CharField(
        max_length=255, blank=False, null = False)

    class Meta:
        unique_together = ('client', 'meta_key')
        db_table = 'client_meta'


class Services(models.Model):
    service_name = models.CharField(
        max_length=255, blank=False, null=False, unique=True)

    class Meta:
        db_table = 'services'

    def __str__(self):
        return "{}".format(self.service_name)


class Appointments(models.Model):
    date_created = models.DateTimeField(
        auto_now_add=True, blank=False, null=False)
    user = models.ForeignKey(
        user_model.CustomUser, on_delete=models.CASCADE, null=False, blank=False)
    client = models.ForeignKey(
        Clients, null=False, blank=False, on_delete=models.CASCADE)
    start_time = models.DateTimeField(blank=False, null=False)
    end_time = models.DateTimeField(blank=False, null=False)
    cancelled = models.BooleanField(default=False)
    cancellation_reason = models.CharField(
        max_length=255, blank=True, null=True)
    service = models.ForeignKey(
        Services, null=False, blank=False, on_delete=models.CASCADE)
    timezone_field = TimeZoneField(default='UTC', choices=[(tz, tz) for tz in pytz.all_timezones])
    notes = models.TextField(
        max_length=255, blank=True, null=True)
    lead_status = models.CharField(
        max_length=50, blank=False, null=False, default='Pending', choices = [
            ('Pending', 'Pending'),
            ('Closed', 'Closed'),
            ('Not Interested', 'Not Interested')
        ])
    event_identifier = models.CharField(
        max_length=255, blank=True, null=True, unique=False)


    class Meta:
        db_table = 'appointments'
        permissions = [
            ("can_view_own_appointments", "Can view own appointments"),
            ("can_view_peers_appointments", "Can view peers appointments"),
        ]
        ordering = ['start_time']

    def __str__(self):
        return "{} - {}".format(self.start_time, self.end_time)