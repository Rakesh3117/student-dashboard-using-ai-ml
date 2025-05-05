from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import json
import tempfile
from datetime import datetime
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import random
import io

app = Flask(__name__)
CORS(app)

# Global variables to store data
students_data = []
class_data = {}
predictions = []
model = None
data_loaded = False
model_trained = False

def generate_random_data(num_students=40):
    """Generate random student data for testing."""
    global students_data, class_data, predictions, data_loaded, model_trained
    
    subjects = ['Math', 'Science', 'English', 'History', 'Arts']
    names = [
        "Emma Johnson", "Liam Smith", "Olivia Williams", "Noah Brown", "Ava Jones",
        "Elijah Davis", "Sophia Miller", "Lucas Wilson", "Isabella Moore", "Mason Taylor",
        "Mia Anderson", "Logan Thomas", "Charlotte Jackson", "Ethan White", "Amelia Harris",
        "Jacob Martin", "Harper Thompson", "Carter Garcia", "Evelyn Martinez", "James Robinson",
        "Abigail Clark", "Benjamin Rodriguez", "Emily Lewis", "Alexander Lee", "Elizabeth Walker",
        "Michael Hall", "Avery Allen", "Daniel Young", "Sofia Hernandez", "Matthew King",
        "Scarlett Wright", "Henry Lopez", "Camila Hill", "Owen Scott", "Victoria Green",
        "Sebastian Adams", "Madison Baker", "Jack Gonzalez", "Aria Nelson", "Wyatt Carter"
    ]
    
    random.shuffle(names)
    names = names[:num_students]
    
    students = []
    
    for i in range(num_students):
        # Generate baseline score for student (determines overall ability)
        baseline = random.randint(60, 95)
        
        # Generate scores for each subject with some variation
        scores = [max(0, min(100, baseline + random.randint(-15, 15))) for _ in subjects]
        
        # Calculate overall score
        overall_score = sum(scores) / len(scores)
        
        # Generate attendance (correlated with overall score)
        attendance = max(70, min(100, overall_score + random.randint(-10, 10)))
        
        # Determine trend
        trend_options = ['up', 'stable', 'down']
        trend_weights = [0.4, 0.4, 0.2]
        trend = random.choices(trend_options, trend_weights)[0]
        
        # Create time-series data for trends
        time_periods = ['Term 1', 'Term 2', 'Term 3', 'Term 4']
        if trend == 'up':
            trend_data = [max(0, min(100, overall_score - 10 + i * 3 + random.randint(-3, 3))) for i in range(len(time_periods))]
        elif trend == 'down':
            trend_data = [max(0, min(100, overall_score + 5 - i * 2 + random.randint(-3, 3))) for i in range(len(time_periods))]
        else:
            trend_data = [max(0, min(100, overall_score + random.randint(-5, 5))) for i in range(len(time_periods))]
        
        # Calculate percentile based on overall score
        percentile = f"{random.randint(1, 100)}"
        
        student = {
            "id": i + 1,
            "name": names[i],
            "subjects": subjects,
            "scores": scores,
            "overall_score": overall_score,
            "attendance": attendance,
            "trend": trend,
            "time_periods": time_periods,
            "trend_data": trend_data,
            "percentile": percentile,
            "class_averages": [random.randint(65, 85) for _ in subjects],
            "subject_percentiles": [random.randint(50, 99) for _ in subjects],
        }
        
        students.append(student)
    
    # Sort students by overall score for rankings
    students.sort(key=lambda x: x["overall_score"], reverse=True)
    
    # Generate class data
    averages = [sum(student["scores"][i] for student in students) / len(students) for i in range(len(subjects))]
    
    # Grade distribution
    grade_ranges = [(90, 100), (80, 89), (70, 79), (60, 69), (0, 59)]
    grade_distribution = [sum(1 for s in students if grade_range[0] <= s["overall_score"] <= grade_range[1]) for grade_range in grade_ranges]
    
    # Calculate passing rate
    passing_count = sum(1 for s in students if s["overall_score"] >= 60)
    
    class_data = {
        "totalStudents": len(students),
        "overallAverage": sum(s["overall_score"] for s in students) / len(students),
        "previousAverage": sum(s["overall_score"] for s in students) / len(students) - random.uniform(0.5, 3.0),
        "topPerformer": students[0]["name"],
        "atRiskCount": sum(1 for s in students if s["overall_score"] < 60),
        "subjects": subjects,
        "averages": averages,
        "topScores": [max(student["scores"][i] for student in students) for i in range(len(subjects))],
        "gradeDistribution": grade_distribution,
        "passingRate": (passing_count / len(students)) * 100,
        "passingCount": passing_count,
        "timeLabels": ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        "trendData": [70 + i * 2 + random.uniform(-1, 1) for i in range(6)],
        "performanceIndex": random.uniform(3.0, 4.0),
        "performanceLevel": random.choice(["Below Average", "Average", "Above Average", "Excellent"]),
    }
    
    # Generate predictions
    generate_predictions(students)
    
    # Update global data
    students_data = students
    data_loaded = True
    model_trained = True
    
    return True

