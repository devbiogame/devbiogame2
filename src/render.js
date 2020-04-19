const pixelsPerCell = 20;

function _createQuad(color) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  let d2 = pixelsPerCell / 2;
  ctx.save();
  ctx.translate(d2, d2);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-d2, -d2);
  ctx.lineTo(+d2, -d2);
  ctx.lineTo(+d2, +d2);
  ctx.lineTo(-d2, +d2);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
  return canvas;
}

function stateToColor(level) {
  // This is a callback
  let colorsByVarByState = [];
  for (let v = 0; v < level.nStatesByVar.length; v++) {
    let colorsByState = [];
    let nStates = level.nStatesByVar[v];
    for (let i = 0; i < nStates; i++) {
      colorsByState.push(`hsl(${(360 / nStates) * i}, 100%, 50%)`);
    }
    colorsByVarByState.push(colorsByState);
  }
  return colorsByVarByState;
}

export function render(canvas, level) {
  // Callback to get color mapping
  let colorsByVarByState = stateToColor(level);

  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let quadsByVarByState = [];
  for (let v = 0; v < colorsByVarByState.length; v++) {
    let quadsByState = [];
    let nStates = colorsByVarByState[v].length;
    for (let i = 0; i < nStates; i++) {
      quadsByState.push(_createQuad(colorsByVarByState[v][i]));
    }
    quadsByVarByState.push(quadsByState);
  }

  for (let y = 0; y < level.dim.y; y++) {
    for (let x = 0; x < level.dim.x; x++) {
      let cell = level.cellByYX(y, x);
      if (cell.alive) {
        ctx.drawImage(
          quadsByVarByState[0][cell.vars[0]],
          x * pixelsPerCell,
          y * pixelsPerCell
        );
      }
    }
  }
}
