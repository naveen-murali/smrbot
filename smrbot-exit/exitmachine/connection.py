import pymongo
state = {
    "db": None
}

url = 'mongodb+srv://smrbot:smrbot007@smrbot.qgasa.mongodb.net/testC?retryWrites=true&w=majority'

def connect():
    dbStatus = False
    while not dbStatus:
        client = None
        try:
            client = pymongo.MongoClient(url)
            state['db'] = client.test
            dbStatus = True
            print("-----------------[Connected]-----------------")
        except:
            print("-----------------[connection failed]-----------------")

def get():
    return state['db']
