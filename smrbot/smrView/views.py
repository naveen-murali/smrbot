from django.shortcuts import render
from django.http import JsonResponse

from time import sleep
import datetime

#! importing all localfiles--------------------------
from . import connection, models, interface


#! Global functions calls------------ 
connection.connect()
interface.clean()
interface.setup()


#! Create your views here.------------------------------------------------------------------
def display(req):
    return render(req, 'content.html')


def tempRead(req):
    print("------------[ajax connected]------------")
    if interface.action():
        return JsonResponse({"entryAllowed": True, "speechContent": "Please register your information."})
    return JsonResponse({"data": "name"})


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
            "name": data['name'],
            "speechContent": "Your registration is successfull. Welcome " + data['name'] + " !"
        }
    else:
        resData = {
            "status": False,
            "speechContent": "You are registration is failed, please try again !"
        }
    return JsonResponse(resData)



