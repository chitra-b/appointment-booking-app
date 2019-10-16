from . import models, serializers
from rest_framework.response import Response
from rest_framework import status, generics, views, permissions, viewsets, mixins, pagination
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect, JsonResponse
from . import permissions as custom_permission
import uuid, pytz, json
from django.contrib.auth import logout
from django.contrib.auth.models import Group
from django.utils import timezone
import django_filters
from rest_framework import filters

class GroupViewset(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer


class OrganizationViewset(viewsets.ModelViewSet):
    queryset = models.Organizations.objects.all()
    serializer_class = serializers.OrganizationSerializer


class UserProfileViewSet(
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):
    """
    This class takes care of user registration
    """
    queryset = models.CustomUser.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return models.CustomUser.objects.filter(
            id=self.request.user.id)


class UserLoginViewSet(viewsets.GenericViewSet):
    """
    This class takes care of login

    """
    queryset = models.CustomUser.objects.all()
    serializer_class = serializers.UserLoginSerializer

    def create(self, request, *args, **kwargs):
        user = authenticate(
            username=request.POST.get('username'),
            password=request.POST.get('password'))
        if user:
            login(request, user)
            return Response("Registered & Logged in", status=status.HTTP_202_ACCEPTED)
        return Response("User login failed", status=status.HTTP_401_UNAUTHORIZED)


class UserLogoutAllView(views.APIView):
    """
    Use this endpoint to log out all sessions for a given user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        user.jwt_secret = uuid.uuid4()
        user.save()
        logout(request)
        return JsonResponse({'data' : 'Logged out'}, status=status.HTTP_202_ACCEPTED)


class UserPreferencesViewSet(viewsets.ModelViewSet):
    """
    Handles managing user preferences
    """
    queryset = models.UserPreferences.objects.all()
    serializer_class = serializers.UserPreferencesSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    # lookup_field = 'user'

    def get_queryset(self):
        return models.UserPreferences.objects.filter(
            user_id=self.request.user.id)

    def perform_create(self, serializer):
        serializer.save(user_id = self.request.user.id)


class TimezoneView(views.APIView):
    """
    To list timezones
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return JsonResponse({'data': [tz for tz in pytz.all_timezones]}, status=status.HTTP_202_ACCEPTED)



class CurrentTimezoneView(views.APIView):
    """
    To list timezones
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return JsonResponse({'data': str(timezone.get_current_timezone())}, status=status.HTTP_202_ACCEPTED)


class UserListViewSet(viewsets.ModelViewSet):
    queryset = models.CustomUser.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [custom_permission.HasGroupPermission, permissions.IsAuthenticated]
    pagination_class = pagination.PageNumberPagination
    # filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    # filterset_fields = ['username']
    filter_backends = [filters.SearchFilter]
    search_fields = ['username']
    required_groups = {
        'GET': ['admin'],
        'POST': ['admin'],
        'PUT': ['admin'],
        'DELETE' : ['admin'],
        'PATCH' : ['admin']
    }

    def get_queryset(self):
        admin_user = models.CustomUser.objects.get(id=self.request.user.id)
        return models.CustomUser.objects.filter(
            organization_id=admin_user.organization_id)

    def destroy(self, request, *args, **kwargs):
        body_unicode = request.body.decode('utf-8')
        if body_unicode:
            body = json.loads(body_unicode)
            if 'users' in body:
                try:
                    user_list = body['users']
                    if user_list:
                        for user in user_list:
                            instance = models.CustomUser.objects.get(id=user)
                            self.perform_destroy(instance)
                        return Response(status=status.HTTP_204_NO_CONTENT)
                    return Response({"detail": "User list empty"}, status=status.HTTP_400_BAD_REQUEST)
                except Exception as e:
                    return Response({"detail":str(e)}, status=status.HTTP_501_NOT_IMPLEMENTED)
            return Response({"detail":"Missing users list"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Missing users list"}, status=status.HTTP_400_BAD_REQUEST)


