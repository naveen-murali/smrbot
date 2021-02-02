import datetime
import math, random   

class Model():
    def __init__(self, name, phone, place):
        self.name = str(name)
        self.phone = int(phone)
        self.place = str(place)

    def generateOTP(self): 
        digits = "0123456789"
        OTP = ""
        for i in range(5) : 
            OTP += digits[math.floor(random.random() * 10)] 
        return OTP 

    def getModel(self):
        data = {
            'otp': self.generateOTP(),
            'name': self.name,
            'phone': self.phone,
            'place': self.place,
            'entryTime': datetime.datetime.now()
        }
        return data