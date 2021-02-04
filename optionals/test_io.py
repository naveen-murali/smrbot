import RPi.GPIO as GPIO
from time import sleep

pin = 3

# setup----------------------------
GPIO.setmode(GPIO.BCM)
# GPIO.setmode(GPIO.BOARD)
GPIO.setup(pin, GPIO.OUT)


# action---------------------------
try:
    while 1:
        GPIO.output(pin, GPIO.HIGH)
        sleep(5)
        GPIO.output(pin, GPIO.LOW)
        sleep(5)
except KeyboardInterrupt:
    GPIO.cleanup()