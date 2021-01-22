
import sys
from email.message import EmailMessage
import smtplib

msg = EmailMessage()

"""setting require parameter"""
sender = 'naveenav0001@gmail.com'
reciever = 'pranavkv02@gmail.com'
msg["From"] = sender
msg["To"] = reciever

sub = "Testing cronJob On RaspberryPi"
msg["Subject"] = sub

body = f"""Hey there!\n\nThis main is came form raspberrypi after boot,\n
CRONjob is successful \n\nNew addr : {sys.argv[1]}"""
msg.set_content(body)

mail_pass = "wnmkaqfubuxsnsln"
server = smtplib.SMTP_SSL('smtp.gmail.com')
smtp_code_status = server.login(sender, mail_pass)

print(smtp_code_status)

server.send_message(msg)
server.quit()
