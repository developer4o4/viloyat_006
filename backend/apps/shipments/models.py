from django.db import models


class Shipment(models.Model):
    code = models.CharField(max_length=24, unique=True, blank=True)
    route = models.ForeignKey("routes.Route", on_delete=models.PROTECT, related_name="shipments")
    departure_slot = models.ForeignKey("routes.DepartureSlot", on_delete=models.PROTECT, related_name="shipments")
    sender_name = models.CharField(max_length=120)
    cargo_description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def save(self, *args, **kwargs):
        creating = self.pk is None
        super().save(*args, **kwargs)
        if creating and not self.code:
            self.code = f"Y{self.pk:02d}"
            super().save(update_fields=("code",))

    def __str__(self):
        return self.code or f"Y{self.pk:02d}"