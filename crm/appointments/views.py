from users.models import CustomUser, UserPreferences
from . import models, serializers
from . import utils as my_utils
from rest_framework import status, views, permissions, viewsets, pagination
from datetime import datetime
from datetime import timedelta
from datetime import time
import calendar, pytz
from django.utils import timezone
from django.http import JsonResponse, HttpResponse
from rest_framework import serializers as django_serializer
import django_filters


def get_default_user_preference(user_id):
    user_preferences = UserPreferences()
    try:
        user_preferences = UserPreferences.objects.get(user_id=user_id)
    except UserPreferences.DoesNotExist:
        """
        Return the default preferences if query set returns empty preferences
        """
        user_preferences.timezone_field = UserPreferences._meta.get_field('timezone_field').get_default()
        user_preferences.available_days = UserPreferences._meta.get_field('available_days').get_default()
        user_preferences.available_from = datetime.strptime(
            UserPreferences._meta.get_field('available_from').get_default(), '%H:%M:%S.%f').time()
        user_preferences.available_till = datetime.strptime(
            UserPreferences._meta.get_field('available_till').get_default(), '%H:%M:%S.%f').time()
    return user_preferences


# class SendEmail(viewsets.ModelViewSet):
#     def list(self, request, *args, **kwargs):
#         return HttpResponse("<h1>" + str(tasks.send_email.delay('hello')) + "</h1>")

class AppointmentsFilter(django_filters.FilterSet):
    user = django_filters.CharFilter(lookup_expr='icontains', field_name='user__username')
    start_time = django_filters.DateFromToRangeFilter()
    end_time = django_filters.DateFromToRangeFilter()
    # cancelled = django_filters.BooleanFilter(field_name='cancelled')

    class Meta:
        model = models.Appointments
        fields = ['user', 'start_time', 'end_time', 'cancelled']


class AppointmentsViewSet(viewsets.ModelViewSet):
    """
    Handles managing user preferences
    """

    queryset = models.Appointments.objects.filter
    serializer_class = serializers.AppointmentSerializer
    pagination_class = pagination.PageNumberPagination
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filter_class = AppointmentsFilter
    filter_fields = ('cancelled')

    def get_permissions(self):
        permission_classes = [permissions.IsAuthenticated()]
        if self.action in ['update', 'partial_update', 'destroy', 'list']:
            permission_classes = [permissions.IsAuthenticated()]
        elif self.action in ['create']:
            permission_classes = [permissions.AllowAny()]
        return permission_classes

    def get_queryset(self):  # get
        current_user = CustomUser.objects.get(id=self.request.user.id)
        users = CustomUser.objects.filter(organization_id=current_user.organization_id)
        user_pref = get_default_user_preference(self.request.user.id)
        """
        Display appointments of all the users in Admin's organization
        """
        if self.request.user.has_perm('appointments.can_view_peers_appointments'):
            appointments = models.Appointments.objects.filter(user_id__in=[user.id for user in users])
        else:
            """
            For non admin users, return own appointments
            """
            appointments = models.Appointments.objects.filter(
                id=self.request.user.id)
        appointments_in_user_tz = my_utils.AppointmentUtils().convert_utc_to_user_tz(
            appointments=appointments, timezone=user_pref.timezone_field)
        return appointments_in_user_tz


class AppointmentBookingViewSet(viewsets.ModelViewSet):
    queryset = models.Appointments.objects.all()
    serializer_class = serializers.AppointmentSerializer
    lookup_field = 'user'
    pagination_class = None

    def retrieve(self, request, *args, **kwargs):
        try:
            user_instance = CustomUser.objects.get(username=kwargs['user'])
            user_preferences = get_default_user_preference(user_instance.id)
            """
            Set timezone value either to timezone from query parameters
            or to user preferred timezone
            """
            if self.request.query_params.get('timezone', None):
                client_timezone_value = self.request.query_params.get('timezone')
            else:
                client_timezone_value = user_preferences.timezone_field
            client_timezone_value = pytz.timezone(str(client_timezone_value))

            """
            Time to Datetime and make it aware w.r.t user pref timezone
            and convert to client timezone
            """
            pref_timezone = pytz.timezone(str(user_preferences.timezone_field))
            date_today_in_pref_timezone = datetime.now(pytz.timezone(str(client_timezone_value))).date()
            avail_from_dt = timezone.make_aware(datetime.combine(
                date_today_in_pref_timezone,
                user_preferences.available_from),
            pref_timezone)
            avail_to_dt = timezone.make_aware(datetime.combine(
                date_today_in_pref_timezone,
                user_preferences.available_till),
            pref_timezone)
            avail_from_dt_client_tz = avail_from_dt.astimezone(client_timezone_value)
            avail_to_dt_client_tz = avail_to_dt.astimezone(client_timezone_value)

            """
            Get start and end time range  in aware datetime for getting slots
            """

            current_client_time = timezone.localtime(timezone=client_timezone_value)
            # String(YYYY-MM) to datetime object
            start_time = datetime.strptime(self.request.query_params.get('month'), '%Y-%m')
            start_time_aware = my_utils.AppointmentUtils().round_minutes(
                timezone.make_aware(start_time, client_timezone_value),
                int(self.request.query_params.get('slot_duration')))
            if start_time_aware <= current_client_time:
                start_time_aware = my_utils.AppointmentUtils().round_minutes(
                timezone.localtime(timezone=client_timezone_value),
                int(self.request.query_params.get('slot_duration')))
            end_date = datetime.strptime("{}-{}-{}".format(
                start_time.year,
                start_time.month,
                calendar.monthrange(start_time.year, start_time.month)[1]), '%Y-%m-%d')
            end_date += timedelta(days=1)
            end_date_aware = timezone.make_aware(end_date, client_timezone_value)
            start_end = (start_time_aware, end_date_aware)

            # Get appointments coming b/w start and end range of slot for the current user
            user_appointments = self.queryset.filter(
                user_id=user_instance.id,
                start_time__year=start_time_aware.year,
                start_time__month=start_time_aware.month,
                end_time__year=start_time_aware.year,
                end_time__month=start_time_aware.month,
            )
            """
            Get appointments for employee in client Timezone
            """
            appointments = []
            for appointment_instance in user_appointments:
                start_time_client_tz = appointment_instance.start_time.astimezone(client_timezone_value)
                end_time_client_tz = appointment_instance.end_time.astimezone(client_timezone_value)
                appointments.append((start_time_client_tz, end_time_client_tz))

            # To get slots
            slots = my_utils.AppointmentUtils().get_slots(
                start_end, appointments,
                user_preferences.available_days,
                avail_from_dt_client_tz,
                avail_to_dt_client_tz,
                client_timezone_value,
                pref_timezone,
                timedelta(minutes=int(self.request.query_params.get('slot_duration'))),
                )
            return JsonResponse(slots, status=status.HTTP_200_OK)
        except Exception as e:
            raise django_serializer.ValidationError({"detail": e}, status.HTTP_400_BAD_REQUEST)


