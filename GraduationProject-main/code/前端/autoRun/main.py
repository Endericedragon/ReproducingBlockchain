#encoding:utf-8
import json
from re import T
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support import expected_conditions as EC
from threading import Thread
import time
import os
options=Options()
# options.add_argument("--sandbox")
options.add_argument("--headless")
def  passengerEvent(id,start,end):
    print("Passenger:%s"%(id))
    driver=webdriver.Firefox(options=options)
    #vue 项目run的地址
    driver.get("http://localhost:8081?id="+id+"&start="+start+"&end="+end)

    print(" -开始调度车辆")
    time1=time.time()
    driver.find_element_by_id('startManageVehicle').click()

    wait = WebDriverWait(driver,100,1)
  
    wait.until(EC.presence_of_element_located((By.ID,"startBtn")))
    print(" -上车")
    time2=time.time()
    driver.find_element_by_id('startBtn').click()
  
    wait.until(EC.presence_of_element_located((By.ID,"payBtn")))
    print(" -开始支付")
    time3=time.time()
    driver.find_element_by_id('payBtn').click()

    # wait.until(EC.presence_of_element_located((By.ID,"startManageVehicle")))
    time4=time.time()
    print(" -结束")
    print("P:%s  \n step1(start manage vehicle -- get on vehicle):%f  \n step2(get on vehicle -- begin to pay):%f \n step3(begin to pay -- reset):%f  "%(id,time2-time1,time3-time2,time4-time3))



def vehicleEvent(id,place):
    print("Vehicle:%s"%(id))
    driver=webdriver.Firefox(options=options)
    #vue 项目run的地址
    driver.get("http://localhost:8080?id="+id+"&place="+place)
    wait = WebDriverWait(driver,100,1)
    wait.until(EC.presence_of_element_located((By.CLASS_NAME,"partners")))
    driver.find_element_by_id('pickupBtn').click()


def config():
    # 组成调用js的命令
    # node命令：node -e
    print("start read file")
    with open("vehiclesInfo.json",'r') as f1:
        vehicles=json.load(f1)
    with open("passengersInfo.json",'r') as f2:
        passengers=json.load(f2)
    pool=[]
    for vehicle in vehicles:
        pool.append(Thread(target=vehicleEvent,args=(vehicle["vehicleId"],vehicle["vehiclePosition"])))
    for passenger in passengers:
        pool.append(Thread(target=passengerEvent,args=(passenger["passengerId"],passenger["startPosition"],passenger["endPosition"])))
    for one in pool:
        one.start()

def createAccount():
        print("init begin")
        #三个参数，第一个是一共生成多少新账户，第二个是分配给passenger的账户数量，第三个参数是分配给vehicle的账户数量
        os.system("node ./createAccounts.js 0 4 4")

t=Thread(target=createAccount)
t.start()
time.sleep(5)
reply="n"
while reply!="y":
    reply=raw_input("Do you finish?")
config()