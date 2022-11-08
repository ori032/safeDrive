# Import required libraries and packages into the coding environment
import pyttsx3
import winsound
from imutils import face_utils
import numpy as np
import dlib
import cv2
from concurrent.futures import ThreadPoolExecutor

from trainng.dbAlgotemp import Db


def speak(text, volume=0.8,gender="HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech\Voices\Tokens\TTS_MS_EN-US_DAVID_11.0"):
    converter = pyttsx3.init()
    converter.setProperty('rate', 150)
    converter.setProperty('volume', volume)
    converter.setProperty('voice', gender)
    converter.say(text)
    converter.runAndWait()


def convert_rightbox(img, box_right):
    if len(box_right):
        return ()
    res = np.array([])
    _, x_max = img.shape
    for box_ in box_right:
        box = np.copy(box_)
        box[0] = x_max - box_[2]
        box[2] = x_max - box_[0]
        if res.size == 0:
            res = np.expand_dims(box, axis=0)
        else:
            res = np.vstack((res, box))
    return res


def detect(img, cascade):
    rects, _, confidence = cascade.detectMultiScale3(img, scaleFactor=1.3, minNeighbors=4, minSize=(30, 30),
                                                     flags=cv2.CASCADE_SCALE_IMAGE, outputRejectLevels=True)
    # rects = cascade.detectMultiScale(img,minNeighbors=10, scaleFactor=1.05)
    if len(rects) == 0:
        return (), ()
    rects.astype(int)
    rects[:, 2:] += rects[:, :2]
    return rects, confidence


# Take a bounding predicted by dlib and convert it to the format (x, y, w, h) as we would normally do with OpenCV. Return a tuple of (x, y, w, h)

def rect_to_bb(rect):
    x = rect.left()
    y = rect.top()
    w = rect.right() - x
    h = rect.bottom() - y
    return x, y, w, h


# Initialize the list of (x, y)-coordinates. Loop over the 68 facial landmarks and convert them to a 2-tuple of (x, y)-coordinates. Return the list of (x, y)-coordinates

def shape_to_np(shape, dtype="int"):
    coords = np.zeros((68, 2), dtype=dtype)
    for i in range(0, 68):
        coords[i] = (shape.part(i).x, shape.part(i).y)
    return coords


# Initialize dlib's face detector (HOG-based) and then create the facial landmark predictor.

detector = dlib.get_frontal_face_detector()
profile_cascade = cv2.CascadeClassifier('haarcascade_profileface.xml')
predictor = dlib.shape_predictor('shape_predictor_68_face_landmarks.dat')

