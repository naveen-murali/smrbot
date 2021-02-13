from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from . import connection 

# Create your views here.
def home(request):
    # return HttpResponse("haaaai")
    return render(request, 'content.html')

def register(request):
    otp = request.POST["OTP"]
    print(otp)
    if connection.connect(otp):
        return HttpResponse("thanks")

    else:
        return HttpResponse("pls check your otp")
