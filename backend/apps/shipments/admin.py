from django.contrib import admin, messages

from .models import Shipment


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ("code", "sender_name", "route", "departure_slot", "status", "created_at")
    list_filter = ("status", "route", "created_at")
    search_fields = ("code", "sender_name", "cargo_description")
    readonly_fields = ("code", "created_at", "tracking_token_hash")
    actions = ("approve_shipments", "reject_shipments")

    @admin.action(description="Tanlangan yuklarni tasdiqlash")
    def approve_shipments(self, request, queryset):
        updated = queryset.update(status=Shipment.Status.APPROVED)
        self.message_user(request, f"{updated} ta yuk tasdiqlandi.", messages.SUCCESS)

    @admin.action(description="Tanlangan yuklarni rad etish")
    def reject_shipments(self, request, queryset):
        updated = queryset.update(status=Shipment.Status.REJECTED)
        self.message_user(request, f"{updated} ta yuk rad etildi.", messages.WARNING)