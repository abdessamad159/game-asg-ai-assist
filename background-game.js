class Game {
    constructor() {
        this.canvas = document.getElementById('bg-game');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.entities = [];
        this.lastTime = 0;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.init();
        this.loop(0);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    init() {
        // Create a monster in the center
        this.monster = new Monster(this.width / 2, this.height / 2);
        this.entities.push(this.monster);

        // Create a plane
        this.plane = new Plane(this);
        this.entities.push(this.plane);
    }

    loop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update and draw all entities
        this.entities.forEach((entity, index) => {
            entity.update(deltaTime);
            entity.draw(this.ctx);
            
            if (entity.markedForDeletion) {
                this.entities.splice(index, 1);
            }
        });

        // Respawn monster if dead
        if (this.monster.markedForDeletion) {
            // Respawn somewhere random but not too close to edges
            const margin = 100;
            this.monster = new Monster(
                margin + Math.random() * (this.width - margin * 2), 
                margin + Math.random() * (this.height - margin * 2)
            );
            this.entities.push(this.monster);
            // Reset plane target
            this.plane.target = this.monster;
        }

        requestAnimationFrame((ts) => this.loop(ts));
    }
}

class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.markedForDeletion = false;
    }
    update(deltaTime) {}
    draw(ctx) {}
}

class Monster extends Entity {
    constructor(x, y) {
        super(x, y);
        this.radius = 40;
        this.health = 100;
        this.maxHealth = 100;
        this.angle = 0;
        this.moveTimer = 0;
        this.moveDir = Math.random() * Math.PI * 2;
    }

    update(deltaTime) {
        // Slowly rotate
        this.angle += 0.001 * deltaTime;
        
        // Wandering movement
        this.moveTimer += deltaTime;
        if (this.moveTimer > 2000) {
            this.moveDir = Math.random() * Math.PI * 2;
            this.moveTimer = 0;
        }
        
        this.x += Math.cos(this.moveDir) * 0.5;
        this.y += Math.sin(this.moveDir) * 0.5;

        // Keep in bounds
        if (this.x < 0) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.y < 0) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Draw Monster Shape (Abstract)
        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(this.radius, this.radius);
        ctx.lineTo(-this.radius, this.radius);
        ctx.closePath();
        ctx.fill();

        // Health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(-30, -this.radius - 20, 60, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(-30, -this.radius - 20, 60 * (this.health / this.maxHealth), 5);

        ctx.restore();
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.markedForDeletion = true;
        }
    }
}

class Plane extends Entity {
    constructor(game) {
        super(100, 100);
        this.game = game;
        this.target = game.monster;
        this.speed = 4; // Faster speed
        this.angle = 0;
        this.shootTimer = 0;
        this.shootInterval = 100; // Fast fire rate
        
        // State Machine: SEEK, ATTACK, PASS, TURN
        this.state = 'SEEK';
        this.stateTimer = 0;
    }

    update(deltaTime) {
        if (!this.target || this.target.markedForDeletion) {
            this.target = this.game.monster;
            this.state = 'SEEK';
        }

        if (this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const targetAngle = Math.atan2(dy, dx);

            // State Machine Logic
            switch (this.state) {
                case 'SEEK':
                    this.turnTowards(targetAngle, 0.05);
                    if (distance < 500) {
                        this.state = 'ATTACK';
                    }
                    break;
                
                case 'ATTACK':
                    this.turnTowards(targetAngle, 0.03); // Keep aim
                    
                    // Shoot
                    this.shootTimer += deltaTime;
                    if (this.shootTimer > this.shootInterval) {
                        this.shoot();
                        this.shootTimer = 0;
                    }

                    if (distance < 150) {
                        this.state = 'PASS';
                        this.stateTimer = 0;
                    }
                    break;

                case 'PASS':
                    // Fly straight past the target
                    this.stateTimer += deltaTime;
                    if (this.stateTimer > 800) { // 0.8 seconds of flying past
                        this.state = 'TURN';
                    }
                    break;

                case 'TURN':
                    // Turn back aggressively
                    this.turnTowards(targetAngle, 0.08);
                    // Check if we are facing the target roughly
                    const diff = this.getAngleDiff(targetAngle);
                    if (Math.abs(diff) < 0.5) {
                        this.state = 'SEEK';
                    }
                    break;
            }

            // Move forward
            // Normalize speed to be frame-rate independent roughly, but simple for now
            const moveStep = this.speed * (deltaTime / 16); 
            this.x += Math.cos(this.angle) * moveStep;
            this.y += Math.sin(this.angle) * moveStep;
            
            // Screen wrapping for plane
            if (this.x < -50) this.x = this.game.width + 50;
            if (this.x > this.game.width + 50) this.x = -50;
            if (this.y < -50) this.y = this.game.height + 50;
            if (this.y > this.game.height + 50) this.y = -50;
        }
    }

    turnTowards(targetAngle, turnSpeed) {
        let angleDiff = targetAngle - this.angle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        this.angle += angleDiff * turnSpeed;
    }

    getAngleDiff(targetAngle) {
        let angleDiff = targetAngle - this.angle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        return angleDiff;
    }

    shoot() {
        // Add some spread
        const spread = (Math.random() - 0.5) * 0.1;
        const projectile = new Projectile(this.x, this.y, this.angle + spread, this.target);
        this.game.entities.push(projectile);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Draw Plane Shape (Jet)
        ctx.fillStyle = '#00ccff';
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-15, 15);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-15, -15);
        ctx.closePath();
        ctx.fill();
        
        // Engine glow
        ctx.fillStyle = 'rgba(0, 200, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(-15, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class Projectile extends Entity {
    constructor(x, y, angle, target) {
        super(x, y);
        this.angle = angle;
        this.speed = 10;
        this.target = target;
        this.life = 1000; // ms
    }

    update(deltaTime) {
        this.life -= deltaTime;
        if (this.life <= 0) {
            this.markedForDeletion = true;
            return;
        }

        const moveStep = this.speed * (deltaTime / 16);
        this.x += Math.cos(this.angle) * moveStep;
        this.y += Math.sin(this.angle) * moveStep;

        // Collision detection
        if (this.target && !this.target.markedForDeletion) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.target.radius) {
                this.target.takeDamage(5); // Less damage per shot since rapid fire
                this.markedForDeletion = true;
                
                // Hit effect (simple flash)
                // In a full engine we'd spawn a particle system here
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = '#ffff00';
        ctx.fillRect(-5, -1, 10, 2);

        ctx.restore();
    }
}

// Start the game when the window loads
window.addEventListener('load', () => {
    new Game();
});
