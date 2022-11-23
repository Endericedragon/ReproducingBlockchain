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
y_nopre = [69,174.8,310.7,509.7,699.5,999.1,1353.4,1793.8,2043.1] #y
y_pre_10 = [46.4,120.3,199.1,313.7,414,633.5,894.7,1198,1325]
y_pre_9 = [33.1,99,171.9,281.3,365.5,560.9,798.1,1053.6,1220.5]
y_pre_8 = [24.9,85.7,134.2,232.8,301.3,460,705.1,902.3,1016.1]
y_pre_7 = [33.6,71.8,108.6,182.4,220.2,354.2,516.9,689.8,790.1]

plt.plot(x_axis_data, y_nopre, color='#BD2A2E', linestyle='-', alpha=0.5, linewidth=1,label='nopre')
plt.plot(x_axis_data, y_pre_10, color='#38184C', linestyle='-', alpha=0.5, linewidth=1,label='pre_10')
plt.plot(x_axis_data, y_pre_9, color='#005C53', linestyle='-', alpha=0.5, linewidth=1,label='pre_9')
plt.plot(x_axis_data, y_pre_8, color='#13678A', linestyle='-', alpha=0.5, linewidth=1,label='pre_8')
plt.plot(x_axis_data, y_pre_7, color='#F2C12E', linestyle='-', alpha=0.5, linewidth=1,label='pre_7')

## plot中参数的含义分别是横轴值，纵轴值，线的形状（'s'方块,'o'实心圆点，'*'五角星   ...，颜色，透明度,线的宽度和标签 ，

plt.legend()  #显示上面的label
plt.xlabel('起点与终点的距离(km)',fontproperties=font) #x_label
plt.ylabel('路径规划时间(ms)',fontproperties=font)#y_label
plt.xlim(2.5,30)
plt.ylim(0,2500)

#设置横坐标间隔为1
ax=plt.gca()
ax.xaxis.set_major_locator(MultipleLocator(3))

plt.show()


