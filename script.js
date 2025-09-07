document.addEventListener('DOMContentLoaded', () => {
    const modeSwitch = document.getElementById('mode-switch');
    const body = document.body;
    const customCursor = document.querySelector('.custom-cursor');
    const canvas = document.getElementById('pixel-network-canvas');
    const ctx = canvas.getContext('2d');
    
    let pixelGrid = [];
    let cables = [];
    const gridSize = 40; // Size of each pixel cell
    const cableSpeed = 0.01;
    let mouse = { x: null, y: null };
    let darkMode = body.classList.contains('dark-mode');

    // Cable class for signal flow effect
    class Cable {
        constructor(startNode, endNode) {
            this.startNode = startNode;
            this.endNode = endNode;
            this.progress = 0;
            this.glowDirection = 1;
            this.glowOpacity = 0;
        }

        draw() {
            // Draw the cable line
            ctx.beginPath();
            ctx.moveTo(this.startNode.x, this.startNode.y);
            ctx.lineTo(this.endNode.x, this.endNode.y);
            ctx.strokeStyle = darkMode ? 'rgba(0, 255, 128, 0.2)' : 'rgba(0, 123, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw the glowing signal pulse
            const signalX = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
            const signalY = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
            
            ctx.beginPath();
            ctx.arc(signalX, signalY, 3, 0, Math.PI * 2);
            ctx.fillStyle = darkMode ? 'rgba(0, 255, 128, 1)' : 'rgba(0, 123, 255, 1)';
            ctx.shadowBlur = 10;
            ctx.shadowColor = darkMode ? 'var(--text-color-dark)' : 'var(--accent-color-light)';
            ctx.fill();
        }

        update() {
            this.progress += cableSpeed;
            if (this.progress > 1) {
                this.progress = 0;
            }
        }
    }
    
    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Populate pixel grid
        pixelGrid = [];
        const numRows = Math.floor(canvas.height / gridSize);
        const numCols = Math.floor(canvas.width / gridSize);
        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
                pixelGrid.push({
                    x: c * gridSize,
                    y: r * gridSize
                });
            }
        }
        
        // Create initial cables between random nodes
        cables = [];
        const numCables = 10;
        for (let i = 0; i < numCables; i++) {
            const startNode = pixelGrid[Math.floor(Math.random() * pixelGrid.length)];
            const endNode = pixelGrid[Math.floor(Math.random() * pixelGrid.length)];
            cables.push(new Cable(startNode, endNode));
        }
    }

    function drawPixelGrid() {
        ctx.fillStyle = darkMode ? 'rgba(21, 34, 50, 0.5)' : 'rgba(255, 255, 255, 0.5)';
        ctx.strokeStyle = darkMode ? 'rgba(0, 255, 128, 0.05)' : 'rgba(0, 123, 255, 0.05)';
        ctx.lineWidth = 1;
        pixelGrid.forEach(pixel => {
            // Draw a dot or a small square at each grid point
            ctx.beginPath();
            ctx.arc(pixel.x, pixel.y, 1, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawPixelGrid();
        
        // Update and draw cables
        cables.forEach(cable => {
            cable.update();
            cable.draw();
        });

        // Interactive mouse connection
        if (mouse.x && mouse.y) {
            const nearestNode = pixelGrid.reduce((prev, curr) => {
                const distPrev = Math.sqrt((mouse.x - prev.x)**2 + (mouse.y - prev.y)**2);
                const distCurr = Math.sqrt((mouse.x - curr.x)**2 + (mouse.y - curr.y)**2);
                return distCurr < distPrev ? curr : prev;
            });

            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(nearestNode.x, nearestNode.y);
            ctx.strokeStyle = darkMode ? 'rgba(0, 255, 128, 0.8)' : 'rgba(0, 123, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // --- Core Website Logic ---
    
    // Custom cursor logic
    if (customCursor) {
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        document.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    // Typewriter effect logic
    function setupTypewriter() {
        document.querySelectorAll('.terminal-text').forEach(container => {
            const typedTextElement = container.querySelector('.typed-text');
            const textToType = container.dataset.text.trim();
            let i = 0;
            typedTextElement.textContent = '';

            function typeWriter() {
                if (i < textToType.length) {
                    if (textToType.substring(i, i + 1) === '\n') {
                         typedTextElement.innerHTML += '<br>';
                    } else {
                         typedTextElement.textContent += textToType.charAt(i);
                    }
                    i++;
                    setTimeout(typeWriter, 10);
                } else {
                    typedTextElement.classList.add('typed');
                }
            }
            typeWriter();
        });
    }

    // Interactive effects on hover
    function setupInteractiveEffects() {
        const interactiveElements = document.querySelectorAll('.project-card, .skills-category, .timeline-item');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('hover-effect');
            });
            element.addEventListener('mouseleave', () => {
                element.classList.remove('hover-effect');
            });
        });

        const otherInteractive = document.querySelectorAll('.btn, .project-link, .control-panel-nav a, .contact-links-footer a');
        otherInteractive.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'scale(1.03)';
                element.style.textShadow = '0 0 8px var(--accent-color-dark)';
                if (body.classList.contains('light-mode')) {
                    element.style.textShadow = 'none';
                }
            });
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'scale(1)';
                element.style.textShadow = 'none';
            });
        });
    }

    // Mode switch logic
    function setupModeSwitch() {
        const savedMode = localStorage.getItem('mode');
        if (savedMode) {
            body.classList.remove('dark-mode', 'light-mode');
            body.classList.add(savedMode);
            darkMode = savedMode === 'dark-mode';
            modeSwitch.querySelector('.icon').textContent = darkMode ? '💡' : '🌙';
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('mode', 'dark-mode');
            darkMode = true;
            modeSwitch.querySelector('.icon').textContent = '💡';
        }

        modeSwitch.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                localStorage.setItem('mode', 'light-mode');
                darkMode = false;
                modeSwitch.querySelector('.icon').textContent = '🌙';
            } else {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                localStorage.setItem('mode', 'dark-mode');
                darkMode = true;
                modeSwitch.querySelector('.icon').textContent = '💡';
            }
        });
    }
    
    // Handle window resizing
    window.addEventListener('resize', initCanvas);

    // Initialize all functions
    setupTypewriter();
    setupInteractiveEffects();
    setupModeSwitch();
    initCanvas();
    animate();
});