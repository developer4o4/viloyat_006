import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Route',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('origin', models.CharField(max_length=100)),
                ('destination', models.CharField(max_length=100)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'ordering': ('origin', 'destination'),
                'unique_together': {('origin', 'destination')},
            },
        ),
        migrations.CreateModel(
            name='DepartureSlot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('departure_at', models.DateTimeField()),
                ('capacity', models.PositiveIntegerField(default=10)),
                ('is_active', models.BooleanField(default=True)),
                ('route', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='slots', to='routes.route')),
            ],
            options={
                'ordering': ('departure_at',),
            },
        ),
    ]
