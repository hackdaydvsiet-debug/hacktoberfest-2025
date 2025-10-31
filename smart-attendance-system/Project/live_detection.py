from fastapi import FastAPI, File, UploadFile
import numpy as np
import cv2
from face_recognition_system import load_student_encodings, recognize_faces, mark_attendance


def live_attendance(known_encodings, known_names, known_roll_no):
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame, recognized, recognize_roll_no = recognize_faces(known_encodings, known_names, known_roll_no, frame)

        if recognized:
            mark_attendance(recognized, recognize_roll_no)

        cv2.imshow("Live Attendance", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

known_encodings, known_names,known_roll_no = load_student_encodings()
live_attendance(known_encodings, known_names, known_roll_no)