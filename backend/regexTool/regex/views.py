from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import JsonResponse

from django.shortcuts import render

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Regex
from .serializers import *
import re

class Data:
    def __init__(self, regex_array, num_of_groups):
        self.data = regex_array
        self.num_of_groups = num_of_groups

class RegexObj:
    def __init__(self, match, groups):
        self.match = match
        self.groups = groups
    
def home(request):
    return render(request, 'regexTool/index.html')

@api_view(['POST'])
def regex_handler(request):
    
    if request.method == 'POST':
        serializer = RegexSerializer(data=request.data)
        if serializer.is_valid():
            regex_area = serializer.data.get('regex_area')
            text_area = request.data.get('text_area')
            regex_obj_array = []
            num_of_groups = 0
            for match in re.finditer(r'(%s)' % regex_area, text_area, re.IGNORECASE | re.DOTALL):
                num_of_groups = len(match.groups()) -1
                groups = []
                if (len(match.groups()) > 1):
                    for i in range(2, len(match.groups()) + 1):
                        groups.append({'start': match.start(i), 'end': match.end(i)})
                regex_obj = RegexObj({'start': match.start(1), 'end': match.end(1)}, groups)
                regex_obj_array.append(regex_obj.__dict__)

            data = Data(regex_obj_array, num_of_groups)



            return JsonResponse(data.__dict__, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)