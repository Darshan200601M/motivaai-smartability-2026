from flask import Flask, request, jsonify
from pymongo import MongoClient
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import pickle
import os
import shap
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
MODEL_PATH = 'reward_model.pkl'

# MongoDB Connection
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client['therapy_db']

# Mappings to convert between frontend strings and ML integers
REWARD_NAME_TO_ID = {
    'Cartoon Clip': 0,
    'Indian Folk Dance': 1,
    'Traditional Story': 2,
    'Sticker': 3
}
REWARD_ID_TO_NAME = {v: k for k, v in REWARD_NAME_TO_ID.items()}

DISORDER_MAP = {
    'Speech Delay': 0,
    'ASD': 1,
    'ADHD': 2
}

def train_model(data_df):
    """Trains the Random Forest and saves it."""
    X = data_df[['age', 'disorder_type', 'reward_given']]
    y = data_df['engagement_score']
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    
    global current_model
    current_model = model
    print("Model successfully trained and updated in memory.")

def scheduled_retraining():
    """Runs in the background, pulls data from MongoDB, and retrains."""
    print("Running scheduled data fetch and model retraining...")
    
    students = db.students.find()
    data = []
    
    # Extract all session histories from all students
    for student in students:
        age = student.get('age')
        d_id = DISORDER_MAP.get(student.get('disorderType'), 0)
        
        for session in student.get('sessions', []):
            r_name = session.get('rewardGiven')
            r_id = REWARD_NAME_TO_ID.get(r_name, 0)
            score = session.get('engagementScore', 3)
            
            data.append({
                'age': age,
                'disorder_type': d_id,
                'reward_given': r_id,
                'engagement_score': score
            })
            
    # If the app is brand new and has little data, fallback to synthetic
    if len(data) < 10:
        print("Not enough real DB data. Falling back to synthetic baseline...")
        np.random.seed(42)
        fallback_data = {
            'age': np.random.randint(4, 12, 500),
            'disorder_type': np.random.randint(0, 3, 500),
            'reward_given': np.random.randint(0, 4, 500),
            'engagement_score': np.random.randint(1, 6, 500)
        }
        df = pd.DataFrame(fallback_data)
    else:
        print(f"Retraining on {len(data)} real sessions from MongoDB...")
        df = pd.DataFrame(data)
        
    train_model(df)

# Start the background scheduler
scheduler = BackgroundScheduler()
# Set to 'minutes=5' for testing, switch to 'hours=24' for production
scheduler.add_job(func=scheduled_retraining, trigger="interval", minutes=5)
scheduler.start()

# Load initial model on startup
if not os.path.exists(MODEL_PATH):
    scheduled_retraining()
else:
    with open(MODEL_PATH, 'rb') as f:
        current_model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict_best_reward():
    data = request.json
    age = data.get('age')
    disorder_type_str = data.get('disorderType')
    disorder_encoded = DISORDER_MAP.get(disorder_type_str, 0)
    
    best_reward_id = 0
    highest_score = 0
    
    # 1. Find the best reward
    for reward_id in REWARD_NAME_TO_ID.values():
        features = pd.DataFrame([[age, disorder_encoded, reward_id]], columns=['age', 'disorder_type', 'reward_given'])
        predicted_score = current_model.predict(features)[0]
        
        if predicted_score > highest_score:
            highest_score = predicted_score
            best_reward_id = reward_id

    # 2. Generate SHAP explanation for the WINNING reward
    best_features = pd.DataFrame([[age, disorder_encoded, best_reward_id]], columns=['age', 'disorder_type', 'reward_given'])
    explainer = shap.TreeExplainer(current_model)
    shap_values = explainer.shap_values(best_features)
    
    # Safely extract SHAP values as standard floats for JSON serialization
    base_val = explainer.expected_value
    if isinstance(base_val, np.ndarray):
        base_val = base_val[0]
        
    explanation = {
        "base_score": round(float(base_val), 2),
        "age_impact": round(float(shap_values[0][0]), 2),
        "disorder_impact": round(float(shap_values[0][1]), 2),
        "reward_impact": round(float(shap_values[0][2]), 2)
    }

    
    # Base focus time is 120 seconds (2 mins). 
    # ADHD gets less time before a break. Older kids get more time.
    interval_seconds = 120 
    if disorder_type_str == 'ADHD':
        interval_seconds = 60
    elif disorder_type_str == 'ASD':
        interval_seconds = 90
    
    # Add 15 seconds of focus time for every year of age above 4
    interval_seconds += (age - 4) * 15 

    return jsonify({
        "recommended_reward": REWARD_ID_TO_NAME[best_reward_id],
        "expected_engagement_score": round(highest_score, 2),
        "explanation": explanation,
        "optimal_interval_seconds": interval_seconds # NEW DATA POINT
    })

