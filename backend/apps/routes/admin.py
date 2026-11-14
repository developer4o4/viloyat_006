from django.contrib import admin

from .models import DepartureSlot, Route


class DepartureSlotInline(admin.TabularInline):
    model = DepartureSlot
    extra = 1


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ("origin", "destination", "is_active")
    list_filter = ("is_active",)
    search_fields = ("origin", "destination")
    inlines = (DepartureSlotInline,)


@admin.register(DepartureSlot)
class DepartureSlotAdmin(admin.ModelAdmin):
    list_display = ("route", "departure_at", "capacity", "is_active")
    list_filter = ("is_active", "departure_at")