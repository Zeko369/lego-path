const canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

const drawCircle = (pos, r = 4, invert = false) => {
  ctx.beginPath();
  ctx.arc(
    pos.x * (invert ? -1 : 1),
    pos.y * (invert ? -1 : 1),
    r,
    0,
    2 * Math.PI
  );
  ctx.stroke();
};

const drawVector = (first, second) => {
  ctx.moveTo(first.x, first.y);
  ctx.lineTo(second.x, second.y);
  ctx.stroke();
};

let pos = { x: 0, y: 0 };

var first = true;
var all = [];

canvas.onmousedown = function(e) {
  if (first) {
    first = false;
    drawCircle(e);
    all.push({ point: { x: e.x, y: e.y } });
  } else {
    first = true;
    drawCircle(e, 2);
    all[all.length - 1].anglePoint = { x: e.x, y: e.y };
    drawVector(all[all.length - 1].point, all[all.length - 1].anglePoint);
  }
};

const transform = item => {
  const { point, anglePoint } = item;

  return {
    point: { x: point.x * -1, y: point.y * -1 },
    anglePoint: { x: anglePoint.x * -1, y: anglePoint.y * -1 }
  };
};

const connectAll = (all, edges) => {
  for (let i = 0; i < all.length - 1; i++) {
    const edgePoint = { x: edges[i].point.x * -1, y: edges[i].point.y * -1 };
    drawVector(all[i].point, edgePoint);
    drawVector(edgePoint, all[i + 1].point);
  }
};

const button = document.querySelector("button.run");
button.onclick = () => {
  const values = all.map(item => transform(item));
  const out = calc(values);

  out.forEach(item => {
    drawCircle(item.point, 8, true);
  });

  connectAll(all, out);
};
