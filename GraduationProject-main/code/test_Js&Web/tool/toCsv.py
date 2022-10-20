import json
import csv
import sys
reload(sys)
sys.setdefaultencoding( "utf-8" )
#tartget:    json  ==>   scsv
#env:            Python 2.7.17

def csv_json():
    # 1. read file
    json_fp = open("res.json", "r")
    csv_fp = open("res.csv", "w")

    # 2.get title
    data_list = json.load(json_fp)
    sheet_title = data_list[0].keys()
    sheet_data = []
    for data in data_list:
        sheet_data.append(data.values())

    # 3.write to csv
    writer = csv.writer(csv_fp)

    # 4write title
    writer.writerow(sheet_title)

    # 5.write content
    writer.writerows(sheet_data)

    print("finish")

    # 6.close file
    json_fp.close()
    csv_fp.close()


if __name__ == "__main__":
    csv_json()
