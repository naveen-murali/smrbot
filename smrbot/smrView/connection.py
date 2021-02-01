import pymongo

state = {
    "db": None
}

url = 'mongodb+srv://test:12345@mydb.eifdj.mongodb.net/smrbot?retryWrites=true&w=majority'
client = pymongo.MongoClient(url)

def connect():
    try:
        state['db'] = client.smrbot
        print("-----------------[Connected]-----------------")
        # a = state['db'].smrbot.insert_one({"name": "naveen"})
        # a.inserted_id
    except:
        print("-----------------[connection failed]-----------------")

def get():
    return state['db']