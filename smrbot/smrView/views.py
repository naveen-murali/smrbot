from os import error
from bson.objectid import ObjectId
from django.shortcuts import render, redirect
from django.http import JsonResponse
import re
# import json

#! importing all localfiles-----------------------------------------------------------------
from . import connection, models, otp, sms, flash, interface

user = { "id": None }
with open("./smrView/userId.txt", "r") as file:
    user['id'] = file.read()
    
#! Global functions calls-------------------------------------------------------------------
connection.connect()
sms.connect()
interface.setup()

#! Create your views here.----------------------------------------------------------------------------------------------------------------
# @rout     GET /tempRead/
# @desc     To varify the temparature and allow the access.
def display(req):
    if not user['id']:
        errors = flash.flash("error")
        return render(req, 'getUserId.html', { "errors": errors })
    interface.deactive_sani()
    return render(req, 'smrbot.html')


# @rout     POST /confirmAcc/
# @desc     Confirming the account.
def confirmAcc(req):
    id = req.POST['userId']

    if not (len(id) == 24 and re.search('[\d\w]{24}', id).group() == id):
        flash.flash("error", "User Id dose not match.")
        return redirect("/")
    
    try:
        res = connection.get().users.find_one({ '_id': ObjectId(id) }, { "_id": 1, "email": 1, "googleImg": 1 })
        return render(req, 'userConfirm.html', { "email": res["email"], "img": res["googleImg"], "id": id })
    except:
        flash.flash("error", "Can not find the user. Please try again.")
        return redirect("/")


# @rout     POST /registerUserId/
# @desc     Get the user id form the user to save it on the userId.txt file.
def registerUserId(req):
    id = req.GET['userId']
    try:
        with open("./smrView/userId.txt", "w") as file:
            file.write(id)
            user['id'] = id
        return redirect("/")
    except:
        flash.flash("error", "Could not complete the proccess.")
        return redirect("/")


# @rout     POST /register/
# @desc     Registering the customers and sending the otp.
def register(req):
    data = req.POST
    resData = {}
    otp_code = otp.gen_otp()

    modelData = models.Model(userId=user['id'], name=data['name'], phone=data['phone'], place=data['place'], otp=otp_code)
    
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
        msg = f"Your registration is successfull ':)'. {otp_code} is your OTP for Exit Machine.\n\
            If any problem contact +918086894243 and provide the code below \n\
            {str(res.inserted_id)} to visit the this website\n\
            http://localhost:3000/customersWarning/{str(user['id'])}{str(res.inserted_id)}"

        sms.sendSMS(modelData.getModel()["phone"], msg)
    else:
        resData = {
            "status": False,
            "speechContent": "You are registration is failed, please try again !"
        }
    return JsonResponse(resData)


# @rout     GET /tempRead/
# @desc     To varify the temparature and allow the access.
def tempRead(req):
    print("------------[ajax connected]------------")
    temp = float(interface.action())
    # temp = 33

    if temp and 32 < temp and temp < 35:
        interface.active_sani()
        resData = {
            "entryAllowed": True,
            "speechContent": "Please register your information."
        }
    else:
        resData = {
            "entryAllowed": False,
            "speechContent": "Your temperature has some variation, Please wait and try again or Visit a doctor."
        }
    
    return JsonResponse(resData)
#! ---------------------------------------------------------------------------------------------------------------------------------------