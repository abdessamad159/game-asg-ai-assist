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

        // Squad Tactics
        this.squadState = 'ORBIT'; // ORBIT, ATTACK_RUN, REGROUP
        this.squadTimer = 0;
        this.orbitRadius = 300;

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
        this.squadState = 'ORBIT';
        this.squadTimer = 0;
        
        const scenario = Math.floor(Math.random() * 3);
        console.log("Scenario:", scenario === 0 ? "Plane Win" : scenario === 1 ? "Monster Win" : "Draw");

        let planeStats = { hp: 250, dmg: 15, maxSpeed: 6, maxForce: 0.2 };
        let monsterStats = { hp: 3000, dmg: 20, maxSpeed: 2, maxForce: 0.05 };

        if (scenario === 0) { // Plane Win
            planeStats = { hp: 400, dmg: 30, maxSpeed: 7, maxForce: 0.3 };
            monsterStats = { hp: 2000, dmg: 10, maxSpeed: 1.5, maxForce: 0.03 };
        } else if (scenario === 1) { // Monster Win
            planeStats = { hp: 150, dmg: 10, maxSpeed: 5, maxForce: 0.15 };
            monsterStats = { hp: 4000, dmg: 50, maxSpeed: 3, maxForce: 0.1 };
        } else { // Draw
            planeStats = { hp: 300, dmg: 35, maxSpeed: 6, maxForce: 0.2 };
            monsterStats = { hp: 3500, dmg: 40, maxSpeed: 2.5, maxForce: 0.08 };
        }

        this.spawnMonster(monsterStats);
        
        const numPlanes = 4 + Math.floor(Math.random() * 2); // 4-5 planes
        for (let i = 0; i < numPlanes; i++) {
            this.spawnPlane(planeStats, i, numPlanes);
        }
    }

    spawnMonster(stats) {
        this.monster = new Monster(this.width / 2, this.height / 2, this, stats);
        this.entities.push(this.monster);
    }

    spawnPlane(stats, slotIndex, totalSlots) {
        const x = Math.random() < 0.5 ? -50 : this.width + 50;
        const y = Math.random() * this.height;
        const plane = new Plane(x, y, this, stats, slotIndex, totalSlots);
        this.entities.push(plane);
    }

    updateSquadTactics(deltaTime) {
        if (!this.monster || this.monster.markedForDeletion) return;

        this.squadTimer += deltaTime;

        switch (this.squadState) {
            case 'ORBIT':
                // Planes circle the monster
                if (this.squadTimer > 4000) { // Orbit for 4 seconds
                    this.squadState = 'ATTACK_RUN';
                    this.squadTimer = 0;
                    console.log("Squad: ATTACK!");
                }
                break;
            case 'ATTACK_RUN':
                // Planes dive in
                if (this.squadTimer > 2000) { // Attack for 2 seconds
                    this.squadState = 'REGROUP';
                    this.squadTimer = 0;
                    console.log("Squad: REGROUP!");
                }
                break;
            case 'REGROUP':
                // Planes pull back to orbit distance
                if (this.squadTimer > 2000) { // Regroup for 2 seconds
                    this.squadState = 'ORBIT';
                    this.squadTimer = 0;
                    console.log("Squad: ORBITING");
                }
                break;
        }
    }

    loop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.updateSquadTactics(deltaTime);

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
            const planesAlive = this.entities.some(e => e instanceof Plane && !e.markedForDeletion);

            if (monsterDead || !planesAlive) {
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

        if (speed > 0.1) {
            const targetAngle = Math.atan2(this.vel.y, this.vel.x);
            let angleDiff = targetAngle - this.angle;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            this.angle += angleDiff * 0.1;
        }

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
        this.wander();
        
        const detectionRadius = 250;
        this.game.projectiles.forEach(p => {
            if (p.owner === 'plane') {
                const dist = Math.hypot(p.pos.x - this.pos.x, p.pos.y - this.pos.y);
                if (dist < detectionRadius) {
                    this.evade({ pos: p.pos, vel: p.vel }, 5);
                }
            }
        });

        super.update(deltaTime);

        this.shootTimer += deltaTime;
        if (this.shootTimer > this.shootInterval) {
            let closestPlane = null;
            let minDist = 600;

            this.game.entities.forEach(e => {
                if (e instanceof Plane && !e.markedForDeletion) {
                    const d = Math.hypot(e.pos.x - this.pos.x, e.pos.y - this.pos.y);
                    if (d < minDist) {
                        minDist = d;
                        closestPlane = e;
                    }
                }
            });

            if (closestPlane) {
                this.shoot(closestPlane);
                this.shootTimer = 0;
            }
        }
    }

    wander() {
        const wanderRadius = 50;
        const wanderDist = 100;
        const change = 0.5;
        this.wanderAngle += Math.random() * change - change * 0.5;
        
        const circleCenterX = this.vel.x;
        const circleCenterY = this.vel.y;
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
    constructor(x, y, game, stats, slotIndex, totalSlots) {
        super(x, y, game);
        this.target = game.monster;
        this.maxSpeed = stats.maxSpeed;
        this.maxForce = stats.maxForce;
        this.health = stats.hp;
        this.maxHealth = stats.hp;
        this.damage = stats.dmg;
        this.radius = 15;
        
        this.slotIndex = slotIndex;
        this.totalSlots = totalSlots;
        
        this.shootTimer = 0;
        this.shootInterval = 80;
    }

    update(deltaTime) {
        if (!this.target || this.target.markedForDeletion) {
            this.wander();
            super.update(deltaTime);
            return;
        }

        // Squad Tactics Logic
        switch (this.game.squadState) {
            case 'ORBIT':
                this.orbitBehavior();
                break;
            case 'ATTACK_RUN':
                this.attackBehavior(deltaTime);
                break;
            case 'REGROUP':
                this.regroupBehavior();
                break;
        }

        super.update(deltaTime);
    }

    orbitBehavior() {
        // Calculate desired position on the circle
        // Rotate the entire formation slowly
        const formationRotation = Date.now() * 0.0005;
        const angle = (this.slotIndex / this.totalSlots) * Math.PI * 2 + formationRotation;
        
        const targetX = this.target.pos.x + Math.cos(angle) * this.game.orbitRadius;
        const targetY = this.target.pos.y + Math.sin(angle) * this.game.orbitRadius;
        
        this.arrive(targetX, targetY);
    }

    attackBehavior(deltaTime) {
        // Dive in!
        this.seek(this.target.pos.x, this.target.pos.y);
        
        // Shoot if close enough
        const dist = Math.hypot(this.target.pos.x - this.pos.x, this.target.pos.y - this.pos.y);
        if (dist < 400) {
            this.shootTimer += deltaTime;
            if (this.shootTimer > this.shootInterval) {
                this.shoot();
                this.shootTimer = 0;
            }
        }
    }

    regroupBehavior() {
        // Evade to get back to distance quickly
        const dist = Math.hypot(this.target.pos.x - this.pos.x, this.target.pos.y - this.pos.y);
        if (dist < this.game.orbitRadius) {
            // Flee from monster
            let desiredX = this.pos.x - this.target.pos.x;
            let desiredY = this.pos.y - this.target.pos.y;
            // Normalize
            const len = Math.hypot(desiredX, desiredY);
            if (len > 0) {
                desiredX = (desiredX / len) * this.maxSpeed;
                desiredY = (desiredY / len) * this.maxSpeed;
                let steerX = desiredX - this.vel.x;
                let steerY = desiredY - this.vel.y;
                this.limitForce(steerX, steerY);
            }
        } else {
            // Resume orbit if far enough
            this.orbitBehavior();
        }
    }

    wander() {
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
        } else if (this.owner === 'monster') {
            this.game.entities.forEach(e => {
                if (e instanceof Plane && !e.markedForDeletion) {
                    const dist = Math.hypot(e.pos.x - this.pos.x, e.pos.y - this.pos.y);
                    if (dist < e.radius) {
                        e.takeDamage(this.damage);
                        this.markedForDeletion = true;
                    }
                }
            });
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
