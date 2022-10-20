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


x_axis_data = [0,1,2,3,4,5,6,7,8,9] #x
y_prefix = [6.104,5.178,4.614,4.419,4.016,3.609,3.089,2.819,2.418,2.117] #y
y_nopre = [6.342,6.845,6.831,6.94,7.148,6.989,7.048,6.373,6.067,6.044]

plt.plot(x_axis_data, y_prefix, color='#13678A', linestyle='-', marker='^', alpha=0.5, linewidth=1,label='prefix')
plt.plot(x_axis_data, y_nopre, color='#C43302', linestyle='-', marker='s', alpha=0.5, linewidth=1,label='noprefix')

## plot中参数的含义分别是横轴值，纵轴值，线的形状（'s'方块,'o'实心圆点，'*'五角星   ...，颜色，透明度,线的宽度和标签 ，

plt.legend()  #显示上面的label
plt.xlabel('两点GeoHash相同前缀的位数',fontproperties=font) #x_label
plt.ylabel('计算时间(ms)',fontproperties=font)#y_label
plt.xlim(-0.5,9.5)
plt.ylim(0,8)

#设置横坐标间隔为1
ax=plt.gca()
ax.xaxis.set_major_locator(MultipleLocator(1))

plt.show()


