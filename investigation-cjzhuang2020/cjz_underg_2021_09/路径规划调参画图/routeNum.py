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
y_nopre = [16,61,115,193,291,409,533,689,863] #y
y_pre_10 = [16,61,115,193,291,409,533,689,863]
y_pre_9 = [12,55,113,187,285,401,523,677,847]
y_pre_8 = [10,51,101,177,271,373,513,667,821]
y_pre_7 = [16,55,99,175,251,365,467,631,753]

sum10 = 0
for i in y_pre_10:
    sum10 = sum10 + i
sum9 = 0
for i in y_pre_9:
    sum9 = sum9 + i
sum8 = 0
for i in y_pre_8:
    sum8 = sum8 + i
sum7 = 0
for i in y_pre_7:
    sum7 = sum7 + i

print((sum9 - sum10)/float(sum10))
print((sum8 - sum10)/float(sum10))
print((sum7 - sum10)/float(sum10))

plt.plot(x_axis_data, y_nopre, color='#BD2A2E', linestyle='-', alpha=0.5, linewidth=1,label='nopre')
plt.plot(x_axis_data, y_pre_10, color='#38184C', linestyle='-', alpha=0.5, linewidth=1,label='pre_10')
plt.plot(x_axis_data, y_pre_9, color='#005C53', linestyle='-', alpha=0.5, linewidth=1,label='pre_9')
plt.plot(x_axis_data, y_pre_8, color='#13678A', linestyle='-', alpha=0.5, linewidth=1,label='pre_8')
plt.plot(x_axis_data, y_pre_7, color='#F2C12E', linestyle='-', alpha=0.5, linewidth=1,label='pre_7')

## plot中参数的含义分别是横轴值，纵轴值，线的形状（'s'方块,'o'实心圆点，'*'五角星   ...，颜色，透明度,线的宽度和标签 ，

plt.legend()  #显示上面的label
plt.xlabel('起点与终点的距离',fontproperties=font) #x_label
plt.ylabel('算法遍历的路段数目',fontproperties=font)#y_label
plt.xlim(2.5,30)
plt.ylim(0,1000)

#设置横坐标间隔为1
ax=plt.gca()
ax.xaxis.set_major_locator(MultipleLocator(3))

plt.show()


