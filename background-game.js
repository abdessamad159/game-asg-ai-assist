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
        
        this.roundState = 'STARTING';
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
        
        const scenario = Math.floor(Math.random() * 3);
        console.log("Scenario:", scenario === 0 ? "Plane Win" : scenario === 1 ? "Monster Win" : "Draw");

        let planeStats = { hp: 100, dmg: 10, maxSpeed: 6, maxForce: 0.15 };
        let monsterStats = { hp: 500, dmg: 20, maxSpeed: 2, maxForce: 0.05 };

        if (scenario === 0) { // Plane Win
            planeStats = { hp: 300, dmg: 25, maxSpeed: 7, maxForce: 0.2 };
            monsterStats = { hp: 300, dmg: 5, maxSpeed: 1.5, maxForce: 0.03 };
        } else if (scenario === 1) { // Monster Win
            planeStats = { hp: 100, dmg: 5, maxSpeed: 5, maxForce: 0.1 };
            monsterStats = { hp: 800, dmg: 40, maxSpeed: 3, maxForce: 0.1 };
        } else { // Draw
            planeStats = { hp: 150, dmg: 30, maxSpeed: 6, maxForce: 0.15 };
            monsterStats = { hp: 400, dmg: 30, maxSpeed: 2.5, maxForce: 0.08 };
        }

        this.spawnMonster(monsterStats);
        this.spawnPlane(planeStats);
        
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

        this.entities.forEach((entity, index) => {
            entity.update(deltaTime);
            entity.draw(this.ctx);
            
            if (entity.markedForDeletion) {
                this.entities.splice(index, 1);
            }
        });

        this.projectiles.forEach((proj, index) => {
            proj.update(deltaTime);
            proj.draw(this.ctx);
            
            if (proj.markedForDeletion) {
                this.projectiles.splice(index, 1);
            }
        });

        if (this.roundState === 'FIGHTING') {
            const monsterDead = !this.monster || this.monster.markedForDeletion;
            const planeDead = !this.plane || this.plane.markedForDeletion;

            if (monsterDead || planeDead) {
                this.roundState = 'ROUND_OVER';
                this.roundTimer = 0;
            }
        } else if (this.roundState === 'ROUND_OVER') {
            this.roundTimer += deltaTime;
            if (this.roundTimer > 3000) {
                this.startRound();
            }
        }

        requestAnimationFrame((ts) => this.loop(ts));
    }
}

class Entity {
    constructor(x, y, game) {
        this.pos = { x: x, y: y };
        this.vel = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
        this.game = game;
        this.markedForDeletion = false;
        this.radius = 20;
        this.angle = 0;
        this.maxSpeed = 4;
        this.maxForce = 0.1;
    }

    update(deltaTime) {
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        const speed = Math.hypot(this.vel.x, this.vel.y);
        if (speed > this.maxSpeed) {
            this.vel.x = (this.vel.x / speed) * this.maxSpeed;
            this.vel.y = (this.vel.y / speed) * this.maxSpeed;
        }

        this.pos.x += this.vel.x * (deltaTime / 16);
        this.pos.y += this.vel.y * (deltaTime / 16);

        this.acc.x = 0;
        this.acc.y = 0;

        // Smooth rotation towards velocity
        if (speed > 0.1) {
            const targetAngle = Math.atan2(this.vel.y, this.vel.x);
            let angleDiff = targetAngle - this.angle;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            this.angle += angleDiff * 0.1;
        }

        // Screen wrapping
        if (this.pos.x < -50) this.pos.x = this.game.width + 50;
        if (this.pos.x > this.game.width + 50) this.pos.x = -50;
        if (this.pos.y < -50) this.pos.y = this.game.height + 50;
        if (this.pos.y > this.game.height + 50) this.pos.y = -50;
    }

    applyForce(x, y) {
        this.acc.x += x;
        this.acc.y += y;
    }

    seek(targetX, targetY) {
        let desiredX = targetX - this.pos.x;
        let desiredY = targetY - this.pos.y;
        const dist = Math.hypot(desiredX, desiredY);
        if (dist === 0) return;

        desiredX = (desiredX / dist) * this.maxSpeed;
        desiredY = (desiredY / dist) * this.maxSpeed;

        let steerX = desiredX - this.vel.x;
        let steerY = desiredY - this.vel.y;
        this.limitForce(steerX, steerY);
    }

