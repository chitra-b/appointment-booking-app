from django.contrib import admin
from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = DefaultRouter()
router.register('user_preferences', views.UserPreferencesViewSet, basename='user_preferences')
router.register('user_profile', views.UserProfileViewSet, basename='user_profile')
router.register('users', views.UserListViewSet, basename='users')
router.register('groups', views.GroupViewset, basename='groups')
# router.register('timezones', views.TimezoneViewset, basename='timezones')

urlpatterns = [
    # path('login/', views.UserLoginViewSet.as_view({'post' : 'create'}), name='login'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', views.UserLogoutAllView.as_view(), name='logout'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('timezones/', views.TimezoneView.as_view(), name='timezones'),
    path('current_timezone/', views.CurrentTimezoneView.as_view(), name='current_timezone')
]

urlpatterns += router.urls
