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
            this.monster = new Monster(Math.random() * this.width, Math.random() * this.height);
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
    }

    update(deltaTime) {
        // Slowly rotate or float
        this.angle += 0.001 * deltaTime;
        this.y += Math.sin(this.angle) * 0.5;
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
            // Explosion effect could be added here
        }
    }
}

class Plane extends Entity {
    constructor(game) {
        super(100, 100);
        this.game = game;
        this.target = game.monster;
        this.speed = 0.2;
        this.angle = 0;
        this.shootTimer = 0;
        this.shootInterval = 200; // ms
    }

    update(deltaTime) {
        if (!this.target || this.target.markedForDeletion) {
            this.target = this.game.monster;
        }

        if (this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Move towards target but keep distance
            const targetAngle = Math.atan2(dy, dx);
            
            // Smooth rotation
            let angleDiff = targetAngle - this.angle;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            this.angle += angleDiff * 0.05;

            // Orbit logic: fly perpendicular to target if close
            if (distance < 300) {
                 this.angle += Math.PI / 2 * 0.05;
            }

            this.x += Math.cos(this.angle) * this.speed * deltaTime;
            this.y += Math.sin(this.angle) * this.speed * deltaTime;

            // Shooting
            this.shootTimer += deltaTime;
            if (this.shootTimer > this.shootInterval && distance < 500) {
                this.shoot();
                this.shootTimer = 0;
            }
        }
    }

    shoot() {
        const projectile = new Projectile(this.x, this.y, this.angle, this.target);
        this.game.entities.push(projectile);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Draw Plane Shape (Triangle)
        ctx.fillStyle = '#00ccff';
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-10, 10);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-10, -10);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

class Projectile extends Entity {
    constructor(x, y, angle, target) {
        super(x, y);
        this.angle = angle;
        this.speed = 0.8;
        this.target = target;
        this.life = 2000; // ms
    }

    update(deltaTime) {
        this.life -= deltaTime;
        if (this.life <= 0) {
            this.markedForDeletion = true;
            return;
        }

        this.x += Math.cos(this.angle) * this.speed * deltaTime;
        this.y += Math.sin(this.angle) * this.speed * deltaTime;

        // Collision detection
        if (this.target && !this.target.markedForDeletion) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.target.radius) {
                this.target.takeDamage(10);
                this.markedForDeletion = true;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = '#ffff00';
        ctx.fillRect(-5, -2, 10, 4);

        ctx.restore();
    }
}

// Start the game when the window loads
window.addEventListener('load', () => {
    new Game();
});
