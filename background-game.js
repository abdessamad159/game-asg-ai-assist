class Game {
    constructor() {
        this.canvas = document.getElementById('bg-game');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.entities = [];
        this.projectiles = [];
        this.lastTime = 0;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.roundState = 'STARTING'; // FIGHTING, ROUND_OVER
        this.roundTimer = 0;

        this.startRound();
        this.loop(0);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    startRound() {
        this.entities = [];
        this.projectiles = [];
        this.roundState = 'FIGHTING';
        
        // Pick a scenario: 0 = Plane Win, 1 = Monster Win, 2 = Draw
        const scenario = Math.floor(Math.random() * 3);
        console.log("Scenario:", scenario === 0 ? "Plane Win" : scenario === 1 ? "Monster Win" : "Draw");

        let planeStats = { hp: 100, dmg: 10 };
        let monsterStats = { hp: 500, dmg: 20 };

        if (scenario === 0) { // Plane Win
            planeStats = { hp: 300, dmg: 25 }; // Strong Plane
            monsterStats = { hp: 300, dmg: 5 }; // Weak Monster
        } else if (scenario === 1) { // Monster Win
            planeStats = { hp: 100, dmg: 5 }; // Weak Plane
            monsterStats = { hp: 800, dmg: 40 }; // Strong Monster
        } else { // Draw (Both strong/glass cannons)
            planeStats = { hp: 150, dmg: 30 };
            monsterStats = { hp: 400, dmg: 30 };
        }

        this.spawnMonster(monsterStats);
        this.spawnPlane(planeStats);
        
        // Link targets
        this.plane.target = this.monster;
    }

    spawnMonster(stats) {
        this.monster = new Monster(this.width / 2, this.height / 2, this, stats);
        this.entities.push(this.monster);
    }

    spawnPlane(stats) {
        this.plane = new Plane(this, stats);
        this.entities.push(this.plane);
    }

    loop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update and draw entities
        this.entities.forEach((entity, index) => {
            entity.update(deltaTime);
            entity.draw(this.ctx);
            
            if (entity.markedForDeletion) {
                this.entities.splice(index, 1);
            }
        });

        // Update and draw projectiles
        this.projectiles.forEach((proj, index) => {
            proj.update(deltaTime);
            proj.draw(this.ctx);
            
            if (proj.markedForDeletion) {
                this.projectiles.splice(index, 1);
            }
        });

        // Check Round End Conditions
        if (this.roundState === 'FIGHTING') {
            const monsterDead = !this.monster || this.monster.markedForDeletion;
            const planeDead = !this.plane || this.plane.markedForDeletion;

            if (monsterDead || planeDead) {
                this.roundState = 'ROUND_OVER';
                this.roundTimer = 0;
            }
        } else if (this.roundState === 'ROUND_OVER') {
            this.roundTimer += deltaTime;
            if (this.roundTimer > 3000) { // Wait 3 seconds before next round
                this.startRound();
            }
        }

        requestAnimationFrame((ts) => this.loop(ts));
    }
}

class Entity {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.markedForDeletion = false;
        this.radius = 20;
    }
    update(deltaTime) {}
    draw(ctx) {}
    takeDamage(amount) {}
}

class Monster extends Entity {
    constructor(x, y, game, stats) {
        super(x, y, game);
        this.radius = 50;
        this.health = stats.hp;
        this.maxHealth = stats.hp;
        this.damage = stats.dmg;
        this.angle = 0;
        this.rotationSpeed = 0.002;
        
        this.moveTimer = 0;
        this.moveDir = Math.random() * Math.PI * 2;
        
        this.shootTimer = 0;
        this.shootInterval = 800;
    }

    update(deltaTime) {
        this.angle += this.rotationSpeed * deltaTime;

        // 1. Basic Wandering
        this.moveTimer += deltaTime;
        if (this.moveTimer > 2000) {
            this.moveDir = Math.random() * Math.PI * 2;
            this.moveTimer = 0;
        }
        
        let dx = Math.cos(this.moveDir) * 0.5;
        let dy = Math.sin(this.moveDir) * 0.5;

        // 2. Dodge Logic
        const detectionRadius = 200;
        let dodgeX = 0;
        let dodgeY = 0;
        
        this.game.projectiles.forEach(p => {
            if (p.owner === 'plane') {
                const dist = Math.hypot(p.x - this.x, p.y - this.y);
                if (dist < detectionRadius) {
                    const angleToProj = Math.atan2(p.y - this.y, p.x - this.x);
                    dodgeX -= Math.cos(angleToProj) * 2;
                    dodgeY -= Math.sin(angleToProj) * 2;
                }
            }
        });

        this.x += dx + dodgeX;
        this.y += dy + dodgeY;

        // Screen bounds
        if (this.x < 50) this.x = 50;
        if (this.x > this.game.width - 50) this.x = this.game.width - 50;
        if (this.y < 50) this.y = 50;
        if (this.y > this.game.height - 50) this.y = this.game.height - 50;

        // 3. Counter Attack
        if (this.game.plane && !this.game.plane.markedForDeletion) {
            this.shootTimer += deltaTime;
            if (this.shootTimer > this.shootInterval) {
                const distToPlane = Math.hypot(this.game.plane.x - this.x, this.game.plane.y - this.y);
                if (distToPlane < 600) {
                    this.shoot(this.game.plane);
                    this.shootTimer = 0;
                }
            }
        }
    }

