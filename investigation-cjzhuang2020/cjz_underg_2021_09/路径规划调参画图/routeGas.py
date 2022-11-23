# coding:utf-8 
from cProfile import label
import json
import codecs
from turtle import color
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
import numpy as np
from pylab import *
import sys
defaultencoding = 'utf-8'
if sys.getdefaultencoding() != defaultencoding:
    reload(sys)
    sys.setdefaultencoding(defaultencoding)
# plt.rcParams['font.sans-serif']=['SimHei'] #用来正常显示中文标签
# plt.rcParams['axes.unicode_minus']=False #用来正常显示负号

font = FontProperties(fname='/etc/fonts/ttf/SimHei.ttf', size=15)


x_axis_data = [3.21431,6.428834,9.642534,12.857059,16.071369,19.285893,22.499593,25.713903,28.928428] #x
y_nopre = [17128894,46617059,83639752,136291571,190269496,271442766,369965256,482524581,556707768] #y
y_pre_10 = [11340404,32285941,56046282,91070709,123950166,183687226,255828644,338459765,383080954]
y_pre_9 = [8249913,27641909,49161293,83214999,111307439,167499443,235704981,309881320,362491187]
y_pre_8 = [6215634,23819914,40221638,69433538,93697645,140684711,206668117,268039961,307799588]
y_pre_7 = [9019144,21691884,34212484,58992709,74408876,116235735,161265757,219561327,250339209]

plt.plot(x_axis_data, y_nopre, color='#BD2A2E', linestyle='-', alpha=0.5, linewidth=1,label='nopre')
plt.plot(x_axis_data, y_pre_10, color='#38184C', linestyle='-', alpha=0.5, linewidth=1,label='pre_10')
plt.plot(x_axis_data, y_pre_9, color='#005C53', linestyle='-', alpha=0.5, linewidth=1,label='pre_9')
plt.plot(x_axis_data, y_pre_8, color='#13678A', linestyle='-', alpha=0.5, linewidth=1,label='pre_8')
plt.plot(x_axis_data, y_pre_7, color='#F2C12E', linestyle='-', alpha=0.5, linewidth=1,label='pre_7')

## plot中参数的含义分别是横轴值，纵轴值，线的形状（'s'方块,'o'实心圆点，'*'五角星   ...，颜色，透明度,线的宽度和标签 ，

plt.legend()  #显示上面的label
plt.xlabel('起点与终点的距离(km)',fontproperties=font) #x_label
plt.ylabel('路径规划gas消耗',fontproperties=font)#y_label
plt.xlim(2.5,30)
plt.ylim(0,600000000)
plt.ticklabel_format(axis="y", style='plain')

#设置横坐标间隔为1
ax=plt.gca()
ax.xaxis.set_major_locator(MultipleLocator(3))

plt.show()