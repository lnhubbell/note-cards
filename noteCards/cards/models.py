from django.db import models
from datetime import datetime

# Create your models here.
class Card(models.Model):
    title = models.CharField(max_length=200, unique=True)
    pub_date = models.DateTimeField('date published', default=datetime.now)
    front_side = models.TextField()
    back_side = models.TextField()
    correct = models.IntegerField(default=0)
    incorrect = models.IntegerField(default=0)

    def __str__(self):
        return self.title