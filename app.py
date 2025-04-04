# app.py
from flask import Flask, request, jsonify
import main  # Make sure this is correctly importing your main.py

app = Flask(__name__)

@app.route('/optimize-task', methods=['POST'])
def optimize_task():
    data = request.get_json()
    response = main.process_task(data)
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
