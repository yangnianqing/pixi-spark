class Particle {
  constructor(g, x, y, color, firework) {
    this.g = g;
    this.x = x;
    this.y = y;
    this.color = color;
    this.firework = firework;
    this.vel = {
      x: 0,
      y: -10
    };
    this.acc = {
      x: 0,
      y: 0
    };
  }

  applyForce(force) {
    this.acc = force;
  }

  update() {
    console.log(this.vel)
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    console.log(this.vel, this.acc)
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
    this.g.drawCircle(this.x, this.y, 4);
    this.g.endFill();
  }
}

class Firework {
  constructor(g, width, height) {
    this.g = g;
    this.color = PIXI.utils.string2hex(randomColor({
      luminosity: 'light'
    }));
    this.firework = new Particle(g, _.random(0, width), height, this.color, true);
  }

  update() {
    this.firework.applyForce({
      x: 0,
      y: 0.2
    });
    this.firework.update();
  }

  show() {
    this.firework.show();
  }
}

function makeFireworks(app) {
  const fireworks = [];
  const graphic = new PIXI.Graphics();

  function play() {
    app.stage.addChild(graphic);
    app.ticker.add(update)
  }

  function update() {
    graphic.clear()
    if (_.random(0, 100) < 3)
      fireworks.push(new Firework(graphic, app.screen.width, app.screen.height))
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update()
      fireworks[i].show()
    }
    app.renderer.render(app.stage);
  }
  return {
    play
  }
}

function step1() {
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
step1()