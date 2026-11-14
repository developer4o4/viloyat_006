from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/routes/", include("apps.routes.urls")),
    path("api/shipments/", include("apps.shipments.urls")),
]