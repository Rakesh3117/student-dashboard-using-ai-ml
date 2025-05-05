import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import joblib

# Load CSV data
df = pd.read_csv("student_performance_data.csv")  # Make sure your CSV is named this way

df.columns = df.columns.str.lower()

# Rename columns to match model-friendly names
df.rename(columns={
    'study hours': 'study_hours',
    'previous score': 'previous_score',
    'attendance %': 'attendance',
    'difficulty': 'difficulty',
    'internet': 'internet'
}, inplace=True)

# Encode categorical fields (like Internet, Difficulty)
df['internet'] = df['internet'].map({'Yes': 1, 'No': 0})
df['difficulty'] = df['difficulty'].map({'Easy': 1, 'Medium': 2, 'Hard': 3})

# Features and target
X = df[['study_hours', 'previous_score', 'attendance', 'difficulty', 'internet']]
y = df['Predicted Score']

# Train-test split and model training
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LinearRegression()
model.fit(X_train, y_train)

# Save model and features
joblib.dump(model, 'student_performance_model.joblib')
joblib.dump(X.columns.tolist(), 'model_features.joblib')

print("✅ Model trained and saved.")
