import "./styles.css";
import { render } from "./render";
import { gameDef } from "./game1";
import { filledMat, mapMat, applyMat } from "./helpers";

document.getElementById("app").innerHTML = `
<canvas id="main-canvas"></canvas>
`;

let canvas = document.getElementById("main-canvas");

class Level {
  constructor(_gameDef) {
    this.gameFuncs = _gameDef.playDef.funcs;
    this.cells = [];
    this.dim = gameDef.levelDef.dim;
    this.nStatesByVar = gameDef.levelDef.varStates;
    this.clearRequests();
    this.cellInit();
    gameDef.levelDef.setup(this);
  }

  cellByYX(y, x) {
    return this.cells[y][x];
  }

  cellInit() {
    this.cells = filledMat(this.dim, (x, y) => new CellState(this, x, y));
  }

  clearRequests() {
    this.requestsByYX = mapMat(this.cells, () => []);
  }

  update() {
    this.clearRequests();

    applyMat(this.cells, (x, y, cell) => {
      if (cell.alive !== 0) {
        (this.gameFuncs || []).map(i => i(cell));
        cell.age++;
      }
    });

    applyMat(this.cells, (x, y, cell) => {
      // Activate if no contention
      let requests = this.requestsByYX[y][x];
      if (requests.length === 1) {
        // Inherit memory state but reset age
        let request = requests[0];
        for (let i = 0; i < cell.vars.length; i++) {
          cell.vars[i] = request.vars[i];
        }
        cell.age = 0;
        cell.render = 1;
        cell.alive = 1;
      }
    });
  }
}

const dirX = [-1, 0, 1, 0];
const dirY = [0, -1, 0, 1];

class CellState {
  constructor(level, x, y) {
    this.level = level;
    this.render = 0;
    this.alive = 0;
    this.x = x;
    this.y = y;
    this.age = 0;
    this.vars = new Array(this.level.nStatesByVar.length).fill(0);
  }

  inc(whichV) {
    this.vars[whichV] =
      (this.vars[whichV] + 1) % this.level.nStatesByVar[whichV];
  }

  dec(whichV) {
    this.vars[whichV] =
      (this.vars[whichV] + this.level.nStatesByVar[whichV] - 1) %
      this.level.nStatesByVar[whichV];
  }

  replicate(dir) {
    dir = dir % 4;
    let dstX = this.x + dirX[dir];
    let dstY = this.y + dirY[dir];
    if (
      0 <= dstX &&
      dstX < this.level.dim.x &&
      0 <= dstY &&
      dstY < this.level.dim.y
    ) {
      if (!this.level.cellByYX(dstY, dstX).render) {
        // If it has never been alive then it can be requested
        this.level.requestsByYX[dstY][dstX].push(this);
      }
    }
  }

  rand(whichV) {
    let val =
      Math.floor(Math.random() * Math.floor(this.level.nStatesByVar[whichV])) %
      this.level.nStatesByVar[whichV];
    this.vars[whichV] = val;
  }

  stop() {
    this.alive = 0;
  }

  pop() {
    this.alive = 0;
    this.render = 0;
  }
}

let level = new Level(gameDef);
const loop = () => {
  level.update();
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  render(canvas, level);
  //requestAnimationFrame(loop);
  setTimeout(loop, 10);
};
//loop();
//requestAnimationFrame(loop);
