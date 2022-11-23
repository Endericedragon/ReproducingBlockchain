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
y_prefix = [934478,781492,656484,599974,511494,413864,311700,262042,148472,75971] #y
y_nopre = [850004,922704,947876,927282,915866,936432,938740,911294,925008,897590]

plt.plot(x_axis_data, y_prefix, color='#13678A', linestyle='-', marker='^', alpha=0.5, linewidth=1,label='prefix')
plt.plot(x_axis_data, y_nopre, color='#C43302', linestyle='-', marker='s', alpha=0.5, linewidth=1,label='noprefix')

## plot中参数的含义分别是横轴值，纵轴值，线的形状（'s'方块,'o'实心圆点，'*'五角星   ...，颜色，透明度,线的宽度和标签 ，

plt.legend()  #显示上面的label
plt.xlabel('两点GeoHash相同前缀的位数',fontproperties=font) #x_label
plt.ylabel('gas消耗',fontproperties=font)#y_label
plt.ticklabel_format(axis="y", style='plain')
plt.xlim(-0.5,9.5)
plt.ylim(0,1000000)
 
ax=plt.gca()
ax.xaxis.set_major_locator(MultipleLocator(1))

#plt.ylim(-1,1)#仅设置y轴坐标范围
plt.show()


