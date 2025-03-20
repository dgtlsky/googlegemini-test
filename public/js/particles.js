document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas to full window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Initial resize and listen for window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.2; // Even smaller particles (0.2 to 1.7)
            this.speedX = Math.random() * 0.4 - 0.2; // Slower movement
            this.speedY = Math.random() * 0.4 - 0.2;
            this.alpha = Math.random() * 0.5 + 0.1; // Slightly lower opacity
            this.glow = Math.random() * 10 + 5; // Maintain good glow effect
            
            // Generate colors with subtle green tint to match theme
            const baseValue = Math.floor(Math.random() * 40) + 150; // Values between 150-190
            const greenTint = Math.min(255, baseValue + Math.floor(Math.random() * 30)); // Add slight green tint
            this.color = `rgba(${baseValue}, ${greenTint}, ${baseValue}, ${this.alpha})`;
            
            // Random pulse rate for glow animation
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
            this.glowStrength = this.glow;
        }

        update() {
            // Move particles
            this.x += this.speedX;
            this.y += this.speedY;

            // Check if off-screen and reset if needed
            if (this.x < 0 || this.x > canvas.width || 
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
            
            // Animate glow with pulsing effect
            this.glowStrength += this.pulseDirection * this.pulseSpeed;
            
            // Reverse direction when reaching min/max glow
            if (this.glowStrength > this.glow + 5 || this.glowStrength < this.glow - 5) {
                this.pulseDirection *= -1;
            }
        }

        draw() {
            // Draw the glow
            ctx.shadowBlur = this.glowStrength;
            ctx.shadowColor = this.color;
            
            // Draw the particle
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Reset shadow for next particle
            ctx.shadowBlur = 0;
        }
    }

    // Create particles
    const particles = [];
    const particleCount = 180; // Fewer particles

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        // Clear canvas completely to remove trails
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}); 