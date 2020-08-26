from rest_framework import serializers
from .models import Regex, Flags


class FlagsSerializer(serializers.ModelSerializer):
    i = serializers.BooleanField()
    s = serializers.BooleanField()
    l = serializers.BooleanField()
    x = serializers.BooleanField()
    u = serializers.BooleanField()
    m = serializers.BooleanField()


    class Meta:
        model = Flags
        fields = ('i', 'l', 'm', 's', 'u', 'x') 
        



class RegexSerializer(serializers.ModelSerializer):
    text_area = serializers.CharField(trim_whitespace=False)
    regex_area = serializers.CharField(trim_whitespace=False)
    flags = FlagsSerializer()
    class Meta:
        model = Regex
        fields = ('text_area', 'regex_area', 'flags') 
        

