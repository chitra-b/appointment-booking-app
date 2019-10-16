from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Organizations


class CustomUserAdmin(UserAdmin):
    model = CustomUser

    fieldsets = UserAdmin.fieldsets + (
            (None, {'fields': ('user_mobile_number','organization',)}),
    )

class OrganizationAdmin(admin.ModelAdmin):
    model = Organizations

    class Meta:
        verbose_name_plural = "Organizations"

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Organizations, OrganizationAdmin)