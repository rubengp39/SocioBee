from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404, get_list_or_404, render
from .models import *
from django.views.decorators.csrf import csrf_exempt

import os
import json

def index(request):
    queenBees = get_list_or_404(QueenBee.objects.order_by('name'))
    context = {'lista_QueenBees': queenBees }
    return render(request, 'campaignCreation.html', context)

def index(request):
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