# coding:utf-8 
import json
import codecs
from matplotlib import markers
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

x_axis_data = [50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400] #x
y_axis_data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,9,13,15,22,20,34,56,46,47,73,63,60,63,62,52,51,56,89] #y
plt.plot(x_axis_data, y_axis_data,color='#BD2A2E', linestyle='-', marker='s', alpha=0.5, linewidth=1)

## plot中参数的含义分别是横轴值，纵轴值，线的形状（'s'方块,'o'实心圆点，'*'五角星   ...，颜色，透明度,线的宽度和标签 ，

plt.legend()  #显示上面的label
plt.xlabel('乘客数量',fontproperties=font) #x_label
plt.ylabel('丢单数量',fontproperties=font)#y_label
 
#plt.ylim(-1,1)#仅设置y轴坐标范围
plt.show()