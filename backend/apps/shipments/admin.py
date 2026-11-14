from django.contrib import admin

from .models import Shipment


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ("code", "sender_name", "route", "departure_slot", "created_at")
    list_filter = ("route", "created_at")
    search_fields = ("code", "sender_name", "cargo_description")
    readonly_fields = ("code", "created_at")