# coding:utf-8 
import json
import codecs
import matplotlib.pyplot as plt
import numpy as np

jsonFile6 = "./region6_passenger.json"
jsonFile5 = "./region5_passenger.json"
jsonOpen6 = open(jsonFile6).read()
jsonOpen5 = open(jsonFile5).read()

jsonData6 = json.loads(jsonOpen6)
jsonData5 = json.loads(jsonOpen5)
# print(jsonData[:2])

xCount = 0

doubleRecord = []

x_axis_data = [] #x
y_axis_data6 = [] #y
y_axis_data5 = []

counter = 0

for oneData6 in jsonData6:
        for oneData5 in jsonData5:
            if oneData5['passenger'] == oneData6['passenger']:

                manageTime6 = oneData6['getVehicleTime']
                manageTime5 = oneData5['getVehicleTime']
                y_axis_data6.append(manageTime6)
                y_axis_data5.append(manageTime5)
                doubleRecord.append([manageTime6, manageTime5])
                xCount = xCount+1
                x_axis_data.append(xCount)

doubleRecord = np.array(doubleRecord)
doubleRecord = doubleRecord[np.lexsort(doubleRecord[:,::-1].T)]

plt.plot(x_axis_data, doubleRecord[:, 0], 'b*-', alpha=0.5, linewidth=1, label='region6')#'bo-'表示蓝色实线，数据点实心原点标注
plt.plot(x_axis_data, doubleRecord[:, 1], 'rs-', alpha=0.5, linewidth=1, label='region5')#'bo-'表示蓝色实线，数据点实心原点标注
## plot中参数的含义分别是横轴值，纵轴值，线的形状（'s'方块,'o'实心圆点，'*'五角星   ...，颜色，透明度,线的宽度和标签 ，

plt.legend()  #显示上面的label
plt.xlabel('number') #x_label
plt.ylabel('time')#y_label
 
#plt.ylim(-1,1)#仅设置y轴坐标范围
plt.show()