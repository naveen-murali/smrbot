import datetime 

class Model():
    def __init__(self, name, phone, place, otp):
        self.name = str(name)
        self.phone = "+91" + phone.strip()
        self.place = str(place)
        self.otp = otp

    def getModel(self):
        data = {
            'otp': self.otp,
            'name': self.name,
            'phone': self.phone,
            'place': self.place,
            'entryTime': datetime.datetime.now()
        }
        return data