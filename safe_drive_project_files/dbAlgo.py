import random

import pymongo
from pip._vendor import certifi
from pymongo import MongoClient
import time
from concurrent.futures import ThreadPoolExecutor

# CONST
TRAVELS_DB_NAME = "travels"
CONF_DB_NAME = "configurations"
DB_CAMERA_NAME = "camera_11"
url = "mongodb+srv://any:1111@safe.bgpte.mongodb.net/safe?retryWrites=true&w=majority"
PASSWORD = "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
MAIL = "ori.kohen123@gmail.com"
REVERSE = -1
ID_TITLE = '_id'
TRAVEL_NUMBER = 'travle_number_'
DEFAULT_DISTRACTIONS = 13
DEFAULT_FELL_ASLEEP = 50
DEFAULT_TIREDNESS = 50
STR_TIME = "%m/%d/%Y, %H:%M:%S"
PHONE_DB = "phone"
EYES_DB = "eyes"
YAWING_DB = "yawning"
YAWING_ALERT_DB = "yawningAlert"
NEXT_VAL = 1


class Db:
    def __init__(self, location=""):
        self.executor = ThreadPoolExecutor(max_workers=1)
        # connect to DB
        client = MongoClient(url, tlsCAFile=certifi.where())
        # connect to DB travels
        travels = client[TRAVELS_DB_NAME]
        # connect to DB camera
        cameraConf = client[DB_CAMERA_NAME]
        self.configurations = cameraConf[CONF_DB_NAME]
        self.travelsCamera = travels[DB_CAMERA_NAME]
        # find the number of last travel
        self.last = self.travelsCamera.find().sort(ID_TITLE, REVERSE)
        try:
            self.last = self.last[0][ID_TITLE] + NEXT_VAL
        except:
            self.last = NEXT_VAL
            self.createDefultConfigurations(self.configurations)

        camera = client[DB_CAMERA_NAME]
        self.infoCamera = camera[TRAVEL_NUMBER + str(self.last)]
        self.createTravle(self.last, self.travelsCamera, self.infoCamera, location)


    @staticmethod
    def createDefultConfigurations(configurations):
        item = {
            "_id": DB_CAMERA_NAME,
            "phone": DEFAULT_DISTRACTIONS,
            "eyes": DEFAULT_FELL_ASLEEP,
            "yawning": DEFAULT_TIREDNESS,
            "yawningAlert": True,
            "pass": PASSWORD,
            "mail": MAIL
        }
        configurations.insert_one(item)


    # Saving the information that a travel has started
    @staticmethod
    def createTravle(last, travelsCamera, infoCamera, location):
        named_tuple = time.localtime()  # get struct_time
        time_string = time.strftime(STR_TIME, named_tuple)
        item_1 = {
            "_id": last,
            "numberOfTravel": last,
            "time": time_string,
            "status": "start",
            "locations": location
        }
        travelsCamera.insert_one(item_1)
        infoCamera.insert_one(item_1)

    def async_send(self, status, massage="", location=""):
        self.executor.submit(self.send, status, massage, location)

    def get_configurations(self):
        conf = self.configurations.find()[0]
        phone = conf[PHONE_DB]
        eyes = conf[EYES_DB]
        yawning = conf[YAWING_DB]
        yawningAlert = conf[YAWING_ALERT_DB]
        return phone, eyes, yawning, yawningAlert

    # save on DB that event happened
    def send(self, status, massage="", location=""):
        named_tuple = time.localtime()  # get struct_time
        time_string = time.strftime(STR_TIME, named_tuple)

        item_1 = {
            "status": status,
            "time": time_string,
            "massage": massage,
            "locations": location
        }
        self.infoCamera.insert_one(item_1)

# if __name__ == '__main__':
#     length = random.randint(8, 22)
#     mapStatus = {1: "phone", 0: "sleep", 2: "yawning"}
#     # db = Db()
#     for j in range(3):
#         db = Db("ספיר, שלב א, נוף איילון, נפת רמלה,")
#         for i in range(length):
#             status = random.randint(0, 2)
#             time.sleep(0.26)
#             db.async_send(status, mapStatus[status])
#
#     print("send")
#     print("finish")
#
#     # yawning //arr[2]
#     # sleep = //arr[0]
#     # phone = //arrr[1]