# Determine the facial landmarks for the face region, then convert the facial landmark (x, y)- coordinates to a NumPy array. Convert dlib's rectangle to a OpenCV-style bounding box [i.e., (x, y, w, h)], then draw the face bounding box. Loop over the (x, y)-coordinates for the facial landmarks and draw them on the image. Show the output image with the face detections + facial landmarks
executor = ThreadPoolExecutor(5)
vid = cv2.VideoCapture(0)
count = 0
count_yawn = 0
count_sleep = 0
count_drowsy = 0
count_right_side = 0
count_left_side = 0
previous_output = "ALERT"
mouth_output = "GOOD"
stop = False
data_base = Db()
while not stop:
    ret, image = vid.read()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    rects = detector(gray, 1)
    box_left, _ = detect(gray, profile_cascade)
    # gray_flipped = cv2.flip(gray, 1)
    # box_right, w_right = detect(gray_flipped, profile_cascade)
    if len(box_left) != 0:
        count_left_side += 1
        if count_left_side >= 8:
            # frequency = 2500  # Set Frequency To 2500 Hertz
            # duration = 1000  # Set Duration To 1000 ms == 1 second
            # winsound.Beep(frequency, duration)
            speak(volume=1, text="look straight please")
            data_base.send(1, "get sleep")
            count_left_side -= 8
    for (x, y, w, h) in box_left:
        print(x, y, w, h)
        cv2.rectangle(image, (x, y), (int(w), int(h)), (0, 0, 255), 1)
    gray_flipped = cv2.flip(gray, 1)
    box_right, w_right = detect(gray_flipped, profile_cascade)
    box_right = convert_rightbox(gray_flipped, box_right)
    if len(box_right) != 0:
        count_right_side += 1
        if count_right_side >= 8:
            frequency = 2500  # Set Frequency To 2500 Hertz
            duration = 1000  # Set Duration To 1000 ms == 1 second
            winsound.Beep(frequency, duration)
            speak(volume=1, text="look straight please")
            data_base.send(1, "get sleep")
            count_right_side -= 10
    for (i, rect) in enumerate(rects):
        shape = predictor(gray, rect)
        shape = face_utils.shape_to_np(shape)
        left_eye_f = (abs(shape[37, 1] - shape[41, 1]) + abs(shape[38, 1] - shape[40, 1])) / abs(
            shape[36, 0] - shape[39, 0])
        right_eye_f = (abs(shape[43, 1] - shape[47, 1]) + abs(shape[44, 1] - shape[46, 1])) / abs(
            shape[42, 0] - shape[45, 0])
        Yawn = (abs(shape[49, 1] - shape[59, 1]) + abs(shape[61, 1] - shape[67, 1]) + abs(shape[62, 0] - shape[66, 0])
                + abs(shape[63, 0] - shape[65, 0]) + abs(shape[53, 0] - shape[55, 0])) / abs(
            shape[48, 0] - shape[54, 0])

        (x, y, w, h) = face_utils.rect_to_bb(rect)
        # cv2.rectangle(image, (x, y), (x + w, y + h), (255, 0, 0), 1)
        eye_closed = (left_eye_f + right_eye_f) / 2

        if eye_closed >= 0.7:
            count = count_sleep = count_drowsy = 0
            previous_output = "ALERT"
            cv2.putText(image, f"eye_closed{eye_closed}", (x - 10, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)

        elif 0.6 > eye_closed >= 0.4:
            if previous_output == "DROWSY":
                count_drowsy += 1
                # frequency = 250  # Set Frequency To 2500 Hertz
                # duration = 1000  # Set Duration To 1000 ms == 1 second
                # winsound.Beep(frequency, duration)
                # speak("hey,dont sleep")
                cv2.putText(image, f"eye_closed{eye_closed}", (x - 10, y - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)
            if count >= 30:
                count = count + 1
                previous_output = "DROWSY alarm"
                frequency = 2500  # Set Frequency To 2500 Hertz
                duration = 1500  # Set Duration To 1000 ms == 1 second
                winsound.Beep(frequency, duration)
                speak(volume=0.5, text="you look a little bit tired")

                cv2.putText(image, f"eye_closed{eye_closed}", (x - 10, y - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)
            # elif previous_output == "ALERT":
            #     previous_output = "DROWSY"
            #     count = 1
            #     cv2.putText(image, "DROWSY", (x - 10, y - 10),
            #                 cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)
        elif eye_closed <= 0.3:
            count_sleep += 1
            if count_sleep > 5:
                previous_output = "sleep alarm"
                frequency = 2500  # Set Frequency To 2500 Hertz
                duration = 1500  # Set Duration To 1000 ms == 1 second
                winsound.Beep(frequency, duration)
                speak(volume=0.5, text="hey,wake up asshole!!!")
                data_base.send(0,"get sleep")
                count_sleep -= 4

        cv2.putText(image, f"eye_closed{eye_closed}", (x - 10, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)
        cv2.putText(image, "count = %d" % count, (x + w + 20, y + h + 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        if Yawn < 0.8:
            mouth_output = "GOOD"
            cv2.putText(image, "GOOD", (x - 60, y - 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)
        elif Yawn >= 0.8:
            mouth_output = "SLEEPY"
            count_yawn = count_yawn + 1
            data_base.send(2, "get sleep")
        if count_yawn >= 100:
            mouth_output = "SLEEPY"
            # count_yawn = count_yawn + 1
            frequency = 2500  # Set Frequency To 2500 Hertz
            duration = 1000  # Set Duration To 1000 ms == 1 second
            winsound.Beep(frequency, duration)
            speak(volume=0.5, text="you look a little bit sleepy,maybe you need a stop")
            cv2.putText(image, " You are Sleepy.Please drink Water", (x - 60, y - 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)
            count_yawn = 0
        cv2.putText(image, "count_yawn = %d" % count_yawn, (x + w, y + h),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        for (x, y) in shape:
            cv2.circle(image, (x, y), 1, (0, 0, 255), -1)
    cv2.imshow("Frame", image)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        stop = True
vid.release()
cv2.destroyAllWindows()
