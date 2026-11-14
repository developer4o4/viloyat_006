from django.db import models


class Route(models.Model):
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("origin", "destination")
        unique_together = (("origin", "destination"),)

    def __str__(self):
        return f"{self.origin} → {self.destination}"


class DepartureSlot(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="slots")
    departure_at = models.DateTimeField()
    capacity = models.PositiveIntegerField(default=10)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("departure_at",)

    def __str__(self):
        return f"{self.route} · {self.departure_at:%d.%m.%Y %H:%M}"