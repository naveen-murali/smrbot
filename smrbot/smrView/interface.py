import RPi.GPIO as GPIO

inPin = 3

# setup----------------------------
def setup():
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(inPin, GPIO.IN)

# action---------------------------
def action():
    while 1:
        if not GPIO.input(inPin):
            break
    return True
    
# cleaning gpio ports--------------
def clean():
    GPIO.cleanup()