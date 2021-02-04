from django.shortcuts import render
from django.http import JsonResponse

# database--------------------------
from . import connection
from . import models

# GPIO------------------------------
from . import interface

# Global functions------------------ 
connection.connect()
interface.setup()

# Create your views here.
def display(req):
    interface.action()
    return render(req, 'content.html')

def register(req):
    interface.clean()
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
        