from django.db import models

class Regex(models.Model):
    text_area = models.TextField(blank=True, null=True)
    regex_area = models.TextField(blank=True, null=True)