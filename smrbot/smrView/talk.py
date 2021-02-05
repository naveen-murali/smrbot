from gtts import gTTS
from playsound import playsound
import pathlib
import os

print(pathlib.Path(__file__).parent.absolute())

voicePath = str(pathlib.Path(__file__).parent.absolute()) + "/voice/"

def speech(content, fileName):
    fullPath = voicePath + fileName
    talk = gTTS(text=content)
    talk.save(fullPath)
    playsound(fullPath)


def removeVoice_All():
    files = os.listdir(voicePath)
    if files:
        for file in files:
            if os.path.isfile(voicePath + file):
                os.remove(voicePath + file)


def removeVoice_One(voiceName):
    files = os.listdir(voicePath)
    if files and voiceName in files:
        os.remove(voicePath + voiceName)
