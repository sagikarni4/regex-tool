from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import JsonResponse

from django.shortcuts import render
import time
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Regex
from .serializers import *
import re


class Data:
    def __init__(self, newContent, regex_array, num_of_groups, duration):
        self.newContent = newContent
        self.data = regex_array
        self.num_of_groups = num_of_groups
        self.duration = duration

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
            text_area = serializer.data.get('text_area')
            flagsObj = serializer.data.get('flags')
            flags = 0
            if flagsObj.get('s'):
                flags = flags | re.DOTALL
            if flagsObj.get('i'):
                flags = flags | re.IGNORECASE
            if flagsObj.get('m'):
                flags = flags | re.MULTILINE
            if flagsObj.get('l'):
                flags = flags | re.LOCALE
            if flagsObj.get('x'):
                flags = flags | re.VERBOSE
            if flagsObj.get('u'):
                flags = flags | re.UNICODE

            regex_area = re.sub(ur'\\u(\w\w\w\w)',lambda m: unichr(int(m.group(1), 16)),regex_area)

            regex_obj_array = []
            num_of_groups = 0
            match_me = {}
            newContent = ""
            string_list = list(text_area)
            now = int(time.time()*1000)
            for match in re.finditer(r'(%s)' % regex_area, text_area, flags):
                num_of_groups = len(match.groups()) -1
                groups = []
                for i in range(1, len(match.groups()) + 1):
                    if i==1:
                        string_list[match.start(i)] = "-+-+match" + string_list[match.start(i)] 
                        string_list[match.end(i)-1] += '+-+-' 
                        match_me ={'start': match.start(i), 'end': match.end(i)}
                    else:
                        if '-+-+match' in string_list[match.start(i)]:
                            string_list[match.start(i)] = "-+-+match-+-+%s" % (i-1) + text_area[match_me.get('start')]
                            string_list[match.end(i) - 1] += '+-+-'
                        else:
                             string_list[match.start(i)] = "-+-+%s" % (i-1) + string_list[match.start(i)]
                        string_list[match.end(i)-1] += '+-+-' 
                        groups.append({'start': match.start(i), 'end': match.end(i)})
                
                regex_obj = RegexObj(match_me, groups)
                regex_obj_array.append(regex_obj.__dict__)

            newContent = ''.join(string_list)
            newContent = newContent.replace(">","&gt;")
            newContent = newContent.replace("<","&lt;")
            for i in range(1, num_of_groups + 1):
                newContent = newContent.replace("-+-+%d" %i ,"<span class='group%d'>" % i )
            newContent = newContent.replace("-+-+match","<span class='match'>" )
            newContent = newContent.replace("+-+-","</span>" )
           
            duration = int(time.time()*1000) - now
            if duration>1000:
                duration = str(duration/1000) + ' s'
            else:
                duration = str(duration) + ' ms'
            data = Data(newContent, regex_obj_array, num_of_groups, duration)



            return JsonResponse(data.__dict__, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)