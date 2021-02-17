from django.shortcuts import render
from django.http import JsonResponse

from time import sleep
import datetime

<<<<<<< HEAD
#! importing all localfiles----------   -------------------------------------------------------
from . import connection, models
=======
#! importing all localfiles-----------------------------------------------------------------
from . import connection, models, sms, otp
>>>>>>> 1b7c725a7f173afe365edc6f3b8125dc3293ce4c
from . import interface


#! Global functions calls-------------------------------------------------------------------
connection.connect()
sms.connect()
interface.setup()


#! Create your views here.------------------------------------------------------------------
def display(req):
    return render(req, 'content.html')


def tempRead(req):
    print("------------[ajax connected]------------")
    temp = float(interface.action())

    # temp = "a"
    # while temp == "a":
    #     temp = int(input("Enter num : "))

    if temp and 32 < temp and temp < 35:
        interface.active_sani()
        return JsonResponse({"entryAllowed": True, "speechContent": "Please register your information."})
    else:
        return JsonResponse({"entryAllowed": False, "speechContent": "Your temperature has some variation, Please wait and try again or Visit a doctor."})


def register(req):
    data = req.POST
    resData={}
    otp_code = otp.gen_otp()

    modelData = models.Model(name=data['name'], phone=data['phone'], place=data['place'], otp=otp_code)
    try:
        res = connection.get().customers.insert_one(modelData.getModel())
    except:
         return JsonResponse({"status": False, "speechContent": "You are registration is failed, please try again !"})
    
    if res.inserted_id:
        resData = {
            "status": True,
            "id": str(res.inserted_id),
            "name": data['name'],
            "speechContent": "Your registration is successfull. Welcome " + data['name'] + " !"
        }
        msg = f"   \
            Your registration is successfull ':)'. {otp_code} is your OTP for Exit Machine.\
            \n If any problem contact + 918086894243 and provide the code below \
            \t{str(res.inserted_id)}"
        sms.sendSMS(modelData.getModel()["phone"], msg)
    else:
        resData = {
            "status": False,
            "speechContent": "You are registration is failed, please try again !"
        }
    return JsonResponse(resData)

