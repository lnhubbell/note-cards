from django.shortcuts import render
from django.core.context_processors import csrf

# Create your views here.
def home(request):
    c = {}
    c.update(csrf(request))
    template_name = 'cards/base.html'
    return render(request, template_name, c)