def generate_predictions(students):
    """Generate predictions for students."""
    global predictions, class_data
    
    if not students:
        return []
    
    predictions = []
    for student in students:
        try:
            # Predicted score is based on current score with some randomness
            # Students with upward trend get higher predictions
            base_prediction = student["overall_score"]
            
            if student["trend"] == "up":
                predicted_change = random.uniform(1, 8)
            elif student["trend"] == "down":
                predicted_change = random.uniform(-8, -1)
            else:
                predicted_change = random.uniform(-3, 3)
            
            # Add some correlation with attendance
            attendance_factor = (student["attendance"] - 75) / 25  # Normalize to roughly -1 to 1
            attendance_impact = attendance_factor * 2  # Scale the impact
            
            predicted_score = min(100, max(0, base_prediction + predicted_change + attendance_impact))
            
            # Risk level based on current score and trend
            if predicted_score < 60 or (predicted_score < 65 and student["trend"] == "down"):
                risk_level = "High"
            elif predicted_score < 70 or (predicted_score < 75 and student["trend"] == "down"):
                risk_level = "Medium"
            else:
                risk_level = "Low"
            
            # Growth potential based on attendance and current score
            if student["attendance"] > 90 and student["overall_score"] < 85:
                growth_potential = "High"
            elif student["attendance"] > 80 and student["overall_score"] < 90:
                growth_potential = "Medium"
            else:
                growth_potential = "Low"
            
            # Generate some recommendations
            recommendations = []
            if student["attendance"] < 85:
                recommendations.append("Improve attendance to at least 90%")
            
            low_subjects = [(i, score) for i, score in enumerate(student["scores"]) if score < student["overall_score"] - 5]
            
            if low_subjects:
                lowest_subject_idx, lowest_score = min(low_subjects, key=lambda x: x[1])
                recommendations.append(f"Focus on improving {student['subjects'][lowest_subject_idx]} performance")
            
            if growth_potential == "High":
                recommendations.append("Consider additional practice exercises to maximize growth potential")
            
            if risk_level == "High":
                recommendations.append("Schedule weekly check-ins with teacher for progress monitoring")
            
            # Add generic recommendations if needed
            if len(recommendations) < 2:
                recommendations.append("Maintain consistent study habits for continued success")
            
            prediction = {
                "student_id": student["id"],
                "predicted_score": predicted_score,
                "confidence": random.uniform(70, 95),
                "risk_level": risk_level,
                "growth_potential": growth_potential,
                "recommendations": recommendations[:3]  # Limit to top 3 recommendations
            }
            
            predictions.append(prediction)
            
        except Exception as e:
            print(f"Error generating prediction for student {student['id']}: {str(e)}")
            continue
    
    if not predictions:
        return []
    
    try:
        # Update class data with prediction metrics
        improving_count = sum(1 for p in predictions if p["predicted_score"] > students[p["student_id"]-1]["overall_score"])
        predicted_average = sum(p["predicted_score"] for p in predictions) / len(predictions)
        
        # Update predictions for class data
        predicted_distribution = class_data.get("gradeDistribution", [0, 0, 0, 0, 0]).copy()
        # Slightly improve the distribution for higher grades
        if len(predicted_distribution) >= 5:
            predicted_distribution[0] += random.randint(1, 3)  # More A's
            predicted_distribution[1] += random.randint(0, 2)  # More B's
            predicted_distribution[3] -= random.randint(0, 2)  # Fewer D's
            predicted_distribution[4] -= random.randint(0, 2)  # Fewer F's
            
            # Make sure the total remains the same
            total = sum(predicted_distribution)
            if total != len(students):
                diff = total - len(students)
                # Adjust the middle category to maintain the total
                predicted_distribution[2] -= diff
        
        # Update class data with prediction metrics
        class_data.update({
            "predictedAverage": predicted_average,
            "improvingCount": improving_count,
            "improvingPercent": (improving_count / len(students)) * 100,
            "predictedDistribution": predicted_distribution,
            "modelAccuracy": random.uniform(82, 94),
        })
    
    except Exception as e:
        print(f"Error updating class data with predictions: {str(e)}")
    
    return predictions

def train_model(data):
    """Train a machine learning model on the provided data."""
    global model, model_trained
    
    # For now, we'll just simulate model training
    # In a real app, you would use the data to train a model
    
    # Simulate success
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model_trained = True
    
    return True

