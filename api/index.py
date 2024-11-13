from flask import Flask, request, jsonify
import flask
from flask_cors import CORS
import firebase_admin
from firebase_admin import app_check, firestore, credentials
import jwt

app = Flask(__name__)
CORS(app) 

cred = credentials.Certificate("api/firebase.json")
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


@app.route("/api/calorie", methods = ["POST"])
def calorie():
    uid = request.args.get("uid")
    if not uid:
        return {"error":"uid is required"},400
    calorie_entry = request.json
    collectionRef=db.collection('userProfile').document(uid)
    try:
        data = request.json
        entries = data.get('entry', [])
        formatted_date = data.get('formattedDate')

        if not entries or not formatted_date:
            return jsonify({"error": "Missing required fields"}), 400
        
        doc_ref = collectionRef.document(formatted_date)
        doc = doc_ref.get()

        existing_entries = []
        total_calories = 0

        if doc.exists:
            current_data = doc.to_dict()
            existing_entries = current_data.get('entries', [])
            total_calories = sum(entry['calories'] for entry in existing_entries)

        for entry in entries:
            food = entry.get('food')
            amount = entry.get('amount')
            unit = entry.get('unit')
            calories = entry.get('calories')

            if not all([food, amount, unit, calories]):
                return jsonify({"error": "Invalid entry format"}), 400

            new_entry = {
                "food": food,
                "amount": amount,
                "unit": unit,
                "calories": calories
            }
            existing_entries.append(new_entry)
            total_calories += calories

        doc_ref.set({
            "date": formatted_date,
            "entries": existing_entries,
            "totalCalories": total_calories
        }, merge=True)

        return jsonify({
            "message": "Entries added successfully",
            "entries": entries,
            "totalCalories": total_calories
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while adding the entries"}), 500
    
@app.route("/api/calorie/fetch", methods=["GET"])
def fetch_calories():
    uid = request.args.get("uid")
    formatted_date = request.args.get("formattedDate")

    if not uid or not formatted_date:
        return {"error": "uid and formattedDate are required"}, 400

    doc_ref = db.collection("userProfile").document(uid).collection("calorie_entries").document(formatted_date)
    doc = doc_ref.get()

    if doc.exists:
        return jsonify(doc.to_dict()), 200
    else:
        return jsonify({"entries": [], "totalCalories": 0}), 200

@app.route("/api/profile", methods = ["POST,GET,PUT,DELETE"])
def profile():
    if request.method == 'GET':
        return
    if request.method == 'POST':
        return
    if request.method == 'PUT':
        return
    if request.method == 'DELETE':
        return
    return

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

# Make the app compatible with Vercel by exposing app as a callable
def handler(environ, start_response):
    return app(environ, start_response)

# Run the app locally
if __name__ == "__main__":
    app.run(debug=True)
