from flask import Flask, request, jsonify
import flask
from flask_cors import CORS
import firebase_admin
from google.cloud.firestore_v1.base_query import FieldFilter
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

## Route for calorie tracker
@app.route("/api/calorie", methods = ["POST"])
def calorie():
    uid = request.args.get("uid")
    if not uid:
        return {"error":"uid is required"}
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

# Route to get 
@app.route("/api/search", methods=["GET"])
def search():
    try:
        queryWord = request.args.get("query")
        docs = db.collection("workouts").stream()
        result = []
        for doc in docs:
            doc_data = doc.to_dict()
            if queryWord in doc_data.get('name', '').lower():
                result.append(doc_data)

        return jsonify(result),200
    except Exception as e:
        return jsonify({"error":str(e)}), 500



@app.route("/api/workouts", methods=["GET"])
def getAll():
    try:
        # query = request.args.get("search")
        docs = db.collection("workouts").stream()
        result = []
        for doc in docs:
            docData = doc.to_dict()
            result.append(docData)
        return jsonify(result),200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

## Redirects on login page after login/signup to the landing page [DONE]
# Keep auth state across all pages
## Finish table, allow pagination and filtering
# merge code together
# protected routes 
# save trackers and profile data into the database
# launch on vercel/frontend and host api


# Vercel compatability func
def handler(environ, start_response):
    return app(environ, start_response)

# Run the app locally
if __name__ == "__main__":
    app.run(debug=True)
