# tkinter
from tkinter import *
from math import *

# Make a window with a 5 x 5 grid of buttons
window = Tk()
window.title("Unit Converter 340x150")
window.geometry("340x150")

# Make a list of units
units = ["m", "cm", "mm", "km", "mi", "yd", "ft", "in"]
factors = [1, 100, 1000, 0.001, 0.000621371, 1.09361, 3.28084, 39.3701]
window.grid_columnconfigure(4, minsize=100)

addedStart = False
startUnit = ""
endUnit = ""
def addUnit(unit):
  global addedStart, startUnit, endUnit
  if (addedStart):
    # Add text to label
    end.config(text = end.cget("text").split(" ")[0] + " " + unit)
    endUnit = unit
  else:
    start.config(text = start.cget("text").split(" ")[0] + " " + unit)
    startUnit = unit
  addedStart = not addedStart

def convert():
  # Get the start and end values
  if not startUnit or not endUnit:
    # Error message
    error = Label(window, text = "Please select a start and end unit")
    return
  factorStart = factors[units.index(startUnit)]
  factorEnd = factors[units.index(endUnit)]
  conversion = float(value.get()) * (factorEnd / factorStart)
  # Add text to label
  Label(window, text = str(conversion) + " " + endUnit + " are in " + value.get() + " " + startUnit).grid(row = 5, column = 0, columnspan = 8)
  


# Make a list of buttons
buttons = []
for (unit, factor) in zip(units, factors):
    b = Button(window, text=unit, command=lambda unit=unit: addUnit(unit))
    b.grid(row=1, column=len(buttons))
    buttons.append(b)

# Labels
Label(window, text="Value").grid(row=2, column=0, columnspan=2, sticky=W+E)
value = Entry(window, width=10, justify=CENTER, borderwidth=5)
value.grid(row=2, column=2, columnspan=6, sticky=W+E)

# From units
start = Label(window, text="Converting ")
start.grid(row=4, column=0, columnspan=2, sticky=W+E)

# To units
end = Label(window, text="to ")
end.grid(row=4, column=2, columnspan=4, sticky=W+E)

# Submit
Button(window, text="Convert", command=convert).grid(row=4, column=6, columnspan=2, sticky=W+E)

Label(window, text="World's Most Messy Unit Converter").grid(row=0, column=0, columnspan=8, sticky=W+E)
Label(window, text="Choose a starting and ending unit").grid(row=6, column=0, columnspan=8, sticky=W+E)

window.mainloop()