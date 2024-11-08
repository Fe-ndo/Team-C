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
    collectionRef = db.collection('userProfile').document("MtaHYe1QBQWafWOzlZaZvdh0RoA2")
    doc = collectionRef.get()
    dic = doc.to_dict()
    return dic

@app.route("/api/balance/update", methods=["POST"])
def updateBalance():
    new_balance = request.json.get("balance")
    if new_balance is None:
        return {"error": "No balance provided"}, 400

    collectionRef = db.collection('userProfile').document("MtaHYe1QBQWafWOzlZaZvdh0RoA2")
    collectionRef.update({"balance": new_balance})

    return {"success": True, "balance": new_balance}, 200


@app.route("/api/calorie", methods = ["POST"])
def calorie():
    calorie_entry = request.json
    collectionRef=db.collection('userProfile').document("MtaHYe1QBQWafWOzlZaZvdh0RoA2")
    collectionRef.update(calorie_entry)
    return {"Success": True}, 200

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

@app.route("/api/calorie", methods=["POST,GET,PUT,DELETE"])
def calorie():
    print("Hello World!")
    return

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
