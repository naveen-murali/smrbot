import pymongo

state = {
    "db": None
}

url = 'mongodb+srv://smrbot:smrbot007@smrbot.qgasa.mongodb.net/testC?retryWrites=true&w=majority'
client = pymongo.MongoClient(url)

def connect():
    dbStatus = False
    while not dbStatus:
        try:
            state['db'] = client.test
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