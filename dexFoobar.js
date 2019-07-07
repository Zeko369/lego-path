// const points = ;

const tests = [
  {
    input: [
      { point: { x: 0, y: 50 }, anglePoint: { x: 10, y: 50 } },
      { point: { x: 100, y: 100 }, anglePoint: { x: 105, y: 105 } },
      { point: { x: 200, y: 150 }, anglePoint: { x: 205, y: 145 } }
    ],
    output: [
      { point: { x: 50, y: 50 }, angle: 45 },
      { point: { x: 175, y: 175 }, angle: 90 }
    ]
  },
  {
    input: [
      { point: { x: 0, y: 0 }, anglePoint: { x: 10, y: 0 } },
      { point: { x: 100, y: 150 }, anglePoint: { x: 100, y: 110 } },
      { point: { x: 200, y: 150 }, anglePoint: { x: 205, y: 150 } }
    ],
    output: [
      { point: { x: 100, y: 0 }, angle: 90 },
      { point: { x: 100, y: 150 }, angle: 90 }
    ]
  }
];

const pointsToLineCoef = (pointA, pointB) => {
  const k = (pointB.y - pointA.y) / (pointB.x - pointA.x);
  const l = k * pointA.x * -1 + pointA.y;
  return { k, l, x: pointA.x };
};

const intersection = (coefA, coefB) => {
  let x, y;

  if (Math.abs(coefA.k) === Infinity) {
    if (Math.abs(coefB.k) === Infinity) {
      console.error("Fuck you");
    } else {
      x = coefA.x;
      y = coefB.k * x + coefB.l;
    }
  } else if (Math.abs(coefB.k) === Infinity) {
    x = coefB.x;
    y = coefA.k * x + coefA.l;
  } else {
    x = (coefB.l - coefA.l) / (coefA.k - coefB.k);
    y = coefA.k * x + coefA.l;
  }

  return { x, y };
};

const angleOfLine = coefA => {
  if (coefA.k === Infinity) {
    return 270;
  } else if (coefA.k === -Infinity) {
    return 90;
  }
  return Math.atan(coefA.k) * (180 / Math.PI);
};

const angle = (coefA, coefB) => {
  const a = angleOfLine(coefA);
  const b = angleOfLine(coefB);

  return Math.max(a, b) - Math.min(a, b);
};

const calc = input => {
  coefs = input.map(item => pointsToLineCoef(item.point, item.anglePoint));

  let tmp_out = [];

  for (let i = 0; i < coefs.length - 1; i++) {
    const first = coefs[i];
    const second = coefs[i + 1];

    tmp_out.push({
      point: intersection(first, second),
      angle: angle(first, second)
    });
  }

  return tmp_out;
};

const test = () => {
  let all = 0;

  tests.forEach(test => {
    const { input, output } = test;
    const tmp_out = calc(input);

    const compare = (a, b) => {
      if (typeof a === "object") {
        return Object.keys(a).map(key => compare(a[key], b[key]));
      } else if (typeof a === "array") {
        return a.map((item, index) => compare(item, b[index]));
      } else {
        return a === b;
      }
    };

    const out = tmp_out.map((item, index) => compare(item, output[index]));

    if (out.flat(3).filter(a => a === false).length === 0) {
      all++;
    } else {
      console.log("Got:");
      console.table(tmp_out);
      console.log("Expectex");
      console.table(output);
    }
  });

  console.log(`${all}/${tests.length} Passed`);
};
