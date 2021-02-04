import RPi.GPIO as GPIO
from time import sleep

pin = 3
inPin = 5

# setup----------------------------
def setup():
    # GPIO.setmode(GPIO.BCM)
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(pin, GPIO.OUT)
    GPIO.setup(inPin, GPIO.IN)


# action---------------------------
def action():
    while 1:
        GPIO.output(pin, GPIO.input(inPin))
    
# cleaning gpio ports--------------
def clean():
    GPIO.cleanup()