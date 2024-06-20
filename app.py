from flask import Flask, render_template, send_from_directory
import subprocess
import signal
import os

app = Flask(__name__, static_folder=".", static_url_path="")

process = None


# Route for serving the main HTML page
@app.route("/")
def index():
    return send_from_directory(".", "index.html")


# Route for serving CSS files
@app.route("/style.css")
def serve_css():
    return send_from_directory(".", "style.css")


# Route for serving JS files
@app.route("/script.js")
def serve_js():
    return send_from_directory(".", "script.js")


# Route for serving assets
@app.route("/assets/<path:path>")
def serve_assets(path):
    return send_from_directory("assets", path)


@app.route("/start-virtual-mouse", methods=["POST"])
def start_virtual_mouse():
    global process
    if not process:
        process = subprocess.Popen(["python", "virtual_mouse.py"])
    return "Virtual mouse started", 200


@app.route("/stop-virtual-mouse", methods=["POST"])
def stop_virtual_mouse():
    global process
    if process:
        os.kill(process.pid, signal.SIGTERM)
        process = None
    return "Virtual mouse stopped", 200


if __name__ == "__main__":
    app.run(debug=True)
