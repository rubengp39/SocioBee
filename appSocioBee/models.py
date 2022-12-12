from django.db import models
#from django.contrib.gis.geos import GEOSGeometry, LineString, Point
#TODO https://docs.djangoproject.com/en/4.1/ref/contrib/gis/geos/

class QueenBee(models.Model): # Maybe missing email.
    name = models.CharField(max_length=30)
    surname = models.CharField(max_length=30)
    age = models.IntegerField()
    city = models.CharField(max_length=30)
    gender = models.CharField(max_length=30)

class Campaign(models.Model):
    queenBee_id = models.ForeignKey(QueenBee, on_delete=models.CASCADE)
    city = models.CharField(max_length=30)
    start_timestamp = models.TimeField(auto_now_add=True)
    cell_edge = models.IntegerField()
    min_samples = models.IntegerField()
    sampling_period = models.IntegerField()
    planning_limit_time = models.IntegerField()
    campaign_duration = models.IntegerField() #TODO Rename to duration.

class Surface(models.Model):
    campaign_id = models.ForeignKey(Campaign, on_delete=models.CASCADE)

class Boundary(models.Model):
    surface_id = models.ForeignKey(Surface, on_delete=models.CASCADE)
    boundary = models.CharField(max_length=100) # LineString.

class Cell(models.Model):
    inferior_coord = models.CharField(max_length=100) # Point.
    superior_coord = models.CharField(max_length=100) # Point.
    center = models.CharField(max_length=100) # Point.
    cell_type = models.IntegerField() # Rename to type.

class Slot(models.Model):
    start = models.TimeField()
    end = models.TimeField()
    cell_id = models.ForeignKey(Cell, on_delete=models.CASCADE)

class CellPriority(models.Model):
    timestamp = models.TimeField(auto_now_add=True, primary_key=True)
    temporal_priority = models.FloatField()
    trend_priority = models.FloatField()
    slot_id = models.ForeignKey(Slot, on_delete=models.CASCADE)
    cellprioritycol = models.CharField(max_length=45)

class State(models.Model):
    created = models.SmallIntegerField() # TinyInt(1) maybe boolean?
    send = models.SmallIntegerField() # TinyInt(1) maybe boolean? Rename to sent.
    open = models.SmallIntegerField() # TinyInt(1) maybe boolean? Rename to opened.
    acepted = models.SmallIntegerField() # TinyInt(1) maybe boolean?
    planning = models.SmallIntegerField() # TinyInt(1) maybe boolean?
    realized = models.SmallIntegerField() # TinyInt(1) maybe boolean?
    timestamp_update = models.TimeField()

class Participant(models.Model): # Same as QueenBee?
    name = models.CharField(max_length=30)
    surname = models.CharField(max_length=30)
    age = models.IntegerField()
    city = models.CharField(max_length=30)
    gender = models.CharField(max_length=30)

class AirData(models.Model):
    no2 = models.FloatField()
    co2 = models.FloatField()

class CellMeasurement(models.Model):
    cell_id = models.ForeignKey(Cell, on_delete=models.CASCADE)
    participant_id = models.ForeignKey(Participant, on_delete=models.CASCADE)
    timestamp = models.TimeField()
    measurement_type = models.CharField(max_length=30)
    airdata_id = models.ForeignKey(AirData, on_delete=models.CASCADE)
    location = models.CharField(max_length=100) # Point. Maybe Region? Cell?

class MeasurementPromise(models.Model): #TODO Cell_id + participant_id composite primary key https://stackoverflow.com/questions/28712848/composite-primary-key-in-django
    cell_id = models.ForeignKey(Cell, on_delete=models.CASCADE)
    participant_id = models.ForeignKey(Participant, on_delete=models.CASCADE)
    cellMeasurement_id = models.ForeignKey(CellMeasurement, on_delete=models.CASCADE)
    state_id = models.ForeignKey(State, on_delete=models.CASCADE)
    timestamp_send = models.TimeField()
    promise_timestamp = models.TimeField()

class Recommendation(models.Model):
    cell_id = models.ForeignKey(Cell, on_delete=models.CASCADE)
    participant_id = models.ForeignKey(Participant, on_delete=models.CASCADE)
    recommendation_timestamp = models.TimeField() # Rename Timestamp.
    planning_timestamp = models.TimeField()
    cellMeasurement_id = models.ForeignKey(CellMeasurement, on_delete=models.CASCADE)
    state_id = models.ForeignKey(State, on_delete=models.CASCADE)