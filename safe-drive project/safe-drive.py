# Import required libraries and packages into the coding environment
from concurrent.futures.thread import ThreadPoolExecutor
import pyttsx3
import winsound
from imutils import face_utils
import dlib
import cv2
import ssl
import subprocess as sp
import re
import certifi
import geopy
from geopy import Nominatim
from safe_drive_project_files.Location import LocationInfo
from safe_drive_project_files.dbAlgo import Db
from safe_drive_project_files.helper_function import *
from safe_drive_project_files.const_params import *

stop_drive = False
ctx = ssl.create_default_context(cafile=certifi.where())
geopy.geocoders.options.default_ssl_context = ctx
location_data = LocationInfo()

# run as a task for the threadpool every time to sample the cur location and update.
def get_location():
    global stop_drive
    p = sp.Popen(PSHELLCOMM, stdin=sp.PIPE, stdout=sp.PIPE, stderr=sp.STDOUT, text=True)
    try:
        (out, err) = p.communicate()
        out = re.split('\n', out)
        lat = float(out[0])
        long = float(out[1])
        test = Nominatim(user_agent="geoapiExercises")
        location = test.reverse(str(lat) + "," + str(long))

        if location_data.lat is None or location_data.long is None:
            location_data.lat = lat
            location_data.long = long
            location_data.location = location
            return location
        else:
            if location_data.lat != lat or location_data.long != long:
                stop_drive = False
                location_data.counter = 0
                location_data.lat = lat
                location_data.long = long
                location_data.location = location

            else:
                location_data.counter += 1
                if location_data.counter >= FOUR:
                    stop_drive = False
    except:
        return None

# return the real address of the location
def parse_location(location):
    if location is None:
        return NONE_LOCATION
    address = location.raw['address']
    full_addr = [address.get('highway', address.get('road')), address.get('suburb', address.get('neighbourhood'))
        , address.get('town'), address.get('country', '')]
    full_addr = ','.join(str(i) for i in full_addr)
    return full_addr

#create the db
def create_db(start):
    try:
        db = Db(location=start)
        return db
    except:
        return None


# send the cur location
def send_location():
    if location_data is None or location_data.location is None:
        return NONE_LOCATION
    return location_data.location[0]


class DetectDriver:
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=1)
        self.location_start = get_location()
        self.data_base = create_db(parse_location(self.location_start))
        self.count_fame_conf_phone, self.count_fame_conf_sleep, self.count_fame_conf_yawn, self.alert_yawn = self.data_base.get_configurations()
        self.detector = dlib.get_frontal_face_detector()
        self.profile_cascade = cv2.CascadeClassifier(CASCADECLASSIFIER)
        self.predictor = dlib.shape_predictor(SHAPE_PREDICTOR)
        self.count = self.count_yawn = self.count_sleep = self.count_left_side = 0
        self.draw_on_image = True
    # run the threadpool with the tasks
    def find_location(self):
        self.executor.submit(get_location)
    # detect profile and phone use when you use phone or look the side long rime
    def detect_phone_use(self, box_left):
        if len(box_left) != 0:
            self.count_left_side += 1
            if self.count_left_side >= self.count_fame_conf_phone:
                winsound.Beep(FREQUENCY, DURATION)
                speak(volume=1, text=TXT_PHONE)
                self.data_base.async_send(STATUS_PHONE, ALERT_PHONE, location=send_location())
                self.count_left_side = 0
        elif self.count_left_side > ONE:
            self.count_left_side -= TWO

    # draw a rectangle over the profile
    def draw_profile(self, image, box_left):
        if self.draw_on_image:
            for (x, y, w, h) in box_left:
                cv2.rectangle(image, (x, y), (int(w), int(h)), DRAW_REC, ONE)

    # detect sleeping and DROWSY and yawn
    def detect_eyes(self, gray, rects, image):
        for (i, rect) in enumerate(rects):
            shape = self.predictor(gray, rect)
            shape = face_utils.shape_to_np(shape)
            eye_closed = (cal_left_eye(shape) + cal_right_eye(shape)) / TWO
            yawn = cal_yawn(shape)
            (x, y, w, h) = face_utils.rect_to_bb(rect)
            self.detect_yawn(yawn)
            if eye_closed >= EYE_OPEN:
                self.count = self.count_sleep = RESET
            elif EYE_OPEN > eye_closed > CLOSED_EYE:
                if self.count >= TEN:
                    self.count += 1
                    winsound.Beep(FREQUENCY, DURATION)
                    speak(text=TXT_DROWSY)
            else:
                self.count_sleep += 1
                if self.count_sleep >= self.count_fame_conf_sleep:
                    self.count_sleep = RESET
                    winsound.Beep(FREQUENCY, DURATION)
                    speak(volume=1, text=TXT_SLEEP)
                    self.data_base.async_send(STATUS_SLEEP, ALERT_SLEEP, location=send_location())
            if self.draw_on_image:
                cv2.putText(image, PUT_TXT+f" {eye_closed}", (x - TEN, y - TEN), cv2.FONT_HERSHEY_SIMPLEX, THREE_QUARTER,
                            DRAW_TEXT, TWO)
                cv2.rectangle(image, (x, y), (x + w, y + h), DRAW_REC, ONE)
            for (x, y) in shape:
                cv2.circle(image, (x, y), ONE, DRAW_CICRLE, -ONE)
    # detect yawn according the ask fro the client to alert or not
    def detect_yawn(self, yawn):
        if yawn >= YAWN:
            self.count_yawn += 1
        if self.count_yawn >= self.count_fame_conf_yawn:
            if self.alert_yawn:
                winsound.Beep(FREQUENCY, DURATION)
                speak(volume=1, text=TXT_YAWN)
            self.count_yawn = RESET
            self.data_base.async_send(STATUS_YAWN, ALERT_YAWN, location=send_location())
    """
    The main loop - run and each time take the frame and try to 
    detect eye sleeping of phone use.
    also if the client staring to get sleepy alert them.
    """
    def run_detection(self):
        vid = cv2.VideoCapture(INSIDE_CAMERA)
        while True:
            ret, image = vid.read()
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            rects = self.detector(gray, ONE)
            box_left, _ = detect(gray, self.profile_cascade)
            self.find_location()
            if not stop_drive:
                self.detect_phone_use(box_left)
                self.draw_profile(image, box_left)
                self.detect_eyes(gray, rects, image)
            cv2.imshow(HEAD_LINE, image)
            if cv2.waitKey(ONE) & EXIT_KEY == QUIT:
                break
        vid.release()
        cv2.destroyAllWindows()


if __name__ == '__main__':
    detect_driver = DetectDriver()
    detect_driver.run_detection()
