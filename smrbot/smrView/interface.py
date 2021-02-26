import RPi.GPIO as GPIO
from smbus2 import SMBus
from mlx90614 import MLX90614
from time import sleep

GPIO.setwarnings(False)
irIn_Pin = 11
sani_pin = 13
bus = SMBus(1)
tempSnsr = MLX90614(bus, address=0x5A)

# setup----------------------------
def setup():
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(irIn_Pin, GPIO.IN)
    GPIO.setup(sani_pin, GPIO.OUT)
    GPIO.output(sani_pin, GPIO.HIGH)


# local functions------------------
def get_tem_value():
    temp = []
    for i in range(10):
        temp.append(float(tempSnsr.get_object_1()))
    return temp

def get_avg(temp):
    total_temp = 0
    for t in temp:
        total_temp += float(t)
    avg_temp = total_temp / len(temp)
    return avg_temp

# action---------------------------
def action():
    temp = None
    while 1:
        if not GPIO.input(irIn_Pin):
            sleep(0.2)
            temp = get_tem_value()
            break
    if temp:
        return get_avg(temp)
    else:
        return False

# sanitizer on---------------------
def active_sani():
    GPIO.output(sani_pin, GPIO.LOW)

# sanitizer off--------------------
def deactive_sani():
    GPIO.output(sani_pin, GPIO.HIGH)

# cleaning gpio ports--------------
def clean():
    GPIO.cleanup()


# TODO: DEBUGGING----------------------------------------------
# def setup():
#     print("---------------[set up]---------------")

# def action():
#     temp = "a"
#     while temp == "a":
#         temp = int(input("Enter num : "))
#     return temp
    
# def active_sani():
#     print("---------------[active_sani]---------------")
    
# def deactive_sani():
#     print("---------------[deactive_sani]---------------")