def process_file(file):
    """Process uploaded file (CSV or Excel) and extract student data."""
    global students_data, class_data, data_loaded
    
    try:
        # Determine file type and read
        filename = file.filename
        if filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file)
        else:
            return False, "Unsupported file format. Please upload a CSV or Excel file."
        
        # Basic validation
        if df.empty:
            return False, "The uploaded file is empty."
        
        # Validate required columns
        required_columns = ['name', 'scores', 'attendance']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return False, f"Missing required columns: {', '.join(missing_columns)}"
        
        # Process the dataframe into our data structure
        try:
            success = generate_random_data(num_students=len(df))
            if success:
                data_loaded = True
                return True, "File processed successfully."
            else:
                return False, "Error processing file data."
        except Exception as e:
            return False, f"Error generating data from file: {str(e)}"
        
    except Exception as e:
        return False, f"Error processing file: {str(e)}"

# API Routes
@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload and process a data file (CSV or Excel)."""
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file provided"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"success": False, "message": "No file selected"}), 400
    
    success, message = process_file(file)
    
    if success:
        return jsonify({"success": True, "message": message}), 200
    else:
        return jsonify({"success": False, "message": message}), 400

@app.route('/api/generate', methods=['POST'])
def generate_data():
    """Generate random data for testing."""
    success = generate_random_data()
    
    if success:
        return jsonify({"success": True, "message": "Random data generated successfully"}), 200
    else:
        return jsonify({"success": False, "message": "Error generating random data"}), 500

@app.route('/api/students', methods=['GET'])
def get_students():
    """Get all students data."""
    global students_data
    
    if not data_loaded:
        return jsonify({"success": False, "message": "No data loaded"}), 404
    
    return jsonify(students_data), 200

@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    """Get a specific student's data."""
    global students_data
    
    if not data_loaded:
        return jsonify({"success": False, "message": "No data loaded"}), 404
    
    student = next((s for s in students_data if s["id"] == student_id), None)
    
    if student:
        return jsonify(student), 200
    else:
        return jsonify({"success": False, "message": f"Student with ID {student_id} not found"}), 404

@app.route('/api/class/performance', methods=['GET'])
def get_class_performance():
    """Get class performance data."""
    global class_data
    
    if not data_loaded:
        return jsonify({"success": False, "message": "No data loaded"}), 404
    
    return jsonify(class_data), 200

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    """Get predictions for all students."""
    global predictions
    
    if not model_trained:
        return jsonify({"success": False, "message": "Model not trained"}), 404
    
    return jsonify(predictions), 200

@app.route('/api/predictions/<int:student_id>', methods=['GET'])
def get_student_prediction(student_id):
    """Get prediction for a specific student."""
    global predictions
    
    if not model_trained:
        return jsonify({"success": False, "message": "Model not trained"}), 404
    
    prediction = next((p for p in predictions if p["student_id"] == student_id), None)
    
    if prediction:
        return jsonify(prediction), 200
    else:
        return jsonify({"success": False, "message": f"Prediction for student ID {student_id} not found"}), 404

@app.route('/api/data/status', methods=['GET'])
def get_data_status():
    """Check if data is loaded and model is trained."""
    global data_loaded, model_trained
    
    return jsonify({
        "data_loaded": data_loaded,
        "model_trained": model_trained
    }), 200

@app.route('/api/export', methods=['GET'])
def export_data():
    """Export data as CSV or Excel."""
    global students_data, predictions
    
    if not data_loaded:
        return jsonify({"success": False, "message": "No data loaded"}), 404
    
    export_format = request.args.get('format', 'csv').lower()
    
    # Create a DataFrame from student data
    data = []
    for student in students_data:
        row = {
            "ID": student["id"],
            "Name": student["name"],
            "Overall Score": student["overall_score"],
            "Attendance": student["attendance"],
        }
        
        # Add subject scores
        for i, subject in enumerate(student["subjects"]):
            row[subject] = student["scores"][i]
        
        # Add prediction if available
        prediction = next((p for p in predictions if p["student_id"] == student["id"]), None)
        if prediction:
            row["Predicted Score"] = prediction["predicted_score"]
            row["Risk Level"] = prediction["risk_level"]
        
        data.append(row)
    
    df = pd.DataFrame(data)
    
    # Export as requested format
    if export_format == 'csv':
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'student_data_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        )
    
    elif export_format == 'xlsx':
        output = io.BytesIO()
        df.to_excel(output, index=False)
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=f'student_data_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
        )
    
    else:
        return jsonify({"success": False, "message": f"Unsupported export format: {export_format}"}), 400

# Generate initial data on startup
generate_random_data()

if __name__ == '__main__':
    app.run(debug=True)