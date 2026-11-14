from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_GET

from .models import Route


@require_GET
def route_list(request):
    now = timezone.now()
    routes = Route.objects.filter(is_active=True).prefetch_related("slots").order_by("origin", "destination")
    results = []
    for route in routes:
        slots = []
        for slot in route.slots.all():
            if not slot.is_active or slot.departure_at <= now:
                continue
            available = slot.capacity - slot.shipments.count()
            if available > 0:
                slots.append({
                    "id": slot.id,
                    "departure_at": slot.departure_at.isoformat(),
                    "available": available,
                })
        if slots:
            results.append({
                "id": route.id,
                "origin": route.origin,
                "destination": route.destination,
                "slots": slots,
            })
    return JsonResponse({"routes": results})