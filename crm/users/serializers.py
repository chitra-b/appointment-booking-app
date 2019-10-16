from rest_framework import serializers, response, fields
from . import models
from django.contrib.auth.models import Group
import pytz
from django.utils.timezone import make_aware, is_naive, is_aware, get_current_timezone
from datetime import datetime


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Organizations
        fields = ('__all__')

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(many=True, queryset=Group.objects.all())

    class Meta:
        model = models.CustomUser
        fields = ('id','username', 'password', 'first_name', 'last_name', 'email', 'organization', 'user_mobile_number', 'groups')
        read_only_fields = ['organization']


    def to_representation(self, instance):
        response = super().to_representation(instance)
        response.pop('password')
        try:
            response['groups'] = GroupSerializer(instance.groups.all()[0]).data
        except IndexError as e:
            response['groups'] = None
        return response

    def create(self, validated_data):
        admin_user = models.CustomUser.objects.get(id=self.context['request'].user.id)
        new_user = models.CustomUser.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            user_mobile_number=validated_data['user_mobile_number'],
            organization_id=admin_user.organization_id)
        new_user.groups.add(validated_data['groups'][0])
        models.UserPreferences.objects.create(
            user_id=new_user.id
        )
        # return response.HttpResponseRedirect(redirect_to='https://google.com')
        return new_user


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ('username', 'password')


class UserPreferencesSerializer(serializers.ModelSerializer):
    available_days = fields.MultipleChoiceField(choices=models.UserPreferences.DAY_CHOICES)
    class Meta:
        model = models.UserPreferences
        fields = ('id', 'user_id', 'available_days', 'available_from',
                  'available_till', 'timezone_field', 'is_sms_preferred', 'is_mail_preferred')
        read_only_fields = ['user_id']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['timezone_field'] = str( response['timezone_field'])
        return response

    def create(self, validated_data):
        validated_data['available_days'] = list(validated_data['available_days'])
        pref_instance = models.UserPreferences.objects.create(**validated_data)
        return pref_instance


# class UserMetaSerializer(serializers.ModelSerializer):
#     user = UserSerializer()
#     class Meta:
#         model = models.UserMeta
#         fields = ('user', 'meta_key', 'meta_value')
#