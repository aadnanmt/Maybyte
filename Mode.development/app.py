# Developernya fokus bikin projek lain, ga sempet buat COMMENT-nya. Kalau ada waktu aja, oteyyyy.

from flask import Flask, jsonify, render_template
from flask_cors import CORS

import psutil

def format_bytes(byte_size):
    power = 1024 ** 3
    gb = byte_size / power
    
    return f"{gb:.2f}"

app = Flask(__name__)

CORS(app)

@app.route('/')
def dashboard():

    return render_template('index.html')

@app.route('/mwehehe')
def get_stats():
    try:
        cpu_percent = psutil.cpu_percent(interval=None)
        cpu_cores = psutil.cpu_count(logical=False)
        cpu_threads= psutil.cpu_count(logical=True)
        
        try:
            cpu_ghz = psutil.cpu_freq().current / 1000
        except:
            cpu_ghz = 0.0

        ram = psutil.virtual_memory()
        disk = psutil.disk_usage('/')

        stats = {
            'cpu_percent': cpu_percent,
            'ram_percent': ram.percent,
            'disk_percent': disk.percent,

            'cpu_details': {
                'cores': cpu_cores,
                'threads': cpu_threads,
                'speed': f"{cpu_ghz:.2f}" 
            },

            'ram_details': {
                'used': format_bytes(ram.used),
                'total': format_bytes(ram.total)
            },
            'disk_details': {
                'used': format_bytes(disk.used),
                'total': format_bytes(disk.total)
            }
        }
        
        return jsonify(stats)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5100, debug=True)

# app.py | SOURCE CODE-NYA TAMAT
