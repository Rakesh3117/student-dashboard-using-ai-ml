from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from joblib import load
import numpy as np
import os
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_url_path='')
CORS(app)  # Enable CORS for all routes

# Define upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv', 'xlsx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size 16MB

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Load the model and feature info
try:
    logger.info("Loading model and feature info...")
    model = load('student_performance_model.joblib')
    feature_info = load('model_features.joblib')
    logger.info("Model and features loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    raise

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/style.css')
def serve_css():
    return send_from_directory('.', 'style.css', mimetype='text/css')

@app.route('/script.js')
def serve_js():
    return send_from_directory('.', 'script.js', mimetype='application/javascript')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file and allowed_file(file.filename):
        filename = 'student_performance_data.csv'  # Rename all uploads
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        try:
            # Delete old file if it exists
            if os.path.exists(filepath):
                os.remove(filepath)

            # Save new file
            file.save(filepath)

            return jsonify({'message': 'File uploaded successfully', 'filename': filename}), 200
        except Exception as e:
            logger.error(f"Error saving file: {str(e)}")
            return jsonify({'error': 'Failed to save file'}), 500
    else:
        return jsonify({'error': 'Invalid file type. Only CSV files are allowed.'}), 400

def generate_study_recommendations(prediction, input_data):
    """Generate personalized study recommendations based on prediction and input data"""
    recommendations = []
    
    # Define threshold for "at risk" students
    risk_threshold = 70.0
    
    # Extract input values
    study_hours = input_data[0]
    previous_score = input_data[1]
    attendance = input_data[2]
    difficulty = input_data[3]
    internet = input_data[4]
    
    # Study hours recommendations
    if study_hours < 3:
        recommendations.append(f"Increase your daily study time by {min(5-study_hours, 2):.1f} hours")
    
    # Attendance recommendations
    if attendance < 80:
        recommendations.append(f"Improve your attendance from {attendance}% to at least 85%")
    
    # Difficulty-based recommendations
    difficulty_map = {1: "Easy", 2: "Medium", 3: "Hard"}
    difficulty_text = difficulty_map.get(difficulty, "Medium")
    
    if difficulty == 3 and prediction < risk_threshold:
        recommendations.append("Consider breaking down complex topics into smaller, manageable parts")
        recommendations.append("Try using flashcards to simplify difficult concepts")
    
    # Previous score recommendations
    if previous_score < 70:
        recommendations.append("Review fundamental concepts from previous materials")
    
    # Internet access recommendations
    if internet == 0:
        recommendations.append("Try to find access to online educational resources")
    
    # If no specific recommendations, provide general advice
    if not recommendations:
        recommendations.append("Maintain your current study habits")
        recommendations.append("Consider participating in study groups for additional insights")
    
    return recommendations

def detect_risk_factors(prediction, input_data):
    """Detect and explain risk factors for poor performance"""
    risk_info = {"at_risk": False, "factors": []}
    
    # Define threshold for "at risk" students
    risk_threshold = 70.0
    
    if prediction < risk_threshold:
        risk_info["at_risk"] = True
        
        # Extract input values
        study_hours = input_data[0]
        previous_score = input_data[1]
        attendance = input_data[2]
        difficulty = input_data[3]
        internet = input_data[4]
        
        # Check each factor
        if study_hours < 2:
            risk_info["factors"].append("Low study hours")
        
        if previous_score < 65:
            risk_info["factors"].append("Low previous performance")
        
        if attendance < 75:
            risk_info["factors"].append("Poor attendance")
        
        if difficulty == 3:
            risk_info["factors"].append("High subject difficulty")
        
        if internet == 0:
            risk_info["factors"].append("Limited internet access")
            
        # If no specific factors identified but still at risk
        if not risk_info["factors"]:
            risk_info["factors"].append("Multiple minor factors")
    
    return risk_info

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        required_fields = ['study_hours', 'previous_score', 'attendance', 'difficulty', 'internet']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Map string inputs to numeric if needed
        difficulty_map = {'Easy': 1, 'Medium': 2, 'Hard': 3}
        internet_map = {'Yes': 1, 'No': 0}

        input_data = np.array([
            float(data['study_hours']),
            float(data['previous_score']),
            float(data['attendance']),
            difficulty_map.get(data['difficulty'], 2),  # Default Medium
            internet_map.get(data['internet'], 1)       # Default Yes
        ]).reshape(1, -1)

        prediction = model.predict(input_data)[0]
        study_recommendations = generate_study_recommendations(prediction, input_data[0])
        risk_info = detect_risk_factors(prediction, input_data[0])
        
        # Return combined results
        return jsonify({
            'predicted_score': float(prediction),
            'study_recommendations': study_recommendations,
            'risk_assessment': risk_info
        })
    except ValueError as ve:
        return jsonify({'error': 'Invalid input values.'}), 400
    except Exception as e:
        return jsonify({'error': 'An error occurred during prediction.'}), 500


if __name__ == '__main__':
    app.run(debug=True)
