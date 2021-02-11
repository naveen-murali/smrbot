import subprocess
import RPi.GPIO as GPIO
from time import sleep

pwrBtn_Pin = 12

GPIO.setmode(GPIO.BOARD)
GPIO.setup(pwrBtn_Pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)


while 1:
    if GPIO.input(pwrBtn_Pin):
        sleep(2)
        if GPIO.input(pwrBtn_Pin):
            break
GPIO.cleanup()
subprocess.run(["shutdown", "now"])