    arrive(targetX, targetY, slowingRadius = 200) {
        let desiredX = targetX - this.pos.x;
        let desiredY = targetY - this.pos.y;
        const dist = Math.hypot(desiredX, desiredY);
        
        if (dist < slowingRadius) {
            const m = (dist / slowingRadius) * this.maxSpeed;
            desiredX = (desiredX / dist) * m;
            desiredY = (desiredY / dist) * m;
        } else {
            desiredX = (desiredX / dist) * this.maxSpeed;
            desiredY = (desiredY / dist) * this.maxSpeed;
        }

        let steerX = desiredX - this.vel.x;
        let steerY = desiredY - this.vel.y;
        this.limitForce(steerX, steerY);
    }

    evade(target, predictionFactor = 10) {
        const futureX = target.pos.x + target.vel.x * predictionFactor;
        const futureY = target.pos.y + target.vel.y * predictionFactor;
        
        let desiredX = this.pos.x - futureX;
        let desiredY = this.pos.y - futureY;
        const dist = Math.hypot(desiredX, desiredY);
        if (dist === 0) return;

        desiredX = (desiredX / dist) * this.maxSpeed;
        desiredY = (desiredY / dist) * this.maxSpeed;

        let steerX = desiredX - this.vel.x;
        let steerY = desiredY - this.vel.y;
        this.limitForce(steerX, steerY);
    }

    pursue(target, predictionFactor = 10) {
        const futureX = target.pos.x + target.vel.x * predictionFactor;
        const futureY = target.pos.y + target.vel.y * predictionFactor;
        this.seek(futureX, futureY);
    }

    limitForce(x, y) {
        const len = Math.hypot(x, y);
        if (len > this.maxForce) {
            x = (x / len) * this.maxForce;
            y = (y / len) * this.maxForce;
        }
        this.applyForce(x, y);
    }

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
        this.maxSpeed = stats.maxSpeed;
        this.maxForce = stats.maxForce;
        
