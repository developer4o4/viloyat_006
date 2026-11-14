import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('routes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Shipment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(blank=True, max_length=24, unique=True)),
                ('sender_name', models.CharField(max_length=120)),
                ('cargo_description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('departure_slot', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='shipments', to='routes.departureslot')),
                ('route', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='shipments', to='routes.route')),
            ],
            options={
                'ordering': ('-created_at',),
            },
        ),
        migrations.RunSQL(
            "ALTER TABLE shipments_shipment DROP COLUMN IF EXISTS account_id",
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
