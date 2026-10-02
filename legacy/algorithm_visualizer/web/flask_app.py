from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import random
from ..algorithms import BubbleSort, QuickSort, MergeSort
from ..core.explanations import ExplanationEngine


app = Flask(__name__, 
           template_folder='templates',
           static_folder='static')
CORS(app)

# Initialize algorithms and explanation engine
algorithms = {
    'bubble': BubbleSort(),
    'quick': QuickSort(),
    'merge': MergeSort()
}
explanation_engine = ExplanationEngine()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/algorithms')
def get_algorithms():
    """Get list of available algorithms with their info"""
    result = {}
    for key, algorithm in algorithms.items():
        info = algorithm.get_info()
        result[key] = {
            **info,
            'overview': explanation_engine.get_algorithm_overview(key),
            'complexity_explanation': explanation_engine.get_complexity_explanation(
                info['complexity']
            )
        }
    return jsonify(result)


@app.route('/api/execute', methods=['POST'])
def execute_algorithm():
    """Execute an algorithm and return timeline data"""
    data = request.get_json()
    
    algorithm_name = data.get('algorithm')
    array_input = data.get('array', [])
    
    if algorithm_name not in algorithms:
        return jsonify({'error': 'Algorithm not found'}), 400
    
    if not array_input:
        array_input = [random.randint(1, 99) for _ in range(10)]
    
    algorithm = algorithms[algorithm_name]
    timeline = algorithm.execute(array_input)
    
    # Convert timeline to JSON-serializable format
    timeline_data = {
        'initial_array': timeline.initial_array,
        'steps': [],
        'array_states': []
    }
    
    for step in timeline.steps:
        step_data = {
            'type': step.type.value,
            'indices': step.indices,
            'values': step.values,
            'explanation': step.explanation or explanation_engine.get_step_explanation(
                step, algorithm_name
            ),
            'metadata': step.metadata
        }
        timeline_data['steps'].append(step_data)
    
    for state in timeline.array_states:
        state_data = {
            'values': state.values,
            'sorted_indices': state.sorted_indices,
            'highlighted_indices': state.highlighted_indices,
            'pivot_index': state.pivot_index,
            'comparing_indices': state.comparing_indices
        }
        timeline_data['array_states'].append(state_data)
    
    return jsonify(timeline_data)


@app.route('/api/generate_array', methods=['POST'])
def generate_array():
    """Generate a random array of specified size"""
    data = request.get_json()
    size = data.get('size', 10)
    size = max(5, min(50, size))  # Limit size for performance
    
    array = [random.randint(1, 99) for _ in range(size)]
    return jsonify({'array': array})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)