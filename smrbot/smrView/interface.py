from smbus2 import SMBus
from mlx90614 import MLX90614
import RPi.GPIO as GPIO
from time import sleep

irIn_Pin = 11
bus = None
tempSnsr = {
    "sensor": None,
    "gndPin": 7
}

# setup----------------------------
def setup():
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(tempSnsr["gndPin"], GPIO.OUT)
    GPIO.setup(irIn_Pin, GPIO.IN)
    bus = SMBus(1)
    tempSnsr["sensor"] = MLX90614(bus, address=0x5A)
    GPIO.output(tempSnsr["gndPin"], GPIO.HIGH)



# local functions------------------
def get_tem_value():
    temp = []
    GPIO.output(tempSnsr["gndPin"], GPIO.LOW)
    for i in range(10):
        temp.append(tempSnsr["sensor"].get_object_1())
    GPIO.output(tempSnsr["gndPin"], GPIO.HIGH)
    return temp

def get_avg(temp):
    total_temp = 0
    for t in range(len(temp)):
        total_temp += t
    avg_temp = total_temp / len(temp)
    return avg_temp

# action---------------------------
def action():
    temp = None
    while 1:
        if not GPIO.input(irIn_Pin):
            temp = get_tem_value()
            break
    if temp:
        return get_avg(temp)
    else:
        return False

 
# cleaning gpio ports--------------
def clean():
    GPIO.cleanup()