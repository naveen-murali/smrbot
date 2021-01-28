from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
def display(req):
    return render(req, 'content.html')

def register(req):
    return HttpResponse("<h2>"+ req.POST["name"] +"</h2><h2>"+ req.POST["phone"] +"</h2><h2>"+ req.POST["place"] +"</h2>")
        