from tkinter import *
from tkinter.filedialog import askopenfile 
import subprocess

soundsDir = r'C:\\Users\\Student\\Code\Learning\\16-in-8-hours\\3_audio_video_converter\\sounds\\'
lameDir = r'C:\\Users\\Student\\Documents\\Lame'

def convertAudio(fileName):
  last = fileName.split('/')[-1].split('.')
  namePart = last[0]
  extensionPart = last[1]
  convertToExtension = 'mp3' if extensionPart == 'wav' else 'wav'
  newFileName = namePart + '.' + convertToExtension
  cmd = 'lame --decode {} {}'.format(fileName, soundsDir+newFileName)
  subprocess.call(cmd, shell=True, cwd=lameDir)
  return newFileName

window = Tk()
window.title("mp3 to wav converter")
window.geometry("300x150")

def openFile():
    global file
    file = askopenfile(mode='rb')
    if file.name.endswith('.mp3') or file.name.endswith('.wav'):
        newFileName = convertAudio(file.name)
        Label(window, text="Converted to {}".format(newFileName)).pack()
    else:
        Label(window, text="Please select a .mp3 or .wav file").pack()

Label(window, text="Convert between .mp3 and .wav files.").pack()
Label(window, text="Sound.mp3 -> Sound.wav").pack()
Label(window, text="Sound.wav -> Sound.mp3").pack()
Label(window, text="").pack()
Button(window, text="Browse", command=openFile).pack()


window.mainloop()

