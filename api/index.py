from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from your React front-end

# Mock user data for demonstration purposes
USERS = {"user": "pass"}
TOKEN = "mock_token"  # In a real app, use JWTs or another secure token method

# Login endpoint
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    
    # Check if credentials match mock data
    if USERS.get(username) == password:
        # Return a mock token on successful login
        return jsonify({"status": "success", "message": "Login successful", "token": TOKEN}), 200
    else:
        return jsonify({"status": "fail", "message": "Invalid credentials"}), 401

# Protected profile endpoint
@app.route("/api/profile", methods=["GET"])
def profile():
    auth_header = request.headers.get("Authorization")
    
    # Verify if the token in Authorization header is correct
    if auth_header == f"Bearer {TOKEN}":
        return jsonify({"status": "success", "profile": {"name": "John Doe", "age": 30}}), 200
    else:
        return jsonify({"status": "fail", "message": "Unauthorized"}), 401

# Make the app compatible with Vercel by exposing app as a callable
def handler(environ, start_response):
    return app(environ, start_response)

# Run the app locally
if __name__ == "__main__":
    app.run(debug=True)