        this.shootTimer = 0;
        this.shootInterval = 800;
        this.wanderAngle = 0;
    }

    update(deltaTime) {
        // AI: Wander + Evade
        this.wander();
        
        // Evade projectiles
        const detectionRadius = 250;
        this.game.projectiles.forEach(p => {
            if (p.owner === 'plane') {
                const dist = Math.hypot(p.pos.x - this.pos.x, p.pos.y - this.pos.y);
                if (dist < detectionRadius) {
                    // Evade projectile
                    // Treat projectile as an entity with velocity
                    this.evade({ pos: p.pos, vel: p.vel }, 5);
                }
            }
        });

        super.update(deltaTime);

        // Counter Attack
        if (this.game.plane && !this.game.plane.markedForDeletion) {
            this.shootTimer += deltaTime;
            if (this.shootTimer > this.shootInterval) {
                const distToPlane = Math.hypot(this.game.plane.pos.x - this.pos.x, this.game.plane.pos.y - this.pos.y);
                if (distToPlane < 600) {
                    this.shoot(this.game.plane);
                    this.shootTimer = 0;
                }
            }
        }
    }

    wander() {
        // Wander behavior
        const wanderRadius = 50;
        const wanderDist = 100;
        const change = 0.5;
        this.wanderAngle += Math.random() * change - change * 0.5;
        
        const circleCenterX = this.vel.x;
        const circleCenterY = this.vel.y;
        // Normalize and scale
        const len = Math.hypot(circleCenterX, circleCenterY);
        const nx = (circleCenterX / (len || 1)) * wanderDist;
        const ny = (circleCenterY / (len || 1)) * wanderDist;

        const hx = Math.cos(this.wanderAngle) * wanderRadius;
        const hy = Math.sin(this.wanderAngle) * wanderRadius;

        const targetX = this.pos.x + nx + hx;
        const targetY = this.pos.y + ny + hy;
        
        this.seek(targetX, targetY);
    }

    shoot(target) {
        const angle = Math.atan2(target.pos.y - this.pos.y, target.pos.x - this.pos.x);
        for (let i = -1; i <= 1; i++) {
            const spread = i * 0.2;
            this.game.projectiles.push(
                new Projectile(this.pos.x, this.pos.y, angle + spread, 'monster', this.game, this.damage)
            );
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle);
        
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

        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
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
        this.maxSpeed = stats.maxSpeed;
        this.maxForce = stats.maxForce;
        this.health = stats.hp;
        this.maxHealth = stats.hp;
        this.damage = stats.dmg;
        this.radius = 15;
        
        this.shootTimer = 0;
        this.shootInterval = 80;
        
        this.state = 'PURSUE'; // PURSUE, ATTACK, RETREAT
        this.stateTimer = 0;
    }

    update(deltaTime) {
        if (!this.target || this.target.markedForDeletion) {
            // Victory lap
            this.wander();
            super.update(deltaTime);
            return;
        }

        const dist = Math.hypot(this.target.pos.x - this.pos.x, this.target.pos.y - this.pos.y);

        switch (this.state) {
            case 'PURSUE':
                this.pursue(this.target);
                if (dist < 400) this.state = 'ATTACK';
                break;
            
            case 'ATTACK':
                this.pursue(this.target); // Keep pursuing to aim
                this.shootTimer += deltaTime;
                if (this.shootTimer > this.shootInterval) {
                    this.shoot();
                    this.shootTimer = 0;
                }
                if (dist < 150) {
                    this.state = 'RETREAT';
                    this.stateTimer = 0;
                }
                break;

            case 'RETREAT':
                // Evade the monster to get away fast
                this.evade(this.target);
                this.stateTimer += deltaTime;
                if (this.stateTimer > 1000) this.state = 'PURSUE';
                break;
        }

        super.update(deltaTime);
    }

    wander() {
         // Simple circle wander
         this.angle += 0.05;
         this.applyForce(Math.cos(this.angle) * 0.1, Math.sin(this.angle) * 0.1);
    }

    shoot() {
        const spread = (Math.random() - 0.5) * 0.1;
        this.game.projectiles.push(
            new Projectile(this.pos.x, this.pos.y, this.angle + spread, 'plane', this.game, this.damage)
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
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle);

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
        
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.fillStyle = 'red';
        ctx.fillRect(-15, -25, 30, 3);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(-15, -25, 30 * (this.health / this.maxHealth), 3);
        ctx.restore();
    }
}

class Projectile {
    constructor(x, y, angle, owner, game, damage) {
        this.pos = { x: x, y: y };
        this.vel = { 
            x: Math.cos(angle) * (owner === 'plane' ? 12 : 6), 
            y: Math.sin(angle) * (owner === 'plane' ? 12 : 6) 
        };
        this.owner = owner;
        this.game = game;
        this.damage = damage;
        this.life = 1500;
        this.markedForDeletion = false;
        this.color = owner === 'plane' ? '#ffff00' : '#ff00ff';
    }

    update(deltaTime) {
        this.life -= deltaTime;
        if (this.life <= 0) {
            this.markedForDeletion = true;
            return;
        }

        this.pos.x += this.vel.x * (deltaTime / 16);
        this.pos.y += this.vel.y * (deltaTime / 16);

        // Collision
        if (this.owner === 'plane' && this.game.monster && !this.game.monster.markedForDeletion) {
            const dist = Math.hypot(this.game.monster.pos.x - this.pos.x, this.game.monster.pos.y - this.pos.y);
            if (dist < this.game.monster.radius) {
                this.game.monster.takeDamage(this.damage);
                this.markedForDeletion = true;
            }
        } else if (this.owner === 'monster' && this.game.plane && !this.game.plane.markedForDeletion) {
            const dist = Math.hypot(this.game.plane.pos.x - this.pos.x, this.game.plane.pos.y - this.pos.y);
            if (dist < this.game.plane.radius) {
                this.game.plane.takeDamage(this.damage);
                this.markedForDeletion = true;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.fillStyle = this.color;
        
        if (this.owner === 'plane') {
            ctx.rotate(Math.atan2(this.vel.y, this.vel.x));
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
