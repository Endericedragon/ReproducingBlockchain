# coding=UTF-8
from vehicleAccounts import vehicles
from selenium import webdriver
from selenium.webdriver.common import action_chains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
from multiprocessing import Process
import threading
import time
import sys
from importlib import reload
reload(sys)
# sys.setdefaultencoding('utf8')

# chrome_options = webdriver.ChromeOptions()
# chrome_options.add_argument('--auto-open-devtools-for-tabs')


def vehicleClient(vehicleId, index):
    wd2 = webdriver.Chrome('/usr/bin/chromedriver')
    wd2.get('file:///'+os.path.abspath('sys_vehicle_region.html'))
    wd2.set_window_size(300, 520)
    wd2.set_window_position(470*index, 550)

    js = 'document.getElementById("title").value = "vehicle"'
    wd2.execute_script(js)

    wd2.find_element(by=By.ID, value='getVehicleById1').send_keys(vehicleId)
    wd2.find_element(by=By.ID, value='getVehicleById2').click()

    # 初始化车辆位置信息
    time.sleep(1)
    wd2.find_element(by=By.CLASS_NAME, value='initVehicle').click()

    # # 直接滚动到底部
    # js = "var q=document.documentElement.scrollTop=10000"
    # wd2.execute_script(js)
    # # 车辆工作时间是300秒
    time.sleep(600)
    # # 车辆注销id
    # wd2.find_element(by=By.ID, value='deleteVehicle').click()
    # time.sleep(5)

    # 监听打车请求
    # locator1 = ("id","Myevent")
    # text1 = "whether to pick up the passenger?"
    # wait = WebDriverWait(wd2,100,1)
    # wait.until(EC.text_to_be_present_in_element_value(locator1,text1))

    # 选择接客,车辆pickUp的功能在浏览器内自动实现
    # wd2.find_element_by_class_name('pickUp').click()

    # 接客到乘客确认上车
    # locator2 = ("id","Myevent")
    # text2 = "vehicle picked up the passenger"
    # wait.until(EC.text_to_be_present_in_element_value(locator2, text2))
    # time.sleep(2)

    # 送乘客到终点,车辆manageToEnd的功能在浏览器内自动实现
    # wd2.find_element_by_class_name('manageToEnd').click()
    # 防止浏览器关闭
    # locator3 = ("id","Myevent")
    # text3 = "vehicle reached the end"
    # wait.until(EC.text_to_be_present_in_element_value(locator3, text3))


if __name__ == '__main__':
    pool = []
    print(len(vehicles))
    for index, vehicle in enumerate(vehicles):
        oneVehicle = Process(target=vehicleClient, args=(vehicle, index,))
        pool.append(oneVehicle)

    for one in pool:
        one.start()
        time.sleep(1)

# locator3 = ("id","Myevent")
# text3 = "vehicle reached the end"
# wait.until(EC.text_to_be_present_in_element_value(locator3, text3))
