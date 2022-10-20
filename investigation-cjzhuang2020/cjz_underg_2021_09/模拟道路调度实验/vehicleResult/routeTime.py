# coding:utf-8 
import json
import codecs
import matplotlib.pyplot as plt
import numpy as np

jsonFile6 = "./4region6_vehicle.json"
jsonFile5 = "./4region5_vehicle.json"
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
    oneData6.setdefault('emptyRouteTime', 0)
    oneData6.setdefault('loadRouteTime', 0)
    if oneData6['emptyRouteTime'] != 0 and oneData6['loadRouteTime'] != 0:
        for oneData5 in jsonData5:
            oneData5.setdefault('emptyRouteTime', 0)
            oneData5.setdefault('loadRouteTime', 0)
            if oneData5['emptyRouteTime'] != 0 and oneData5['loadRouteTime'] != 0 and oneData5['vehicleId'] == oneData6['vehicleId']:

                prop6 = float(oneData6['loadRouteTime']) / (oneData6['loadRouteTime'] + oneData6['emptyRouteTime'])
                prop5 = float(oneData5['loadRouteTime']) / (oneData5['loadRouteTime'] + oneData5['emptyRouteTime'])

                y_axis_data6.append(prop6)
                y_axis_data5.append(prop5)
                doubleRecord.append([prop6, prop5])
                xCount = xCount+1
                x_axis_data.append(xCount)

doubleRecord = np.array(doubleRecord)
doubleRecord = doubleRecord[np.lexsort(doubleRecord[:,::-1].T)]

y_axis_data6.sort()
y_axis_data5.sort()

# plt.plot(x_axis_data, doubleRecord[:, 0], 'b*-', alpha=0.5, linewidth=1, label='region6')#'bo-'表示蓝色实线，数据点实心原点标注
# plt.plot(x_axis_data, doubleRecord[:, 1], 'rs-', alpha=0.5, linewidth=1, label='region5')#'bo-'表示蓝色实线，数据点实心原点标注

plt.plot(x_axis_data, y_axis_data6, 'b-', alpha=0.5, linewidth=1, label='region6')#'bo-'表示蓝色实线，数据点实心原点标注
plt.plot(x_axis_data, y_axis_data5, 'r-', alpha=0.5, linewidth=1, label='region5')#'bo-'表示蓝色实线，数据点实心原点标注


## plot中参数的含义分别是横轴值，纵轴值，线的形状（'s'方块,'o'实心圆点，'*'五角星   ...，颜色，透明度,线的宽度和标签 ，

plt.legend()  #显示上面的label
plt.xlabel('number') #x_label
plt.ylabel('time')#y_label
 
#plt.ylim(-1,1)#仅设置y轴坐标范围
plt.show()