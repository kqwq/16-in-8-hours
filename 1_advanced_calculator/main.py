# tkinter
from tkinter import *
from math import *

# Make a window with a 5 x 5 grid of buttons
window = Tk()
window.title("Calculator")
window.geometry("500x500")

# Make a list of buttons
buttons = [
    ["sin", "cos", "tan", "(", ")"],
    ["log", "ln", "^", "sqrt", "!"],
    ["7", "8", "9", "+"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "*"],
    ["0", ".", "=", "/"],
    ["Clear", "Backspace"]
]



def btnCallBack(s):
  # Add text to textbox
  if (s == "="):
    # Evaluate the expression
    try:
      expression = e.get()
      expression.replace("^", "**")
      result = eval(expression)
      e.delete(0, END)
      e.insert(0, result)
    except:
      e.delete(0, END)
      e.insert(0, "Error")
    pass
  elif (s == "Clear"):
    e.delete(0, END)
  elif (s == "Backspace"):
    e.delete(len(e.get())-1, END)
  else:
    e.insert(END, s)
  

    

# Make a grid of buttons
for row in range(len(buttons)):
    for column in range(len(buttons[row])):
        # Make a button
        txt = buttons[row][column]
        print(txt)
        button = Button(window, text=buttons[row][column], command=lambda txt=txt: btnCallBack(txt))
        # Place the button
        button.grid(row=row, column=column, sticky=N+S+E+W)
        
# Display box
e = Entry(window, width=35, borderwidth=5)
e.grid(columnspan=5, row=7, column=0)

# Info
info = Label(window, text="Advanced Calculator written in 30 mins", font=("Arial", 8)).grid(columnspan=5, row=10, column=0)


# Show window
window.mainloop()
