from django.shortcuts import render
from django.http import JsonResponse
from . import connection

connection.connect()

# Create your views here.
def display(req):
    return render(req, 'content.html')

def register(req):
    data = req.POST
    print(data)
    a = connection.get().customer.insert_one({'name': data['name'], 'phone': data['phone'], 'place': data['place']})
    print(a)
    tData = {
        "name": "pranav k v",
        "place": "puthur",
        "phone": 8086894243
    }
    return JsonResponse(tData)
        