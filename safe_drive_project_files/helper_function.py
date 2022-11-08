import cv2
import numpy as np
import pyttsx3


def speak(text, volume=0.8,
          gender="HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech\Voices\Tokens\TTS_MS_EN-US_DAVID_11.0"):
    converter = pyttsx3.init()
    converter.setProperty('rate', 200)
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
    rects, _, confidence = cascade.detectMultiScale3(img, scaleFactor=1.4, minNeighbors=4, minSize=(30, 30),
                                                     flags=cv2.CASCADE_SCALE_IMAGE, outputRejectLevels=True)
    if len(rects) == 0:
        return (), ()
    rects.astype(int)
    rects[:, 2:] += rects[:, :2]
    return rects, confidence


def rect_to_bb(rect):
    x = rect.left()
    y = rect.top()
    w = rect.right() - x
    h = rect.bottom() - y
    return x, y, w, h


def shape_to_np(shape, dtype="int"):
    coords = np.zeros((68, 2), dtype=dtype)
    for i in range(0, 68):
        coords[i] = (shape.part(i).x, shape.part(i).y)
    return coords


def cal_left_eye(shape):
    return (abs(shape[37, 1] - shape[41, 1]) + abs(shape[38, 1] - shape[40, 1])) / abs(
        shape[36, 0] - shape[39, 0])


def cal_right_eye(shape):
    return (abs(shape[43, 1] - shape[47, 1]) + abs(shape[44, 1] - shape[46, 1])) / abs(
        shape[42, 0] - shape[45, 0])


def cal_yawn(shape):
    return (abs(shape[49, 1] - shape[59, 1]) + abs(shape[61, 1] - shape[67, 1]) + abs(shape[62, 0] - shape[66, 0])
            + abs(shape[63, 0] - shape[65, 0]) + abs(shape[53, 0] - shape[55, 0])) / abs(
        shape[48, 0] - shape[54, 0])

