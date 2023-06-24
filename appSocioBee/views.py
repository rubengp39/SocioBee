from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404, get_list_or_404, render, redirect
from .models import *
from django.views.decorators.csrf import csrf_exempt

from django.utils import translation
from django.utils.translation import gettext_lazy as _

import os
import json

def index(request):
    # user_language = 'es'
    # translation.activate(user_language)
    #if translation.LANGUAGE_SESSION_KEY in request.session:
    #    del request.session[translation.LANGUAGE_SESSION_KEY]
    return render(request, 'campaignCreation.html')

def index(request):
    if request.method == 'POST':
        language = request.POST.get('language')
        translation.activate(language)
        request.session[translation.LANGUAGE_SESSION_KEY] = language
        return redirect(request.POST.get('next', '/'))
    
    return render(request, 'index.html')

def login(request):
    return render(request, 'login.html')

def campaigns(request):
    return render(request, 'campaigns.html')


@csrf_exempt
def campaignCreation(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        square_data = data.get('squareData')
        if square_data:
            file_path = os.path.join('appSocioBee', 'static', 'js', 'geoData', 'savedSquare.js')

            with open(file_path, 'w') as f:
                f.write(f'export const squareCoordinates = {json.dumps(square_data)};')

    return render(request, 'campaignCreation.html')

def worker(request):
    return render(request, 'worker.html')