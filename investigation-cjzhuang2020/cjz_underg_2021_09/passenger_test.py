# coding=UTF-8
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
reload(sys)
sys.setdefaultencoding('utf8')

from passengerAccounts import passengers

def passengerClient(passengerId,index):
    chrome_options = webdriver.ChromeOptions()
    # chrome_options.add_argument("--no-sandbox")

    # chrome_options.add_argument('--auto-open-devtools-for-tabs')

    wd1 = webdriver.Chrome(chrome_options=chrome_options,executable_path='/usr/bin/chromedriver')
    # action = action_chains.ActionChains(wd1)
    wd1.get('file:///'+os.path.abspath('sys_passenger_region_noPos.html'))
    wd1.set_window_size(400,520)
    wd1.set_window_position(470*index, 10)

    js='document.getElementById("title").value = "passenger"'
    wd1.execute_script(js)

    wd1.find_element_by_id('getPassengerById1').send_keys(passengerId)
    wd1.find_element_by_id('getPassengerById2').click()

    # 初始化乘客位置信息
    time.sleep(1)
    wd1.find_element_by_class_name('initPassenger').click()

    # 直接滚动到底部
    js="var q=document.documentElement.scrollTop=10000"
    wd1.execute_script(js)

    # 确认乘客位置、乘客起止点记录在智能合约
    locator1 = ("id","vehicleEvent")
    text1 = "乘客出发点和目的地已记录在智能合约"
    wait = WebDriverWait(wd1,100,1)
    wait.until(EC.text_to_be_present_in_element_value(locator1,text1))
    # 开始请求车辆
    wd1.find_element_by_class_name('manageVehicleByRegion').click()

    # 确认到达目的地之后付款
    locator2 = ("id","vehicleEvent")
    text2 = "乘客到达目的地"
    wait = WebDriverWait(wd1,100,1)
    wait.until(EC.text_to_be_present_in_element_value(locator2,text2))
    # 开始付款
    wd1.find_element_by_class_name('getOff').click()

    # 防止浏览器关闭
    locator3 = ("id","vehicleEvent")
    text3 = "乘客支付了订单"
    wait.until(EC.text_to_be_present_in_element_value(locator3, text3))

    time.sleep(15)
    wd1.quit()
    return

pool = []

def workLoop(passengerId,index,requestNum,requestInterval):
    for i in range(0,requestNum):
        passengerClient(passengerId,index)
        time.sleep(requestInterval)


# requestNum代表一个乘客提出多少次需求，requestInterval代表乘客提出需求的时间间隔
def workConfig(requestNum, requestInterval):
    for index,passenger in enumerate(passengers):
        onePassenger = Process(target=workLoop, args=(passenger,index,requestNum,requestInterval,))
        pool.append(onePassenger)
    for one in pool:
        one.start()
        time.sleep(2)

workConfig(1,5)
# for index,passenger in enumerate(passengers):
#     onePassenger = Process(target=passengerClient, args=(passenger,index,))
#     pool.append(onePassenger)


    

# element = wd1.find_element_by_tag_name('body')
# element.send_keys(Keys.CONTROL+Keys.SHIFT, 'j')
# action.key_down(Keys.CONTROL).key_down(Keys.SHIFT).send_keys('j').perform()
# print(driver.get_log("browser"))
# action.key_down(Keys.CONTROL + Keys.SHIFT + 'j').perform()
# action.key_up(Keys.CONTROL + Keys.SHIFT + 'j').perform()