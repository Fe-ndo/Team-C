from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import app_check, firestore, credentials
import jwt

app = Flask(__name__)
# Allow CORS for all routes and methods from the specified origin
CORS(app)

cred = credentials.Certificate("./api/firebase.json")
firebase_app = firebase_admin.initialize_app(cred)
db=firestore.client()

# Login endpoint
# @app.before_request
# def verifyToken():
#     app_check_token = flask.request.headers.get("X-Firebase-AppCheck", default = "")
#     try:
#         app_check_claims = app_check.verify_token(app_check)
#     except (ValueError, jwt.exceptions.DecodeError):
#         flask.abort(401)
#     return

@app.route('/')
def home():
    return "Welcome to the Flask API!"
    
@app.route("/api/balance", methods =["GET"])
def balance():
    uid = request.args.get("uid")
    if not uid:
        return {"error":"uid is required"}
    collectionRef = db.collection('userProfile').document(uid)
    doc = collectionRef.get()
    if doc.exists:
        currency = doc.to_dict()
        print(currency)
        return currency

@app.route("/api/balance/update", methods=["POST"])
def updateBalance():
    uid = request.args.get("uid")
    if not uid:
        return {"error":"uid is required"}
    new_balance = request.json.get("currency")
    if new_balance is None:
        return {"error": "No balance provided"}, 400

    collectionRef = db.collection('userProfile').document(uid)
    collectionRef.update({'currency': new_balance})

    return {"success": True, "currency": new_balance}, 200

def get_user_profile(user_id):
    try:
        # Reference to the user profile document
        user_ref = db.collection('userProfile').document(user_id)
        doc = user_ref.get()

        if doc.exists:
            user_data = doc.to_dict()
            return user_data  # Return the user data if document exists
        else:
            return None  # If document does not exist
    except Exception as e:
        print("Error getting user profile:", e)
        return None

@app.route('/userProfile', methods=['GET'])
def user_profile():
    user_id = request.args.get('user_id')  # Get the user ID from query params
    if user_id:
        user_data = get_user_profile(user_id)
        if user_data:
            return jsonify(user_data)  # Return the profile data as JSON
        else:
            return jsonify({"error": "User not found"}), 404
    else:
        return jsonify({"error": "User ID is required"}), 400



#CalorieTracker 
@app.route('/calorie_entries/<user_id>/<date>',methods=['GET'])
def get_calorie_entries(user_id,date):
    try:
        doc_ref = db.collection("userProfile").document(user_id)
        doc=doc_ref.get()

        #Check if the document exists
        if doc.exists:
            data = doc.to_dict()
            #Check if "calorie_entries" exists
            if "calorie_entries" not in data:
                doc_ref.set({"calorie_entries":{}},merge=True)
                return jsonify({"entries":[],"totalCalories":0})
            
            #Get the specific date's data
            calorie_data = data.get("calorie_entries",{}).get(date,{})
            entries = calorie_data.get("entries",[])
            total_calories = calorie_data.get("totalCalories",0)
            return jsonify({"entries":entries,"totalCalories":total_calories})
        else:
            #Create the user document with "calories_entries" if it doesn't exist
            doc_ref.set({"calorie_entries":{}})
            return jsonify({"entries": [], "totalCalories": 0})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/calorie_entries/<user_id>', methods=['POST'])
def add_calorie_entry(user_id):
    try:
        data = request.json
        date = data["date"]
        new_entry = data["entry"]
        new_calories = new_entry["calories"]

        doc_ref = db.collection("userProfile").document(user_id)
        doc = doc_ref.get()

        if doc.exists:
            # Fetch existing data or initialize empty structure
            calorie_data = doc.to_dict().get("calorie_entries", {})
            if date in calorie_data:
                calorie_data[date]["entries"].append(new_entry)
                calorie_data[date]["totalCalories"] += new_calories
            else:
                calorie_data[date] = {"entries": [new_entry], "totalCalories": new_calories}
        else:
            # Initialize calorie_entries structure with the new data
            calorie_data = {date: {"entries": [new_entry], "totalCalories": new_calories}}

        # Update Firestore
        doc_ref.set({"calorie_entries": calorie_data}, merge=True)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# New DELETE endpoint for calorie entries
@app.route('/calorie_entries/<user_id>/<date>/<entry_id>', methods=['DELETE'])
def delete_calorie_entry(user_id, date, entry_id):
    try:
        # Get the user's document
        doc_ref = db.collection("userProfile").document(user_id)
        doc = doc_ref.get()

        if not doc.exists:
            return jsonify({"error": "User not found"}), 404

        # Get current calorie data
        calorie_data = doc.to_dict().get("calorie_entries", {})
        if date not in calorie_data:
            return jsonify({"error": "Date not found"}), 404

        # Filter out the entry to delete
        entries = calorie_data[date].get("entries", [])
        entry_to_delete = next((entry for entry in entries if entry.get("id") == entry_id), None)

        if not entry_to_delete:
            return jsonify({"error": "Entry not found"}), 404

        updated_entries = [entry for entry in entries if entry.get("id") != entry_id]

        # Update total calories
        calorie_data[date]["entries"] = updated_entries
        calorie_data[date]["totalCalories"] = sum(entry.get("calories", 0) for entry in updated_entries)

        # Update Firestore
        doc_ref.set({"calorie_entries": calorie_data}, merge=True)

        return jsonify({"success": True, "message": "Entry deleted successfully"}), 200
    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error deleting calorie entry: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


# Date {
#     excersize1 :{
#         reps: int,
#         weight:int,
#         name: string
#     }
# }

# @app.route("/api/login", methods=["POST"])
# def login():
#     data = request.get_json()
#     username = data.get("username")
#     password = data.get("password")
    
#     # Check if credentials match mock data
#     if USERS.get(username) == password:
#         # Return a mock token on successful login
#         return jsonify({"status": "success", "message": "Login successful", "token": TOKEN}), 200
#     else:
#         return jsonify({"status": "fail", "message": "Invalid credentials"}), 401

# # Protected profile endpoint
# @app.route("/api/profile", methods=["GET"])
# def profile():
#     auth_header = request.headers.get("Authorization")
    
#     # Verify if the token in Authorization header is correct
#     if auth_header == f"Bearer {TOKEN}":
#         return jsonify({"status": "success", "profile": {"name": "John Doe", "age": 30}}), 200
#     else:
#         return jsonify({"status": "fail", "message": "Unauthorized"}), 401

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


# Make the app compatible with Vercel by exposing app as a callable
def handler(environ, start_response):
    return app(environ, start_response)

# Run the app locally
if __name__ == "__main__":
        app.run(host="0.0.0.0", port=5000)