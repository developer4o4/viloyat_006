from django.urls import path

from .views import shipment_create


urlpatterns = [
    path("create/", shipment_create, name="shipment-create")
]