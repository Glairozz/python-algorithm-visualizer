# Premium Algorithm Visualizer 🚀

A professional, educational algorithm visualization system built with Python that demonstrates how algorithms operate step-by-step using visual representations.

## ✨ Features

- **🎯 Step-by-Step Visualization**: Watch algorithms execute in real-time with detailed explanations
- **🎮 Full Playback Control**: Play, pause, step forward/backward, reset, and adjust speed
- **📚 Educational Content**: Comprehensive explanations for each algorithm and operation
- **🌐 Dual Interface**: Both console and web-based interfaces
- **🧪 Professional Architecture**: Strict layered separation for maintainability and extensibility
- **✅ Thoroughly Tested**: Comprehensive test suite ensures correctness and reliability
- **🎨 Modern UI**: Clean, responsive web interface with smooth animations

## 🏗️ Architecture

This project follows a strict layered architecture:

### **Algorithm Logic Layer** (`algorithms/`)
- Pure algorithm implementations focused on observability
- Bubble Sort, Quick Sort, Merge Sort included
- Easy to extend with additional algorithms

### **Step Abstraction Layer** (`core/`)
- Converts algorithm operations into standardized steps
- Step types: Compare, Swap, Overwrite, Mark Sorted, Highlight, Pivot, Merge
- Timeline system for step sequencing and navigation

### **Visualization Engine** (`visualization/`)
- Timeline-based rendering engine
- Playback controller with speed control
- Multiple renderer support (Console, Web)

### **User Interface Layer** (`web/`)
- Flask web application with modern frontend
- Console interface for terminal users
- Educational explanations and complexity analysis

## 🚀 Quick Start

### **Prerequisites**
- Python 3.7 or higher
- pip package manager

### **Installation**

1. **Clone or navigate to the project directory:**
   ```bash
   cd "C:\Downloads\html,css,&js projects\Algorithm visualizer web\algorithm_visualizer"
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### **Running the Application**

#### **Option 1: Web Interface (Recommended)**
```bash
cd "C:\Downloads\html,css,&js projects\Algorithm visualizer web"
python run_web.py
```
Then open your browser and navigate to: **http://localhost:5000**

#### **Option 2: Console Interface**
```bash
cd algorithm_visualizer
python -m algorithm_visualizer
```

## 📖 Usage Guide

### **Web Interface**

1. **Select Algorithm**: Choose from Bubble Sort, Quick Sort, or Merge Sort
2. **Configure Input**: Set array size (5-30 elements) using the slider
3. **Generate Array**: Click "Generate Array" to create random data
4. **Execute**: Click "Execute" to run the selected algorithm
5. **Control Playback**: 
   - Play/Pause: Start or stop automatic playback
   - Step Controls: Navigate forward/backward one step at a time
   - Speed Control: Adjust playback speed (0.1x to 3.0x)
   - Reset: Return to the initial state

### **Console Interface**

1. **Select Algorithm**: Choose from the numbered menu (1-3)
2. **Set Array Size**: Enter desired size (5-20, default: 10)
3. **Interactive Commands**:
   ```
   play      - Start automatic playback
   pause     - Pause playback
   step      - Move one step forward
   back      - Move one step backward
   reset     - Reset to beginning
   speed 2.0 - Set playback speed
   quit      - Exit the program
   ```

### **Visual Indicators**

- 🟢 **Green**: Sorted elements (final position)
- 🔵 **Blue**: Currently highlighted regions
- 🟠 **Orange**: Elements being compared
- 🟣 **Purple**: Pivot element (Quick Sort)
- ⚪ **White**: Unsorted/inactive elements

## 🧪 Testing

Run the comprehensive test suite:

```bash
cd algorithm_visualizer
python -m pytest tests/ -v
```

Tests cover:
- Algorithm correctness verification
- Step sequence validation  
- Timeline navigation functionality
- Core component behavior

## 📊 Supported Algorithms

| Algorithm | Best Time | Average Time | Worst Time | Space | Stable |
|-----------|-----------|--------------|------------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |

## 🔧 Development

### **Adding New Algorithms**

1. Create a new class in `algorithms/` inheriting from `BaseAlgorithm`
2. Implement the `execute()` method returning a `Timeline`
3. Add standardized steps using the `Step` class
4. Register the algorithm in the Flask app (`web/flask_app.py`)

### **Step Types**

```python
Step.compare(i, j, explanation)        # Compare elements
Step.swap(i, j, explanation)           # Swap elements
Step.overwrite(i, value, explanation)  # Set element value
Step.mark_sorted([i, j], explanation)  # Mark as sorted
Step.highlight([i, j], explanation)    # Highlight region
Step.pivot(i, explanation)             # Mark pivot
Step.merge(range1, range2, explanation) # Merge ranges
```

### **Project Structure**

```
algorithm_visualizer/
├── core/                 # Step abstraction and timeline
│   ├── step.py          # Step definitions
│   ├── timeline.py      # Timeline management
│   ├── array_state.py   # Array state tracking
│   └── explanations.py  # Educational content
├── algorithms/          # Algorithm implementations
│   ├── base_algorithm.py
│   ├── bubble_sort.py
│   ├── quick_sort.py
│   └── merge_sort.py
├── visualization/       # Rendering and playback
│   ├── engine.py        # Visualization engine
│   ├── renderer.py      # Renderer implementations
│   └── controller.py    # Playback controls
├── web/                # Web interface
│   ├── flask_app.py    # Flask backend
│   ├── templates/      # HTML templates
│   ├── static/         # CSS/JS assets
│   └── app.py          # Console interface
└── tests/              # Test suite
    ├── test_algorithms.py
    └── test_core.py
```

## 🎯 Educational Features

- **Step-by-Step Explanations**: Each operation includes contextual explanations
- **Complexity Analysis**: Detailed time and space complexity information
- **Algorithm Overviews**: High-level strategy and use case explanations
- **Interactive Learning**: Control execution speed and examine each step

## 🌟 Premium Features

- **Professional UI**: Modern, responsive design with smooth animations
- **Extensible Architecture**: Easy to add new algorithms and visualizers
- **Performance Optimized**: Smooth playback even for larger arrays
- **Educational Focus**: Designed as a learning platform, not just a demo
- **Production Ready**: Thoroughly tested and professionally structured

## 🤝 Contributing

This project demonstrates senior-level software engineering principles:

1. **Clean Architecture**: Strict separation of concerns
2. **Extensibility**: Modular design for easy enhancement
3. **Testing**: Comprehensive test coverage
4. **Documentation**: Clear, educational explanations
5. **User Experience**: Thoughtful interface design

## 📄 License

This project is open-source and available for educational purposes. Feel free to use it as a reference for learning algorithms, software architecture, or web development.

---

**Built with ❤️ for educational excellence**