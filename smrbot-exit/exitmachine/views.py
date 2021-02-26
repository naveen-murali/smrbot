from django.shortcuts import render
from django.http import JsonResponse

from time import sleep
import datetime

#! importing all localfiles-----------------------------------------------------------------
from . import connection


#! Global functions calls-------------------------------------------------------------------
connection.connect()


#! Create your views here.------------------------------------------------------------------
def display(req):
    return render(req, 'content.html')

def register(req):
    data = req.POST
    resData={}
    val = str(req.POST['OTP'])
    res_find = connection.get().customers.find_one({'otp':val}) 
    idValue = res_find["_id"]
    nameValue = res_find["name"]
    
    if res_find:
        print("-------------we found out the data--------")
        update = { "$set": {'exitTime':datetime.datetime.now()} }
        res_update = connection.get().customers.update_one({'otp':val}, update)
        if res_update:
            resData = {
                "status": True,
                "id": str(idValue),
                "name": nameValue,
                "speechContent": "Your registration is successfull. Thank you " + nameValue + " !"
            }
        else:
            resData = {
                "status": False,
                "speechContent": "Incorrect otp, please check the otp ,and, try again !"
            }
    else:
        resData = {
                "status": False,
                "speechContent": "Incorrect otp, please check the otp ,and, try again !"
            }
    return JsonResponse(resData)        





