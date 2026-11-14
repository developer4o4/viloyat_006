from django.urls import path

from .views import shipment_create, shipment_status


urlpatterns = [
    path("create/", shipment_create, name="shipment-create"),
    path("status/", shipment_status, name="shipment-status"),
]