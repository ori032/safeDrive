import os

OUT_CAMERA = 1
INSIDE_CAMERA = 0
FREQUENCY = 2500
DURATION = 1500
ACCURACY = 10
CLOSED_EYE = 0.35
EYE_OPEN = 0.7
YAWN=0.8
DRAW_CICRLE = (0, 0, 255)
DRAW_REC = (255, 0, 0)
DRAW_TEXT = (0, 255, 0)
PSHELLCOMM = ['powershell', 'add-type -assemblyname system.device; ' \
                            '$loc = new-object system.device.location.geocoordinatewatcher;' \
                            '$loc.start(); ' \
                            'while(($loc.status -ne "Ready") -and ($loc.permission -ne "Denied")) ' \
                            '{start-sleep -milliseconds 100}; ' \
                            '$acc = %d; ' \
                            'while($loc.position.location.horizontalaccuracy -gt $acc) ' \
                            '{start-sleep -milliseconds 100; $acc = [math]::Round($acc*1.5)}; ' \
                            '$loc.position.location.latitude; ' \
                            '$loc.position.location.longitude; ' \
                            '$loc.position.location.horizontalaccuracy; ' \
                            '$loc.stop()' % ACCURACY]
BASE_PATH = os.path.dirname(os.path.realpath(__file__))
CASCADECLASSIFIER = BASE_PATH + '\haarcascade_profileface.xml'
SHAPE_PREDICTOR = BASE_PATH + '\shape_predictor_68_face_landmarks.dat'
TXT_YAWN = "you look a little bit tired,maybe you need a stop"
TXT_SLEEP = "Hey!wake up!!!!"
TXT_DROWSY = "you look a little bit tired"
TXT_PHONE = "look straight please"
ALERT_PHONE = "phone use"
ALERT_SLEEP = "sleeping"
ALERT_YAWN="yawn"
HEAD_LINE="Frame"
QUIT=ord('q')
STATUS_PHONE = 1
STATUS_YAWN = 2
STATUS_SLEEP = 0
PUT_TXT = "eye_closed"
ZERO = 0
ONE = 1
TWO = 2
THREE = 3
FOUR = 4
FIVE = 5
SIX = 6
SEVEN = 7
EIGHT = 8
NINE = 9
TEN=10
THREE_QUARTER =0.75
NONE_LOCATION= "אין מיקום תקין"
EXIT_KEY=0xFF
RESET=0
