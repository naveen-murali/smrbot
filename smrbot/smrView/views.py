from django.shortcuts import render
from django.http import JsonResponse
from . import connection
from . import models

connection.connect()

# Create your views here.
def display(req):
    return render(req, 'content.html')

def register(req):
    data = req.POST
    resData={}

    modelData = models.Model(name=data['name'], phone=data['phone'], place=data['place'])
    try:
        res = connection.get().testC.insert_one(modelData.getModel())
    except:
         return JsonResponse({"status": False})
         
    if res.inserted_id:
        resData = {
            "status": True,
            "id": str(res.inserted_id),
            "name": data['name']
        }
    else:
        resData = {
            "status": False
        }
    
    return JsonResponse(resData)
        