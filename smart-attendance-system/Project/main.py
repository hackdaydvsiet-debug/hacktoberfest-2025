from fastapi import FastAPI, File, UploadFile
import numpy as np
import cv2
import os
from fastapi.responses import FileResponse
from enum import Enum
from pydantic import BaseModel, Field, computed_field
from typing import Annotated, Literal, Optional,List
import json
from face_recognition_system import load_student_encodings, recognize_faces, mark_attendance

app = FastAPI(title="Face Recognition Attendance System")


class patient(BaseModel):
    roll_no: Annotated[List[str], Field(..., description='Array of Roll No.', examples=['2309868090811'])]
    name: Annotated[List[str], Field(..., description='Arrays of Student names', examples=['Shaniyaz'])]
    Attendance: Annotated[List[Literal['absent','present']], Field(..., description='Attendance of the student')]


known_encodings, known_names,known_roll_no = load_student_encodings()

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    frame, recognized, recognized_roll_no = recognize_faces(known_encodings, known_names,known_roll_no, frame)
    mark_attendance(recognized, recognized_roll_no)

    return {"Names": list(recognized), 'Roll_no': list(recognized_roll_no), 'Attendance': list(('Present '*len(recognized)).split())}

@app.get("/download/attendance/")
def download_attendance():
    file_path = "attendance_log.csv"

    # check if file exists
    if not os.path.exists(file_path):
        return {"error": "Attendance file not found!"}

    # send file to browser
    return FileResponse(
        path=file_path,
        filename="attendance_log.csv",   # name shown in browser download
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
       # delete file after response is sent

    @response.call_on_close
    def cleanup():
        os.remove(file_path)

    return response