    shoot(target) {
        const angle = Math.atan2(target.y - this.y, target.x - this.x);
        for (let i = -1; i <= 1; i++) {
            const spread = i * 0.2;
            this.game.projectiles.push(
                new Projectile(this.x, this.y, angle + spread, 'monster', this.game, this.damage)
            );
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Boss Visuals
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#aa0033';
        ctx.fillRect(-20, -20, 40, 40);
        
        for(let i=0; i<4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(20, -10);
            ctx.lineTo(40, 0);
            ctx.lineTo(20, 10);
            ctx.fill();
        }

        ctx.restore();

        // Health bar
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = 'red';
        ctx.fillRect(-40, -this.radius - 15, 80, 6);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(-40, -this.radius - 15, 80 * (this.health / this.maxHealth), 6);
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
    constructor(game, stats) {
        super(100, 100, game);
        this.target = game.monster;
        this.speed = 5;
        this.angle = 0;
        this.health = stats.hp;
        this.maxHealth = stats.hp;
        this.damage = stats.dmg;
        this.radius = 15;
        
        this.shootTimer = 0;
        this.shootInterval = 80;
        
        this.state = 'SEEK';
        this.stateTimer = 0;
    }

    update(deltaTime) {
        if (!this.target || this.target.markedForDeletion) {
            // If target is dead, maybe fly away or victory lap?
            // For now just keep flying straight or circle
            this.angle += 0.02;
            this.x += Math.cos(this.angle) * this.speed * (deltaTime/16);
            this.y += Math.sin(this.angle) * this.speed * (deltaTime/16);
            return;
        }

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const targetAngle = Math.atan2(dy, dx);

        switch (this.state) {
            case 'SEEK':
                this.turnTowards(targetAngle, 0.06);
                if (distance < 400) this.state = 'ATTACK';
                break;
            
            case 'ATTACK':
                this.turnTowards(targetAngle, 0.04);
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
                this.stateTimer += deltaTime;
                if (this.stateTimer > 600) this.state = 'TURN';
                break;

            case 'TURN':
                this.turnTowards(targetAngle, 0.1);
                if (Math.abs(this.getAngleDiff(targetAngle)) < 0.5) this.state = 'SEEK';
                break;
        }

        const moveStep = this.speed * (deltaTime / 16); 
        this.x += Math.cos(this.angle) * moveStep;
        this.y += Math.sin(this.angle) * moveStep;
        
        // Screen wrapping
        if (this.x < -50) this.x = this.game.width + 50;
        if (this.x > this.game.width + 50) this.x = -50;
        if (this.y < -50) this.y = this.game.height + 50;
        if (this.y > this.game.height + 50) this.y = -50;
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
        const spread = (Math.random() - 0.5) * 0.1;
        this.game.projectiles.push(
            new Projectile(this.x, this.y, this.angle + spread, 'plane', this.game, this.damage)
        );
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Jet Visuals
        ctx.fillStyle = '#00ccff';
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-15, 15);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-15, -15);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = 'rgba(0, 200, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(-15, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        
        // Health bar
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = 'red';
        ctx.fillRect(-15, -25, 30, 3);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(-15, -25, 30 * (this.health / this.maxHealth), 3);
        ctx.restore();
    }
}

class Projectile extends Entity {
    constructor(x, y, angle, owner, game, damage) {
        super(x, y, game);
        this.angle = angle;
        this.owner = owner;
        this.speed = owner === 'plane' ? 12 : 6;
        this.life = 1500;
        this.damage = damage;
        this.color = owner === 'plane' ? '#ffff00' : '#ff00ff';
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

        // Collision
        if (this.owner === 'plane' && this.game.monster && !this.game.monster.markedForDeletion) {
            const dist = Math.hypot(this.game.monster.x - this.x, this.game.monster.y - this.y);
            if (dist < this.game.monster.radius) {
                this.game.monster.takeDamage(this.damage);
                this.markedForDeletion = true;
            }
        } else if (this.owner === 'monster' && this.game.plane && !this.game.plane.markedForDeletion) {
            const dist = Math.hypot(this.game.plane.x - this.x, this.game.plane.y - this.y);
            if (dist < this.game.plane.radius) {
                this.game.plane.takeDamage(this.damage);
                this.markedForDeletion = true;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        
        if (this.owner === 'plane') {
            ctx.fillRect(-5, -1, 10, 2);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

window.addEventListener('load', () => {
    new Game();
});
