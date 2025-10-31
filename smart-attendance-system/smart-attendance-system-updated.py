
import cv2
import numpy as np
import os
import pandas as pd
from datetime import datetime
import tkinter as tk
from tkinter import messagebox, simpledialog

# Directories
KNOWN_FACES_DIR = "known_faces"
ATTENDANCE_FILE = "attendance.csv"
os.makedirs(KNOWN_FACES_DIR, exist_ok=True)

# Initialize attendance file if not present
if not os.path.exists(ATTENDANCE_FILE):
    df = pd.DataFrame(columns=["Name", "Date", "Time"])
    df.to_csv(ATTENDANCE_FILE, index=False)

# ------------------- REGISTER FACE -------------------
def register_face():
    cap = cv2.VideoCapture(0)
    messagebox.showinfo("Instructions", "Press 's' to capture your face and 'q' to quit.")
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        cv2.imshow("Register Face", frame)
        key = cv2.waitKey(1) & 0xFF
        if key == ord('s'):
            name = simpledialog.askstring("Input", "Enter your name:")
            if name:
                path = os.path.join(KNOWN_FACES_DIR, f"{name}.jpg")
                cv2.imwrite(path, frame)
                messagebox.showinfo("Success", f"Saved {name}'s face successfully!")
            break
        elif key == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()

# ------------------- MARK ATTENDANCE -------------------
def mark_attendance():
    known = []
    names = []
    for file in os.listdir(KNOWN_FACES_DIR):
        img = cv2.imread(os.path.join(KNOWN_FACES_DIR, file))
        if img is not None:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            known.append(cv2.resize(gray, (100, 100)))
            names.append(file.split('.')[0])

    if not known:
        messagebox.showerror("Error", "No registered faces found!")
        return

    cap = cv2.VideoCapture(0)
    messagebox.showinfo("Instructions", "Press 'q' to quit recognition.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        small = cv2.resize(gray, (100, 100))

        best_name = "Unknown"
        best_score = 1e9
        for i, kimg in enumerate(known):
            diff = cv2.absdiff(small, kimg)
            score = np.sum(diff)
            if score < best_score:
                best_score = score
                best_name = names[i]

        if best_score < 5000000:  # threshold (adjust if needed)
            cv2.putText(frame, f"{best_name} (Present)", (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            # mark attendance once per session
            now = datetime.now()
            date_str = now.strftime("%Y-%m-%d")
            time_str = now.strftime("%H:%M:%S")
            df = pd.read_csv(ATTENDANCE_FILE)

            if not ((df["Name"] == best_name) & (df["Date"] == date_str)).any():
                new_entry = pd.DataFrame([[best_name, date_str, time_str]],
                                         columns=["Name", "Date", "Time"])
                df = pd.concat([df, new_entry], ignore_index=True)
                df.to_csv(ATTENDANCE_FILE, index=False)

        cv2.imshow("Attendance System", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    messagebox.showinfo("Done", "Attendance recorded successfully!")

# ------------------- SHOW ATTENDANCE -------------------
def show_attendance():
    if not os.path.exists(ATTENDANCE_FILE):
        messagebox.showerror("Error", "No attendance records found!")
        return
    df = pd.read_csv(ATTENDANCE_FILE)
    if df.empty:
        messagebox.showinfo("Info", "No attendance marked yet!")
    else:
        top = tk.Toplevel(root)
        top.title("Attendance Records")
        text = tk.Text(top, width=60, height=20)
        text.pack()
        text.insert(tk.END, df.to_string(index=False))

# ------------------- GUI -------------------
root = tk.Tk()
root.title("Face Recognition Attendance System")
root.geometry("450x400")
root.configure(bg="#f5f5f5")

title = tk.Label(root, text="Face Attendance System", font=("Arial", 18, "bold"), bg="#f5f5f5")
title.pack(pady=20)

btn1 = tk.Button(root, text="Register Face", font=("Arial", 14),
                 command=register_face, bg="#4CAF50", fg="white", width=20)
btn1.pack(pady=10)

btn2 = tk.Button(root, text="Mark Attendance", font=("Arial", 14),
                 command=mark_attendance, bg="#2196F3", fg="white", width=20)
btn2.pack(pady=10)

btn3 = tk.Button(root, text="Show Attendance", font=("Arial", 14),
                 command=show_attendance, bg="#FFC107", fg="black", width=20)
btn3.pack(pady=10)

btn_exit = tk.Button(root, text="Exit", font=("Arial", 14),
                     command=root.destroy, bg="#f44336", fg="white", width=20)
btn_exit.pack(pady=10)

root.mainloop()
