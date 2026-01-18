class AlgorithmVisualizer {
    constructor() {
        this.algorithms = {};
        this.currentArray = [];
        this.timeline = null;
        this.currentPosition = -1;
        this.isPlaying = false;
        this.playbackSpeed = 1.0;
        this.playbackInterval = null;
        
        this.initializeElements();
        this.loadAlgorithms();
        this.attachEventListeners();
    }
    
    initializeElements() {
        this.elements = {
            algorithmSelect: document.getElementById('algorithm-select'),
            arraySize: document.getElementById('array-size'),
            sizeDisplay: document.getElementById('size-display'),
            generateBtn: document.getElementById('generate-btn'),
            executeBtn: document.getElementById('execute-btn'),
            playBtn: document.getElementById('play-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            stepForwardBtn: document.getElementById('step-forward-btn'),
            stepBackwardBtn: document.getElementById('step-backward-btn'),
            resetBtn: document.getElementById('reset-btn'),
            speedControl: document.getElementById('speed-control'),
            speedDisplay: document.getElementById('speed-display'),
            progressBar: document.getElementById('progress-bar'),
            stepCounter: document.getElementById('step-counter'),
            arrayVisualization: document.getElementById('array-visualization'),
            algorithmName: document.getElementById('algorithm-name'),
            algorithmDescription: document.getElementById('algorithm-description'),
            algorithmComplexity: document.getElementById('algorithm-complexity'),
            stepExplanationText: document.getElementById('step-explanation-text'),
            currentArray: document.getElementById('current-array')
        };
    }
    
    async loadAlgorithms() {
        try {
            const response = await fetch('/api/algorithms');
            this.algorithms = await response.json();
            
            // Populate algorithm select
            Object.entries(this.algorithms).forEach(([key, info]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = info.name;
                this.elements.algorithmSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to load algorithms:', error);
        }
    }
    
    attachEventListeners() {
        this.elements.arraySize.addEventListener('input', (e) => {
            this.elements.sizeDisplay.textContent = e.target.value;
        });
        
        this.elements.speedControl.addEventListener('input', (e) => {
            this.playbackSpeed = parseFloat(e.target.value);
            this.elements.speedDisplay.textContent = `${this.playbackSpeed}x`;
        });
        
        this.elements.generateBtn.addEventListener('click', () => this.generateArray());
        this.elements.executeBtn.addEventListener('click', () => this.executeAlgorithm());
        this.elements.playBtn.addEventListener('click', () => this.play());
        this.elements.pauseBtn.addEventListener('click', () => this.pause());
        this.elements.stepForwardBtn.addEventListener('click', () => this.stepForward());
        this.elements.stepBackwardBtn.addEventListener('click', () => this.stepBackward());
        this.elements.resetBtn.addEventListener('click', () => this.reset());
        
        this.elements.algorithmSelect.addEventListener('change', (e) => {
            this.updateAlgorithmInfo(e.target.value);
        });
    }
    
    async generateArray() {
        const size = parseInt(this.elements.arraySize.value);
        try {
            const response = await fetch('/api/generate_array', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ size })
            });
            const data = await response.json();
            this.currentArray = data.array;
            this.renderArray();
            this.updateArrayDisplay();
        } catch (error) {
            console.error('Failed to generate array:', error);
        }
    }
    
    async executeAlgorithm() {
        const algorithm = this.elements.algorithmSelect.value;
        if (!algorithm) {
            alert('Please select an algorithm');
            return;
        }
        
        try {
            const response = await fetch('/api/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    algorithm,
                    array: this.currentArray
                })
            });
            
            this.timeline = await response.json();
            this.currentPosition = -1;
            this.enablePlaybackControls();
            this.reset();
        } catch (error) {
            console.error('Failed to execute algorithm:', error);
        }
    }
    
    updateAlgorithmInfo(algorithmKey) {
        if (!algorithmKey || !this.algorithms[algorithmKey]) {
            this.elements.algorithmName.textContent = 'Select an Algorithm';
            this.elements.algorithmDescription.textContent = '';
            this.elements.algorithmComplexity.innerHTML = '';
            return;
        }
        
        const info = this.algorithms[algorithmKey];
        this.elements.algorithmName.textContent = info.name;
        this.elements.algorithmDescription.textContent = info.description;
        
        if (info.complexity) {
            this.elements.algorithmComplexity.innerHTML = `
                <h4>Complexity Analysis:</h4>
                <p>Best: ${info.complexity.best}</p>
                <p>Average: ${info.complexity.average}</p>
                <p>Worst: ${info.complexity.worst}</p>
                <p>Space: ${info.complexity.space}</p>
            `;
        }
        
        if (info.overview) {
            this.elements.algorithmComplexity.innerHTML += `
                <h4>Algorithm Overview:</h4>
                <p><strong>Strategy:</strong> ${info.overview.strategy}</p>
                <p><strong>Key Idea:</strong> ${info.overview.key_idea}</p>
                <p><strong>Best For:</strong> ${info.overview.when_to_use}</p>
            `;
        }
    }
    
    renderArray() {
        this.elements.arrayVisualization.innerHTML = '';
        
        if (!this.timeline || this.currentPosition === -1) {
            const values = this.currentArray;
            const maxValue = Math.max(...values);
            
            values.forEach((value, index) => {
                const bar = this.createArrayBar(value, index, maxValue);
                this.elements.arrayVisualization.appendChild(bar);
            });
            return;
        }
        
        const state = this.timeline.array_states[this.currentPosition + 1];
        const maxValue = Math.max(...state.values);
        
        state.values.forEach((value, index) => {
            const bar = this.createArrayBar(value, index, maxValue, state);
            this.elements.arrayVisualization.appendChild(bar);
        });
    }
    
    createArrayBar(value, index, maxValue, state = null) {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${(value / maxValue) * 80}%`;
        
        if (state) {
            if (state.sorted_indices.includes(index)) {
                bar.classList.add('sorted');
            } else if (state.pivot_index === index) {
                bar.classList.add('pivot');
            } else if (state.comparing_indices.includes(index)) {
                bar.classList.add('comparing');
            } else if (state.highlighted_indices.includes(index)) {
                bar.classList.add('highlighted');
            }
        }
        
        const valueLabel = document.createElement('div');
        valueLabel.className = 'array-bar-value';
        valueLabel.textContent = value;
        bar.appendChild(valueLabel);
        
        return bar;
    }
    
    updateArrayDisplay() {
        if (this.timeline && this.currentPosition >= 0) {
            const state = this.timeline.array_states[this.currentPosition + 1];
            this.elements.currentArray.textContent = `[${state.values.join(', ')}]`;
        } else {
            this.elements.currentArray.textContent = `[${this.currentArray.join(', ')}]`;
        }
    }
    
    updateStepExplanation() {
        if (this.timeline && this.currentPosition >= 0 && this.currentPosition < this.timeline.steps.length) {
            const step = this.timeline.steps[this.currentPosition];
            this.elements.stepExplanationText.textContent = step.explanation;
        } else {
            this.elements.stepExplanationText.textContent = 'No step in progress';
        }
    }
    
    updateProgress() {
        if (!this.timeline) return;
        
        const totalSteps = this.timeline.steps.length;
        const currentStep = Math.max(0, this.currentPosition + 1);
        const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
        
        this.elements.progressBar.style.width = `${progress}%`;
        this.elements.stepCounter.textContent = `${currentStep} / ${totalSteps}`;
    }
    
    enablePlaybackControls() {
        this.elements.playBtn.disabled = false;
        this.elements.pauseBtn.disabled = false;
        this.elements.stepForwardBtn.disabled = false;
        this.elements.stepBackwardBtn.disabled = false;
        this.elements.resetBtn.disabled = false;
    }
    
    play() {
        if (!this.timeline || this.isPlaying) return;
        
        this.isPlaying = true;
        const interval = 1000 / this.playbackSpeed;
        
        this.playbackInterval = setInterval(() => {
            if (this.currentPosition < this.timeline.steps.length - 1) {
                this.stepForward();
            } else {
                this.pause();
            }
        }, interval);
    }
    
    pause() {
        this.isPlaying = false;
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }
    }
    
    stepForward() {
        if (!this.timeline) return;
        
        if (this.currentPosition < this.timeline.steps.length - 1) {
            this.currentPosition++;
            this.updateVisualization();
        }
    }
    
    stepBackward() {
        if (!this.timeline) return;
        
        if (this.currentPosition > -1) {
            this.currentPosition--;
            this.updateVisualization();
        }
    }
    
    reset() {
        this.pause();
        this.currentPosition = -1;
        this.updateVisualization();
    }
    
    updateVisualization() {
        this.renderArray();
        this.updateArrayDisplay();
        this.updateStepExplanation();
        this.updateProgress();
    }
}

// Initialize the visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AlgorithmVisualizer();
});