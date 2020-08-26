from django.db import models

class Flags(models.Model):
    i = models.BooleanField(default=True)
    l = models.BooleanField(default=True)
    m = models.BooleanField(default=False)
    s = models.BooleanField(default=False)
    u = models.BooleanField(default=False)
    x = models.BooleanField(default=False)


class Regex(models.Model):
    text_area = models.TextField(blank=True, null=True)
    regex_area = models.TextField(blank=True, null=True)
    flags = models.ForeignKey(Flags, on_delete=models.CASCADE, null=True)

