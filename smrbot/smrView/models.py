import datetime 
from bson.objectid import ObjectId

class Model():
    def __init__(self, userId, name, phone, place, otp):
        self.userId = ObjectId(userId)
        self.name = str(name)
        self.phone = "+91" + phone.strip()
        self.place = str(place)
        self.otp = otp

    def getModel(self):
        data = {
            'otp': self.otp,
            'userId': self.userId,
            'name': self.name,
            'phone': self.phone,
            'place': self.place,
            'entryTime': datetime.datetime.now()
        }
        return data