export function filledMat(dim, fillFn) {
  let mat = [];
  for (let y = 0; y < dim.y; y++) {
    let row = [];
    for (let x = 0; x < dim.x; x++) {
      row.push(fillFn(x, y));
    }
    mat.push(row);
  }
  return mat;
}

export function mapMat(mat, mapFn) {
  let retMat = [];
  for (let y = 0; y < mat.length; y++) {
    const row = mat[y];
    let retRow = [];
    for (let x = 0; x < row.length; x++) {
      retRow.push(mapFn(x, y, row[x]));
    }
    retMat.push(retRow);
  }
  return retMat;
}

export function applyMat(mat, mapFn) {
  for (let y = 0; y < mat.length; y++) {
    const row = mat[y];
    for (let x = 0; x < row.length; x++) {
      mapFn(x, y, row[x]);
    }
  }
}

