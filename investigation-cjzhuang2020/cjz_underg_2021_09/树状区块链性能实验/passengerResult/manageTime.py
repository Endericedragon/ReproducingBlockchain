# coding:utf-8 
import json
import codecs
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
import numpy as np
import sys
defaultencoding = 'utf-8'
if sys.getdefaultencoding() != defaultencoding:
    reload(sys)
    sys.setdefaultencoding(defaultencoding)

font = FontProperties(fname='/etc/fonts/ttf/SimHei.ttf', size=15)

jsonFile6 = "./2h/2h1200P6.json"
# jsonFilen = "./system/30minPn.json"
jsonOpen6 = open(jsonFile6).read()
# jsonOpenn = open(jsonFilen).read()

jsonData6 = json.loads(jsonOpen6)
# jsonDatan = json.loads(jsonOpenn)
# print(jsonData[:2])

xCount = 0

doubleRecord = []

x_axis_data = [] #x
y_axis_data6 = [] #y
y_axis_datan = []

counter = 0

for oneData6 in jsonData6:
    if oneData6['getVehicleTime'] != 0:
        manageTime6 = oneData6['getVehicleTime']
        # manageTimen = oneDatan['getVehicleTime']
        y_axis_data6.append(manageTime6)
        # y_axis_datan.append(manageTimen)
        # doubleRecord.append([manageTime6, manageTimen])
        xCount = xCount+1
        x_axis_data.append(xCount)

y_axis_data6.sort()
# y_axis_datan.sort()

# doubleRecord = np.array(doubleRecord)
# doubleRecord = doubleRecord[np.lexsort(doubleRecord[:,::-1].T)]

plt.bar(x_axis_data, y_axis_data6,width=1,align='center')#'bo-'表示蓝色实线，数据点实心原点标注

# matplotlib.pyplot.bar(x, height, width=0.8, bottom=None, *, align='center', data=None, **kwargs)

# plt.plot(x_axis_data, y_axis_data6, 'b-', alpha=0.5, linewidth=1)#'bo-'表示蓝色实线，数据点实心原点标注

## plot中参数的含义分别是横轴值，纵轴值，线的形状（'s'方块,'o'实心圆点，'*'五角星   ...，颜色，透明度,线的宽度和标签 ，

plt.legend()  #显示上面的label
plt.xlabel('每个乘客的订单', fontproperties=font) #x_label
plt.ylabel('调度车辆的时间(ms)', fontproperties=font)#y_label
 
#plt.ylim(-1,1)#仅设置y轴坐标范围
plt.show()