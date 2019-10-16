from celery import shared_task, Celery
from . import gcal
celery = Celery('tasks', broker='amqp://guest@localhost//')
from appointments import models

@shared_task
def send_email(email_dict, appointment_id):
    """
    Sends email for appointment booked and map the event ID in appointment table
    :param email_dict:
        {
          'notes': 'My Meeting',
          'start_time': datetime.datetime(2019, 10, 24, 9, 0, tzinfo = < DstTzInfo 'Asia/Kolkata'
            IST + 5: 30: 00 STD > ),
          'end_time': datetime.datetime(2019, 10, 24, 9, 30, tzinfo = < DstTzInfo 'Asia/Kolkata'
            IST + 5: 30: 00 STD > ),
          'client': {
            'name': 'client1',
            'email': 'shyamsundar.tg@gmail.com'
          },
          'service': 'service_1',
          'users': [{
            'name': 'super',
            'email': 'super@test.com'
          }]
        }
    :param appointment_id: Appointment ID for which invite to be sent
    """
    event_identifier = gcal.send_invite_through_gcal(email_dict)
    models.Appointments.objects.filter(id=appointment_id).update(event_identifier=event_identifier)

@shared_task
def send_update_email(email_dict, event_id):
    """
    Sends reschedule email
    :param email_dict:
            {
          'start_time': datetime.datetime(2019, 10, 26, 8, 30, tzinfo = < DstTzInfo 'Asia/Kolkata'
            IST + 5: 30: 00 STD > ),
          'end_time': datetime.datetime(2019, 10, 26, 9, 0, tzinfo = < DstTzInfo 'Asia/Kolkata'
            IST + 5: 30: 00 STD > ),
          'notes': 'My Meeting',
          'cancelled': False,
          'cancellation_reason': ''
        }
    :param event_id: Event ID to be rescheduled
    """
    if 'cancelled' in email_dict:
        gcal.cancel_invite_through_gcal(email_dict, event_id)
    else:
        gcal.update_invite_through_gcal(email_dict, event_id)
