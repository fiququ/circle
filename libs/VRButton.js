class VRButton {

    constructor(renderer, options) {
        // Initialize properties and options
        this.renderer = renderer;
        this.options = options || {};
        this.init();
    }

    init() {
        // Create and customize the VR button
        this.createButton();
        this.setupEventListeners();
    }

    createButton() {
        // Create button element
        this.button = document.createElement('button');
        this.button.style.position = 'absolute';
        this.button.style.left = '50%';
        this.button.style.top = '60%';
        this.button.style.transform = 'translate(-50%, -50%)';
        this.button.style.width = '120px';
        this.button.style.height = '120px';
        this.button.style.cursor = 'pointer';
        this.button.style.borderRadius = '50%'; // Circular button shape
        this.button.style.backgroundColor = '#3498db'; // Example background color
        this.button.style.color = '#fff';
        this.button.style.fontSize = '20px';
        this.button.innerHTML = '<i class="fas fa-vr-cardboard"></i> ENTER VR';
        this.button.setAttribute('aria-label', 'Enter Virtual Reality');
        this.button.style.border = 'none'; // Remove border for a cleaner look
        this.button.style.outline = 'none'; // Remove outline on focus

        // Apply animation
        this.button.style.animation = 'bounce 2s infinite';

        // Add button to the document body
        document.body.appendChild(this.button);
    }

    setupEventListeners() {
        // Event listeners for button interactions
        this.button.addEventListener('click', () => this.toggleVR());
        this.button.addEventListener('mouseenter', () => this.onMouseEnter());
        this.button.addEventListener('mouseleave', () => this.onMouseLeave());
    }

    toggleVR() {
        // Toggle VR session start/end logic
        if (this.sessionActive) {
            this.endSession();
        } else {
            this.startSession();
        }
    }

    startSession() {
        // Logic to start VR session
        if ('xr' in navigator) {
            navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor'] })
                .then((session) => {
                    this.renderer.xr.setSession(session);
                    this.sessionActive = true;
                    this.button.textContent = 'EXIT VR';
                    if (this.options.onSessionStart) {
                        this.options.onSessionStart();
                    }
                })
                .catch((error) => {
                    console.error('Failed to start XR session:', error);
                    alert('Failed to start XR session. Please try again later.');
                });
        } else {
            console.error('WebXR not supported');
            alert('WebXR is not supported in this browser.');
        }
    }

    endSession() {
        // Logic to end VR session
        if (this.sessionActive) {
            this.renderer.xr.getSession().end();
            this.sessionActive = false;
            this.button.textContent = 'ENTER VR';
            if (this.options.onSessionEnd) {
                this.options.onSessionEnd();
            }
        }
    }

    onMouseEnter() {
        // Adjust styles on mouse enter
        this.button.style.fontSize = '22px';
        this.button.style.backgroundColor = '#2980b9'; // Darker shade on hover
    }

    onMouseLeave() {
        // Reset styles on mouse leave
        this.button.style.fontSize = '20px';
        this.button.style.backgroundColor = '#3498db'; // Reset to original background color
    }
}

// Example usage:
const renderer = new THREE.WebGLRenderer();
const vrButton = new VRButton(renderer, {
    onSessionStart: () => {
        console.log('VR session started');
    },
    onSessionEnd: () => {
        console.log('VR session ended');
    }
});
