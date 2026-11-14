import hashlib
import json
import secrets

from django.db import transaction
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from apps.routes.models import DepartureSlot

from .models import Shipment


def serialize_shipment(shipment):
    return {
        "id": shipment.id,
        "code": shipment.code,
        "status": shipment.status,
        "status_label": shipment.get_status_display(),
        "sender_name": shipment.sender_name,
        "cargo_description": shipment.cargo_description,
        "origin": shipment.route.origin,
        "destination": shipment.route.destination,
        "departure_at": shipment.departure_slot.departure_at.isoformat(),
        "created_at": shipment.created_at.isoformat(),
    }


@csrf_exempt
@require_POST
def shipment_create(request):
    try:
        payload = json.loads(request.body)
        route_id = int(payload.get("route_id", 0))
        slot_id = int(payload.get("slot_id", 0))
    except (json.JSONDecodeError, UnicodeDecodeError, TypeError, ValueError):
        return JsonResponse({"error": "So'rov ma'lumotlari noto'g'ri."}, status=400)

    sender_name = str(payload.get("sender_name", "")).strip()
    description = str(payload.get("cargo_description", "")).strip()
    if not sender_name or not description:
        return JsonResponse({"error": "Ism va yuk tavsifi majburiy."}, status=400)
    if len(sender_name) > 120 or len(description) > 2000:
        return JsonResponse({"error": "Ism yoki yuk tavsifi belgilangan chegaradan uzun."}, status=400)

    try:
        with transaction.atomic():
            slot = DepartureSlot.objects.select_for_update().select_related("route").get(
                pk=slot_id,
                route_id=route_id,
                route__is_active=True,
                is_active=True,
            )
            if slot.departure_at <= timezone.now():
                return JsonResponse({"error": "Tanlangan qatnov vaqti o'tib ketgan."}, status=400)
            if Shipment.objects.filter(departure_slot=slot).count() >= slot.capacity:
                return JsonResponse({"error": "Bu qatnov uchun joy qolmagan."}, status=409)
            tracking_token = secrets.token_urlsafe(32)
            shipment = Shipment.objects.create(
                tracking_token_hash=hashlib.sha256(tracking_token.encode()).hexdigest(),
                route=slot.route,
                departure_slot=slot,
                sender_name=sender_name,
                cargo_description=description,
            )
    except DepartureSlot.DoesNotExist:
        return JsonResponse({"error": "Tanlangan yo'nalish yoki qatnov mavjud emas."}, status=404)

    return JsonResponse({
        "shipment": serialize_shipment(shipment),
        "tracking_token": tracking_token,
    }, status=201)


@csrf_exempt
@require_POST
def shipment_status(request):
    try:
        payload = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "So'rov formati noto'g'ri."}, status=400)

    tracking_token = str(payload.get("tracking_token", "")).strip()
    if not tracking_token or len(tracking_token) > 128:
        return JsonResponse({"error": "Kuzatuv kodi noto'g'ri."}, status=400)

    token_hash = hashlib.sha256(tracking_token.encode()).hexdigest()
    shipment = Shipment.objects.select_related("route", "departure_slot").filter(
        tracking_token_hash=token_hash,
    ).first()
    if shipment is None:
        return JsonResponse({"error": "Yuk topilmadi."}, status=404)
    return JsonResponse({"shipment": serialize_shipment(shipment)})