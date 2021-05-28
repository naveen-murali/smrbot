import pymongo
state = {
    "db": None
}

url = 'mongodb+srv://smrbot:LGLhretcAyqjF3P8@smrbot.qgasa.mongodb.net/smrbot?retryWrites=true&w=majority'

def connect():
    dbStatus = False
    while not dbStatus:
        client = None
        try:
            client = pymongo.MongoClient(url)
            state['db'] = client.smrbot
            dbStatus = True
            print("-----------------[Connected]-----------------")
        except:
            print("-----------------[connection failed]-----------------")

def get():
    return state['db']

# ------------------------------------------------------------
# https://docs.mongodb.com/manual/core/index-ttl/
# a = state['db'].smrbot.create_index(<indexes>)
# a = state['db'].smrbot.insert_one({"name": "naveen"})
# a.inserted_id
# ------------------------------------------------------------