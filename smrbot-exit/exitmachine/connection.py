import pymongo
from pymongo import MongoClient

cluster = MongoClient("mongodb+srv://smrbot:smrbot007@smrbot.qgasa.mongodb.net/testC?retryWrites=true&w=majority")
db = cluster["test"]
collection = db["test"]
collection.insert_one({"OTP":"1234"})
def connect(OTP):
    # this.OTP = OTP
    print(collection.find({"OTP" : OTP}))
    # return collection.find({"OTP" : OTP})
    