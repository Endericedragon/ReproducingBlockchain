import csv
import matplotlib
import matplotlib. pyplot as plt
from matplotlib.pyplot import MultipleLocator
import numpy as np
import pandas as pd

#open the .csv file
inputFile=open("creditResultTest.csv")
# read
reader=csv.reader(inputFile)
#csv => list
data=list(reader)
#get the related info
row_len=len(data)
column_len=len(data[0])

x=list()
y=list()

for i in range(1,row_len):
    x.append(int(data[i][0]))
    y.append(int(data[i][1]))

x_major_locator=MultipleLocator(1000)
y_major_locator=MultipleLocator(10)
ax=plt.gca()
ax.xaxis.set_major_locator(x_major_locator)
ax.yaxis.set_major_locator(y_major_locator)
plt.xlim(0,20000)
plt.ylim(0,105)

plt.plot(x,y)
plt.xlabel("distance",fontsize=14)
plt.ylabel("credit",fontsize=14)

plt.show()
