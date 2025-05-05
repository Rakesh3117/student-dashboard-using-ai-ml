# Student Performance Predictor

A comprehensive analytics platform to track, analyze, and predict student performance. This application allows educators to upload student data, visualize performance metrics, and utilize machine learning to predict future academic outcomes.

## Features

- File upload system for CSV/Excel data with validation and processing
- Dynamic dashboard with overall class performance metrics and trends
- Individual student performance tracker with detailed analytics
- Performance prediction engine with accuracy metrics
- Data visualization with interactive charts and graphs
- Comparative analysis tools (student vs. class average)
- Export functionality for reports and visualizations
- Responsive design optimized for all devices

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Chart.js
- **Backend**: Flask, Pandas, Scikit-learn

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- pip

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/student-performance-predictor.git
cd student-performance-predictor
```

2. Install frontend dependencies:
```
npm install
```

3. Install backend dependencies:
```
cd backend
pip install -r requirements.txt
cd ..
```

### Running the Application

1. Start both frontend and backend:
```
npm start
```

This will concurrently run:
- Frontend: Vite dev server on http://localhost:5173
- Backend: Flask API on http://localhost:5000

### Usage

1. Navigate to the Upload Data page
2. Upload a CSV/Excel file with student data or generate random data
3. Explore the dashboard, class performance, and individual student metrics
4. Check predictions and export data as needed

## Data Format

For optimal results, your data file should include:
- Student ID
- Name
- Subject scores
- Attendance data (optional)
- Previous performance metrics (optional)

## License

MIT