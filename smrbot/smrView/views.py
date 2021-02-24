from django.shortcuts import render
from django.http import JsonResponse
import json

#! importing all localfiles-----------------------------------------------------------------
from . import connection, models, interface, otp, sms

#! Global functions calls-------------------------------------------------------------------
connection.connect()
sms.connect()
interface.setup()

#! Create your views here.------------------------------------------------------------------
def display(req):
    interface.deactive_sani()
    return render(req, 'smrbot.html')


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


# def create_docu():
#     id = ""
#     with open("qr_data.json", "r+") as qr_data:
#         try:
#             data = json.loads(qr_data)
#             id = data['id']
#         except:
#             print("nothing")
#             json.dump({"id": "123456", "otp": "020200"}, qr_data)
def tempRead(req):
    # print("------------[ajax connected]------------")
    temp = float(interface.action())

    if temp and 32 < temp and temp < 35:
        interface.active_sani()
        # id = create_docu()
        resData = {
            "entryAllowed": True,
            "id": id,
            "speechContent": "Please register your information."
        }
    else:
        resData = {
            "entryAllowed": False,
            "speechContent": "Your temperature has some variation, Please wait and try again or Visit a doctor."
        }
    
    return JsonResponse(resData)