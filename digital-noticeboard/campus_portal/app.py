from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory, session, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from functools import wraps
import os, datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'dev-key-change-me'  # change for production

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)  # plaintext for demo; hash in prod
    role = db.Column(db.String(10), nullable=False)  # 'admin' or 'student'

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    contact = db.Column(db.String(120), nullable=True)
    kind = db.Column(db.String(20), nullable=False)  # 'lost' or 'found'
    image = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return dict(id=self.id, title=self.title, description=self.description,
                    contact=self.contact, kind=self.kind, image=self.image,
                    created_at=self.created_at.isoformat())

class Notice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)


# helpers
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('role') != 'admin':
            flash('Admin access required!', 'warning')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

# Ensure DB + default users exist (Flask 3.x friendly)
with app.app_context():
    db.create_all()
    if not User.query.filter_by(username='admin').first():
        db.session.add(User(username='admin', password='admin123', role='admin'))
    if not User.query.filter_by(username='student1').first():
        db.session.add(User(username='student1', password='stud123', role='student'))
    db.session.commit()


# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username, password=password).first()
        if user:
            session['user_id'] = user.id
            session['username'] = user.username
            session['role'] = user.role
            flash('Logged in successfully', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid credentials', 'danger')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out', 'info')
    return redirect(url_for('login'))


@app.route('/report')
@login_required
def report():
    return render_template('report.html')

@app.route('/items', methods=['GET'])
@login_required
def get_items():
    items = Item.query.order_by(Item.created_at.desc()).all()
    return jsonify([i.to_dict() for i in items])

@app.route('/add', methods=['POST'])
@login_required
def add_item():
    title = request.form.get('title')
    description = request.form.get('description')
    contact = request.form.get('contact')
    kind = request.form.get('kind')
    image_filename = None
    if 'image' in request.files:
        f = request.files['image']
        if f and f.filename:
            filename = secure_filename(f.filename)
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            f.save(save_path)
            image_filename = os.path.join('static', 'uploads', filename).replace('\\\\','/')
    item = Item(title=title, description=description, contact=contact or '', kind=kind or 'lost', image=image_filename)
    db.session.add(item)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/delete/<int:item_id>', methods=['DELETE','POST'])
@login_required
def delete_item(item_id):
    item = Item.query.get_or_404(item_id)
    # allow delete only to admins or the user (for demo we allow admins only)
    if session.get('role') != 'admin':
        return jsonify({'error':'admin required'}), 403
    if item.image:
        try:
            os.remove(os.path.join(BASE_DIR, item.image))
        except Exception:
            pass
    db.session.delete(item)
    db.session.commit()
    return jsonify({'status':'ok'})

@app.route('/notices')
@login_required
def notices():
    all_notices = Notice.query.order_by(Notice.created_at.desc()).all()
    return render_template('notices.html', notices=all_notices)

@app.route('/add_notice', methods=['GET','POST'])
@admin_required
def add_notice():
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')
        n = Notice(title=title, content=content)
        db.session.add(n)
        db.session.commit()
        flash('Notice added', 'success')
        return redirect(url_for('notices'))
    return render_template('add_notice.html')

# Serve uploads (optional)
@app.route('/static/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
