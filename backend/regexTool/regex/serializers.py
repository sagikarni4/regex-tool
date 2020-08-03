from rest_framework import serializers
from .models import Regex

class RegexSerializer(serializers.ModelSerializer):
    text_area = serializers.CharField(trim_whitespace=False)
    regex_area = serializers.CharField(trim_whitespace=False)
    class Meta:
        model = Regex
        fields = ('text_area', 'regex_area') 
        