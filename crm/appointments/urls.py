from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('appointments', views.AppointmentsViewSet, basename='appointments')
router.register('appointment_booking', views.AppointmentBookingViewSet, basename='appointment_booking')
urlpatterns = [
]


urlpatterns += router.urls