if __name__ == '__main__':
    # Shutdown scheduler gracefully on exit
    try:
        app.run(port=5000, debug=True, use_reloader=False) 
    finally:
        scheduler.shutdown()


# from flask import Flask, request, jsonify
# import pandas as pd
# import numpy as np
# from sklearn.ensemble import RandomForestRegressor
# import pickle
# import os

# app = Flask(__name__)
# MODEL_PATH = 'reward_model.pkl'

# # Reward mapping for our categories
# REWARD_MAP = {
#     0: 'Cartoon Clip',
#     1: 'Indian Folk Dance',
#     2: 'Traditional Story',
#     3: 'Sticker'
# }
# DISORDER_MAP = {
#     'Speech Delay': 0,
#     'ASD': 1,
#     'ADHD': 2
# }

# def train_initial_model():
#     """Generates synthetic data and trains a base model if one doesn't exist."""
#     print("Training initial ML model...")
#     # Generate 500 rows of synthetic therapy data
#     np.random.seed(42)
#     data = {
#         'age': np.random.randint(4, 12, 500),
#         'disorder_type': np.random.randint(0, 3, 500),
#         'reward_given': np.random.randint(0, 4, 500),
#         # Random engagement score between 1 and 5
#         'engagement_score': np.random.randint(1, 6, 500) 
#     }
#     df = pd.DataFrame(data)
    
#     X = df[['age', 'disorder_type', 'reward_given']]
#     y = df['engagement_score']
    
#     # We use a Regressor to predict the exact score (1-5)
#     model = RandomForestRegressor(n_estimators=100, random_state=42)
#     model.fit(X, y)
    
#     with open(MODEL_PATH, 'wb') as f:
#         pickle.dump(model, f)
#     return model

# # Load or train the model
# if not os.path.exists(MODEL_PATH):
#     model = train_initial_model()
# else:
#     with open(MODEL_PATH, 'rb') as f:
#         model = pickle.load(f)

# @app.route('/predict', methods=['POST'])
# def predict_best_reward():
#     data = request.json
#     age = data.get('age')
#     disorder_type_str = data.get('disorderType')
#     disorder_encoded = DISORDER_MAP.get(disorder_type_str, 0)
    
#     best_reward_id = 0
#     highest_predicted_score = 0
    
#     # The magic: We ask the model to predict the score for ALL 4 rewards
#     # We then pick the one with the highest predicted score.
#     for reward_id in REWARD_MAP.keys():
#         features = np.array([[age, disorder_encoded, reward_id]])
#         predicted_score = model.predict(features)[0]
        
#         if predicted_score > highest_predicted_score:
#             highest_predicted_score = predicted_score
#             best_reward_id = reward_id

#     return jsonify({
#         "recommended_reward": REWARD_MAP[best_reward_id],
#         "expected_engagement_score": round(highest_predicted_score, 2)
#     })

# if __name__ == '__main__':
#     # Runs on port 5000 so it doesn't conflict with Node (3001) or React (5173)
#     app.run(port=5000, debug=True)
