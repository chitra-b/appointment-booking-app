from django.utils import timezone
from datetime import datetime
from datetime import timedelta, date
import pytz

class AppointmentUtils():
    def __init__(self):
        pass

    def round_minutes(self, input_datetime, step):
        """
        round up to nearest step-minutes
        :param step: Step up minutes
        :return: Rounded datetime
        """
        change = timedelta(
            minutes=input_datetime.minute % step,
            seconds=input_datetime.second,
            microseconds=input_datetime.microsecond
        )

        if change > timedelta():
            change -= timedelta(minutes=step)

        return input_datetime - change

    def convert_utc_to_user_tz(self, appointments, timezone):
        """
        To convert appointments in appointment queryset to the required
        timezone field
        :param appointments: QS containing appointments
            <QuerySet [<Appointments: 2019-08-27 02:30:00+00:00 - 2019-08-27 03:30:00+00:00>,
             <Appointments: 2019-08-26 21:00:00+00:00 - 2019-08-26 22:00:00+00:00>,
             <Appointments: 2019-08-26 15:30:00+00:00 - 2019-08-26 16:30:00+00:00>,
             <Appointments: 2019-08-26 10:00:00+00:00 - 2019-08-26 11:00:00+00:00>,
             <Appointments: 2019-08-26 04:30:00+00:00 - 2019-08-26 05:30:00+00:00>,
             <Appointments: 2019-08-25 23:00:00+00:00 - 2019-08-26 00:00:00+00:00>,
             <Appointments: 2019-08-25 17:30:00+00:00 - 2019-08-25 18:30:00+00:00>,
             <Appointments: 2019-08-20 18:00:00+00:00 - 2019-08-20 19:00:00+00:00>]>
        :param timezone: Timezone field
            Asia/Kolkata
        :return: appointments in user timezone given
            <QuerySet [<Appointments: 2019-08-27 08:00:00+05:30 - 2019-08-27 09:00:00+05:30>,
             <Appointments: 2019-08-27 02:30:00+05:30 - 2019-08-27 03:30:00+05:30>,
              <Appointments: 2019-08-26 21:00:00+05:30 - 2019-08-26 22:00:00+05:30>,
               <Appointments: 2019-08-26 15:30:00+05:30 - 2019-08-26 16:30:00+05:30>,
               <Appointments: 2019-08-26 10:00:00+05:30 - 2019-08-26 11:00:00+05:30>,
               <Appointments: 2019-08-26 04:30:00+05:30 - 2019-08-26 05:30:00+05:30>,
               <Appointments: 2019-08-25 23:00:00+05:30 - 2019-08-26 00:00:00+05:30>,
               <Appointments: 2019-08-20 23:30:00+05:30 - 2019-08-21 00:30:00+05:30>]>

        """
        for appointment in appointments:
            appointment.start_time = appointment.start_time.astimezone(pytz.timezone(str(timezone)))
            appointment.end_time = appointment.end_time.astimezone(pytz.timezone(str(timezone)))
        return appointments

    def convert_slot_to_client_tz(self, validated_data):
        """
        To convert the received datetime slot to date time aware in client timezone
        :param validated_data: User I/P to create or update slot
        :return:
        """
        """
        Convert DateTime to String
        """
        validated_data['start_time'] = validated_data['start_time'].strftime("%Y-%m-%d %H:%M:%S")
        validated_data['end_time'] = validated_data['end_time'].strftime("%Y-%m-%d %H:%M:%S")
        """
        Convert String to Datetime object in Client Timezone
        """
        validated_data['start_time'] = pytz.timezone(str(validated_data['timezone_field'])).localize(datetime.strptime(
            validated_data['start_time'],
            "%Y-%m-%d %H:%M:%S"))
        validated_data['end_time'] = pytz.timezone(str(validated_data['timezone_field'])).localize(datetime.strptime(
            validated_data['end_time'],
            "%Y-%m-%d %H:%M:%S"))
        return validated_data

    def get_slots(self, slots, appointments, preferrable_days, avail_from,
            avail_to, client_timezone, user_pref_timezone, duration=timedelta(minutes=30)):
        """
        :param slots: start to end time in client timezone
            Ex - (datetime.datetime(2019, 7, 19, 10, 30, tzinfo=<UTC>),
            datetime.datetime(2019, 7, 31, 0, 0, tzinfo=<UTC>))
        :param appointments: Appointments - List of tuples in client timezone
            Ex  - [(datetime.datetime(2019, 7, 22, 11, 0, tzinfo=<UTC>),
             datetime.datetime(2019, 7, 22, 12, 0, tzinfo=<UTC>))]
        :param preferrable_days: Available days (MultiSelectField object)
            {'choices': {'0': 'Monday', '1': 'Tuesday', '2': 'Wednesday',
             '3': 'Thursday', '4': 'Friday', '5': 'Saturday', '6': 'Sunday'}}
        :param avail_from: Available from in aware datetime (in client timezone)
            2019-07-24 08:00:00+05:30
        :param avail_to: Available to in aware datetime ((in client timezone)
            2019-07-24 18:00:00+05:30
        :param client_timezone: Client Timezone
        :param user_pref_timezone: User preferred timezone
        :param duration: appointment duration (In minutes)
        :return: List of dictionaries of appointment availability
            Ex -
            {  
           "days":[  
              {  
                 "date":"2019-07-19",
                 "status":"available",
                 "spots":[  
                    {  
                       "start_time":"10:30 AM",
                       "end_time":"10:45 AM",
                       "slot":"10:30 AM - 10:45 AM"
                    },
                     …..            {  
                       "start_time":"11:30 PM",
                       "end_time":"11:45 PM",
                       "slot":"11:30 PM - 11:45 PM"
                    },
                    {  
                       "start_time":"11:45 PM",
                       "end_time":"12:00 AM",
                       "slot":"11:45 PM - 12:00 AM"
                    }
                 ]
              }
           ],
           "today":"2019-07-18",
           "availability_timezone":"Asia\\/Kolkata"
        }
        """
        response = {
            "days": [],
            "today": avail_from.date(),
            "availability_timezone": str(client_timezone),
        }
        if not slots:
            return response

        avail_slots = sorted([(slots[0], slots[0])] + appointments + [(slots[1], slots[1])])
        for index, appointment in enumerate(appointments):
            if appointment[0] < slots[0] or appointment[1] > slots[1]:
                avail_slots.remove(appointment)
        for start, end in ((avail_slots[i][1], avail_slots[i + 1][0]) for i in range(len(avail_slots) - 1)):
            # assert start <= end, "Cannot attend all appointments"
            while start + duration <= end:
                weekday_in_pref_tz = str(start.astimezone(user_pref_timezone).weekday())
                if weekday_in_pref_tz not in preferrable_days:
                    start += duration
                    continue
                if not (self.check_if_preferred(avail_from, avail_to, start, start + duration)):
                    start += duration
                    continue
                current_day = "{:%Y-%m-%d}".format(start)
                found = False
                if response['days']:
                    for item in response['days']:
                        if current_day in item.values():
                            item["spots"].append(
                                {
                                    "start_time": "{:%I:%M %p}".format(start),
                                    "end_time": "{:%I:%M %p}".format(start + duration),
                                    "slot": "{:%I:%M %p} - {:%I:%M %p}".format(start, start + duration)
                                })
                            found = True
                            break
                    if not found:
                        response["days"].append({
                            "date": current_day,
                            "status": "available",
                            "spots": [
                                {
                                    "start_time": "{:%I:%M %p}".format(start),
                                    "end_time": "{:%I:%M %p}".format(start + duration),
                                    "slot": "{:%I:%M %p} - {:%I:%M %p}".format(start, start + duration)
                                }
                            ]
                        })
                else:
                    response["days"].append({
                        "date": current_day,
                        "status": "available",
                        "spots": [
                            {
                                "start_time": "{:%I:%M %p}".format(start),
                                "end_time": "{:%I:%M %p}".format(start + duration),
                                "slot": "{:%I:%M %p} - {:%I:%M %p}".format(start, start + duration)
                            }
                        ]
                    })
                start += duration
        return response

    def check_if_preferred(self, avail_from, avail_to, start, end):
        """
        To check if the given start and end time for slot lies
        between employee's available slot
        :param avail_from: (dt) Employee available from (In client TZ)
        :param avail_to: (dt) Employee available up to (In client TZ)
        :param start: (dt) Start time for particular slot
        :param end: (dt) Start time for particular slot
        :return: True if the slot falls b/w employee's available timings
            False otherwise
        """
        avail_from_time = datetime.strptime("{:%H:%M}".format(avail_from), '%H:%M').time()
        avail_to_time = datetime.strptime("{:%H:%M}".format(avail_to), '%H:%M').time()
        start_time = datetime.strptime("{:%H:%M}".format(start), '%H:%M').time()
        end_time = datetime.strptime('{:%H:%M}'.format(end), '%H:%M').time()
        if avail_from_time < avail_to_time:
            slots = [
                [avail_from_time, avail_to_time]
            ]
        else:
            slots = [
                [avail_from_time, datetime.strptime('23:59', '%H:%M').time()],
                [datetime.strptime('00:00', '%H:%M').time(), avail_to_time]
            ]
        for slot in slots:
            if slot[0] <= start_time <= slot[1] and \
                 slot[0] <= end_time <= slot[1]:
                return True
        return False
