class Particle {
  constructor(g, x, y, color, firework) {
    this.g = g;
    this.x = x;
    this.y = y;
    this.color = color;
    this.firework = firework;
    this.lifespan = 225;
    if (this.firework) {
      this.vel = {
        x: 0,
        y: _.random(-15, -12)
      };
    } else {
      const radians = _.random(0, Math.PI*2);
      const length = _.random(2, 10);
      this.vel = {x: Math.cos(radians)*length, y: Math.sin(radians)*length};
    }
    this.acc = {
      x: 0,
      y: 0
    };
  }

  applyForce(force) {
    this.acc = force;
  }

  update() {
    if (!this.firework) {
      this.vel.x *= 0.9;
      this.vel.y *= 0.9;
      this.lifespan -= 4;
    }
    console.log(this.vel, this.acc)
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;

    this.x += this.vel.x;
    this.y += this.vel.y;
    console.log(this.x, this.y)
    this.acc = {
      x: 0,
      y: 0
    };
  }

  show() {
    this.g.beginFill(this.color);
    this.g.drawCircle(this.x, this.y, this.firework ? 4 : 2);
    this.g.endFill();
  }

  done() {
    return this.lifespan < 0;
  }
}

class Firework {
  constructor(g, width, height) {
    this.g = g;
    this.color = PIXI.utils.string2hex(randomColor({
      luminosity: 'light'
    }));
    this.firework = new Particle(g, _.random(0, width), height, this.color, true);
    this.exploded = false;
    this.particles = [];
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce({
        x: 0,
        y: 0.2
      });
      this.firework.update();
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode()
      }
    }
    for (let i = this.particles.length -1 ; i>= 0; i--) {
      this.particles[i].applyForce({x: 0, y: 0.2})
      this.particles[i].update()
      if (this.particles[i].done()) {
        this.particles.splice(i, 1)
      }
    }
  }

  explode() {
    for (let i = 0; i< 100; i++) {
      const p = new Particle(this.g, this.firework.x, this.firework.y, this.color, false);
      this.particles.push(p);
    }
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
}

function makeFireworks(app) {
  const fireworks = [];
  const graphic = new PIXI.Graphics();
  graphic.interactive = true

  let backTexture1 = PIXI.RenderTexture.create({
    width: app.screen.width,
    height: app.screen.height,
    resolution: window.devicePixelRatio || 1
  });
  let backTexture2 = PIXI.RenderTexture.create({
    width: app.screen.width,
    height: app.screen.height,
    resolution: window.devicePixelRatio || 1
  });
  const backSprite = new PIXI.Sprite(backTexture1);
  
  let isPause = false;
  graphic.on('pointertap', () => {
    if (isPause)
      resume();
    else
      pause();
  });


  function pause() {
    isPause = true;
    app.ticker.remove(update);
  }

  function resume() {
    isPause = false;
    app.ticker.add(update);
  }

  function play() {
    app.stage.addChild(backSprite);
    app.stage.addChild(graphic);
    app.ticker.add(update)
  }

  function update() {
    const temp = backTexture1;
    backTexture1 = backTexture2;
    backTexture2 = temp;
    backSprite.texture = backTexture1;

    graphic.clear()
    graphic.beginFill(0, 0.1);
    graphic.drawRect(0, 0, app.screen.width, app.screen.height);
    graphic.endFill();
    if (_.random(0, 100) < 3)
      fireworks.push(new Firework(graphic, app.screen.width, app.screen.height))
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update()
      fireworks[i].show()
      if (fireworks[i].done()) {
        fireworks.splice(i, 1);
      }
    }
    app.renderer.render(app.stage, backTexture2);
  }
  return {
    play
  }
}

function step3() {
  const app = new PIXI.Application({
    width: 800,
    height: 800,
    backgroundColor: 0,
    resolution: window.devicePixelRatio || 1,
    view: document.getElementById('ground')
  });
  const fireworks = makeFireworks(app);
  fireworks.play();
}

step3()