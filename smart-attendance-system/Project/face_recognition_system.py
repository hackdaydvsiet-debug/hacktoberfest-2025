# face_recognition.py
import os
import cv2
import face_recognition
import pandas as pd
from datetime import datetime
from datetime import date
import numpy as np


## crawling student images and names from data folder and encoding them for furthur use.

def load_student_encodings(base_path="..\Data"):
    known_encodings = []
    known_names = []
    known_roll_no = []

# list the course Path folder

    for course_folder in os.listdir(base_path):
        course_path = os.path.join(base_path, course_folder)

        print(f'Course_path {course_path}')

# list the year path folder

        for year_folder in os.listdir(course_path):
            year_path = os.path.join(course_path, year_folder)
            print(f'Year_path {year_path}')

# listing the images and names present in the year folder

            for img_file in os.listdir(year_path):
                if img_file.endswith(('.jpg', '.png', '.jpeg')):
                    img_path = os.path.join(year_path, img_file)
                    name = os.path.splitext(img_file)[0]
                    name_split = name.split('.')
                    name = name_split[0]
                    roll_no = name_split[1]
                    print(f'roll_no: {roll_no}')
                    print(f'name {name}')

# encoding the images

                    img = face_recognition.load_image_file(img_path)
                    encodings = face_recognition.face_encodings(img)
                    if len(encodings) > 0:
                        known_encodings.append(encodings[0])
                        known_names.append(name)
                        known_roll_no.append(roll_no)

    return known_encodings, known_names, known_roll_no




def recognize_faces(known_encodings, known_names,known_roll_no, frame):
    # Convert to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Detect all faces
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    recognized = []
    recognized_roll_no = []

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_encodings, face_encoding)
        name = "Unknown"
        roll_no = '00'
        
        # Use the smallest distance
        face_distances = face_recognition.face_distance(known_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)

        if matches[best_match_index]:
            name = known_names[best_match_index]
            roll_no = known_roll_no[best_match_index]
            print(name)
            print(roll_no)
        recognized.append(name)
        recognized_roll_no.append(roll_no)
        # Draw rectangle
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)

    return frame, recognized, recognized_roll_no




def mark_attendance(names,roll_no):
    today = date.today()

    df = pd.DataFrame({
        "Roll_no": roll_no,
        "Name": names,
        "Date": [today] * len(names),
        "Status": ["Present"] * len(names)
    })
    print(df)
    
    file_path = "attendance_log.csv"

    if os.path.exists(file_path):
        os.remove(file_path)
        print("🗑️ File deleted successfully!")
    else:
        print("⚠️ File not found, nothing to delete.")
    
    df.to_csv("attendance_log.csv", mode='a', header=['Roll no.','Name','Date','Status'], index=False)




# img = cv2.imread('../../OpenCV/.jpg')

# known_encoding, known_names, known_roll_no = load_student_encodings()

# frame, names, roll_no = recognize_faces(known_encoding, known_names,known_roll_no, img)

# cv2.imshow("Detected Faces", frame)
# print(f'name {names}')
# mark_attendance(names, roll_no)
# cv2.waitKey(0)   # waits until you press a key
# cv2.destroyAllWindows()

















# known_encoding, known_names = load_student_encodings()
# print(f'Image: {known_encoding}')
# print(f'names: {known_names}')

# for i in zip(known_encoding, known_names):
#     print(i)