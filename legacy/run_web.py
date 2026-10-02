#!/usr/bin/env python3

import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from algorithm_visualizer.web.flask_app import app

if __name__ == "__main__":
    print("Starting Premium Algorithm Visualizer Web Server...")
    print("Visit http://localhost:5000 to access the visualizer")
    app.run(debug=True, host='0.0.0.0', port=5000)