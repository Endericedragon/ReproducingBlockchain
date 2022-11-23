# coding:utf-8 
from cProfile import label
import json
import codecs
from turtle import color
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


x_axis_data = [40,50,60,70,80,90,100,110,120,130,140,150,160,180,200,220,240,260,300,400,500,600,700,800] #x
y_normal = [100,100,95,82.86,70,22.22,10,7.27,3.33,2.31,1.43,0.67,0,0,0,0,0,0,0,0,0,0,0,0] #y
y_tree = [92.50 ,94.00 ,91.67 ,94.29 ,93.75 ,97.78 ,93.00 ,91.82 ,91.67 ,92.31 ,90.00 ,85.33 ,86.25 ,88.33 ,85.50 ,69.09 ,55.00 ,49.62 ,43.67 ,36.25 ,17.40 ,3.17 ,1.14 ,0.38 ]

plt.plot(x_axis_data, y_normal, color='#13678A', linestyle='-', marker='^',alpha=0.5, linewidth=1,label='Normal BlockChain')
plt.plot(x_axis_data, y_tree, color='#C43302', linestyle='-', marker='s', alpha=0.5, linewidth=1,label='Geographic BlockChain')

## plot中参数的含义分别是横轴值，纵轴值，线的形状（'s'方块,'o'实心圆点，'*'五角星   ...，颜色，透明度,线的宽度和标签 ，

plt.legend()  #显示上面的label
plt.xlabel('高峰时区域内车辆数目',fontproperties=font) #x_label
plt.ylabel('车辆接单率（%）',fontproperties=font)#y_label
plt.xlim(38,800)
plt.ylim(-1,105)
plt.ticklabel_format(axis="y", style='plain')

#设置横坐标间隔为1
ax=plt.gca()
ax.xaxis.set_major_locator(MultipleLocator(50))

plt.show()