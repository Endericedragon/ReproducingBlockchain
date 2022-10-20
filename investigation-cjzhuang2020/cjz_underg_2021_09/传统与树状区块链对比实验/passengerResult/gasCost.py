# coding:utf-8 
import json
import codecs
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

jsonFile6 = "./system/30minP6.json"
jsonFilen = "./system/30minPn.json"
jsonOpen6 = open(jsonFile6).read()
jsonOpenn = open(jsonFilen).read()

jsonData6 = json.loads(jsonOpen6)
jsonDatan = json.loads(jsonOpenn)
# print(jsonData[:2])

xCount = 0

doubleRecord = []

x_axis_data = [] #x
y_axis_data6 = [] #y
y_axis_datan = []

counter = 0

for oneData6 in jsonData6:
    for oneDatan in jsonDatan:
        if oneDatan['passengerId'] == oneData6['passengerId'] and oneDatan['getVehicleTime'] != 0 and oneData6['getVehicleTime'] != 0:
            distance6 = oneData6['gasCost']
            distancen = oneDatan['gasCost']
            y_axis_data6.append(distance6)
            y_axis_datan.append(distancen)
            xCount = xCount+1
            x_axis_data.append(xCount)
        

y_axis_data6.sort()
y_axis_datan.sort()

s6 = 0
for x in y_axis_data6:
        s6 += float(x)  # s为输入数字的总和
avg6 = s6/len(y_axis_data6)
print('avg6 = ',avg6)

sn = 0
for x in y_axis_datan:
        sn += float(x)  # s为输入数字的总和
avgn = sn/len(y_axis_datan)
print('avgn = ',avgn)

print('diff = ', (y_axis_data6[len(y_axis_data6) / 2] - y_axis_datan[len(y_axis_datan) / 2])/float(y_axis_data6[len(y_axis_data6) / 2]))

# doubleRecord = np.array(doubleRecord)
# doubleRecord = doubleRecord[np.lexsort(doubleRecord[:,::-1].T)]

# plt.plot(x_axis_data, y_axis_data6, 'b*-', alpha=0.5, linewidth=1, label='region6')#'bo-'表示蓝色实线，数据点实心原点标注
# plt.plot(x_axis_data, y_axis_datan, 'rs-', alpha=0.5, linewidth=1, label='noregion')#'bo-'表示蓝色实线，数据点实心原点标注
## plot中参数的含义分别是横轴值，纵轴值，线的形状（'s'方块,'o'实心圆点，'*'五角星   ...，颜色，透明度,线的宽度和标签 ，

label = 'noRegion', 'region'
plt.boxplot([y_axis_datan, y_axis_data6], labels=label,patch_artist=True, boxprops={'color': 'lightblue'},sym='r.')
plt.grid(linestyle = "--", alpha = 0.3)
plt.ticklabel_format(axis="y", style='plain')

plt.ylabel('gasCost')
plt.show()