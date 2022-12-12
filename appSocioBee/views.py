from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404, get_list_or_404, render
from .models import *


def index(request):
    queenBees = get_list_or_404(QueenBee.objects.order_by('name'))
    context = {'lista_QueenBees': queenBees }
    return render(request, 'campaignCreation.html', context)

def worker(request):
    return render(request, 'worker.html')