from twilio.rest import Client

account_sid = "AC54a6f0137ad395348284281c825268f8"
auth_token = "89ecf74e03a45be98b01a01318a3165d"

state = {
    "sms": None
}

def connect():
    state['sms'] = Client(account_sid, auth_token)

def sendSMS(phoneNum, msg):
    state['sms'].messages.create(from_="+12058810586", body=msg, to=phoneNum)

if __name__ == "__main__":
    connect()
    sendSMS("+918086894243", "hi")