from django.db import models
from django.contrib.auth.models import AbstractUser
from django_mysql.models import ListCharField
from timezone_field import TimeZoneField
import pytz
from multiselectfield import MultiSelectField


class Organizations(models.Model):
    org_name = models.CharField(
        max_length=40, blank=False, null=False)

    def __str__(self):
        return self.org_name

    class Meta:
        db_table = 'organizations'
        verbose_name_plural = "Organizations"


class CustomUser(AbstractUser):
    user_mobile_number = models.CharField(
        max_length=25, unique=False, blank=False, null=False)
    organization = models.ForeignKey(
        Organizations, null=True, blank=True, on_delete=models.CASCADE)
    email = models.EmailField(('email address'), unique=True, blank=False, null=False)

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'users'


class UserPreferences(models.Model):
    user = models.OneToOneField(
        CustomUser, null=False, blank=False, on_delete=models.CASCADE)
    MON = "0"
    TUE = "1"
    WED = "2"
    THU = "3"
    FRI = "4"
    SAT = "5"
    SUN = "6"
    DAY_CHOICES = (
        (MON, 'Monday'),
        (TUE, 'Tuesday'),
        (WED, 'Wednesday'),
        (THU, 'Thursday'),
        (FRI, 'Friday'),
        (SAT, 'Saturday'),
        (SUN, 'Sunday'),
    )
    available_days = MultiSelectField(
        max_length=25, unique=False, blank=False, null=False, choices=DAY_CHOICES, default=["0", "1", "2", "3", "4"])
    available_from = models.TimeField(
        blank=False, null=False, default='09:0:00.000000')
    available_till = models.TimeField(
        blank=False, null=False, default='18:0:00.000000')
    timezone_field = TimeZoneField(default='UTC', choices=[(tz, tz) for tz in pytz.all_timezones])
    is_sms_preferred = models.BooleanField(default=False)
    is_mail_preferred = models.BooleanField(default=True)

    def __str__(self):
        return "{}, {} , {}, {}".format(self.user, self.available_days, self.available_from, self.available_till)

    class Meta:
        db_table = 'user_preferences'


class UserMeta(models.Model):
    user = models.ForeignKey(
        CustomUser, null=False, blank=False, on_delete=models.CASCADE)
    meta_key = models.CharField(
        max_length=255, blank=False, null=False)
    meta_value = models.CharField(
        max_length=255, blank=False, null = False)

    class Meta:
        db_table = 'user_meta'
        unique_together = ('user', 'meta_key')

    def __str__(self):
        return self.user



