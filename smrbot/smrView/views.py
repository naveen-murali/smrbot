from django.shortcuts import render
from django.http import JsonResponse

from time import sleep
import datetime

#! database--------------------------
from . import connection, models, talk


#! GPIO------------------------------
from . import interface

#! Global functions calls------------ 
connection.connect()
talk.removeVoice_All()
interface.clean()
interface.setup()


#! Create your views here.------------------------------------------------------------------
def display(req):
    return render(req, 'content.html')


def tempRead(req):
    print("------------[ajax connected]------------")
    if interface.action():
        speechContent = "Please register your information."
        talk.speech(speechContent, "voiceRegInfo.mp3")
        return JsonResponse({"entryAllowed": True})
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
            "name": data['name']
        }
        speechContent = "You are registration is successfull. Welcome " + data['name'] + " !"
        talk.speech(speechContent, "voiceSuccess.mp3")
        talk.removeVoice_All()
    else:
        resData = {
            "status": False
        }
        speechContent = "You are registration is failed, please try again !"
        talk.speech(speechContent, "voiceFail.mp3")
        talk.removeVoice_One("voiceFail.mp3")
    return JsonResponse(resData)



