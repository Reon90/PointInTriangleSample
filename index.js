function byNormal(a, b, c, p) {

  function checkNormals(n1, n2) {
    return n1.dot(n2) >= 0;
  }

  function calculateNormal(a, b, p) {
    return b.dir(a).cross(p.dir(a));
  }

  return checkNormals(calculateNormal(b, c, a), calculateNormal(b, c, p)) &&
    checkNormals(calculateNormal(c, a, b), calculateNormal(c, a, p)) &&
    checkNormals(calculateNormal(a, b, c), calculateNormal(a, b, p));
}

function bySide(a, b, c, p) {

  function detectSide(a, b, p) {
    const pa = p.dir(a).normalize();
    const ba = b.dir(a).normalize();
    return pa.dot(ba) > 0;
  }

  return detectSide(a, b, p) && detectSide(b, c, p) && detectSide(c, a, p);
}

function bySumAngles(a, b, c, p) {

  function getAngle(a, b) {
    return Math.acos(a.dot(b));
  }

  const pa = p.dir(a).normalize();
  const pb = p.dir(b).normalize();
  const pc = p.dir(c).normalize();

  return getAngle(pa, pb) + getAngle(pb, pc) + getAngle(pc, pa) === Math.PI * 2;
}

function byBarycentric(a, b, c, p) {
  const ca = c.dir(a);
  const ba = b.dir(a);
  const pa = p.dir(a);

  const dot00 = ca.dot(ca);
  const dot01 = ca.dot(ba);
  const dot02 = ca.dot(pa);
  const dot11 = ba.dot(ba);
  const dot12 = ba.dot(pa);

  const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  return u >= 0 && v >= 0 && u + v < 1;
}

function byArea(a, b, c, p) {

  function area(a, b, c) {
    const cb = c.dir(b);
    const ab = a.dir(b);

    return cb.cross(ab).length() * 0.5;
  }

  return area(a, b, c) === area(p, b, c) + area(p, a, c) + area(p, a, b);
}

/* ========================= */

class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  dir(v) {
    return new Vector3(this.x, this.y, this.z).sub(v);
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v) {
    const ax = this.x, ay = this.y, az = this.z;
    const bx = v.x, by = v.y, bz = v.z;

    const x = ay * bz - az * by;
    const y = az * bx - ax * bz;
    const z = ax * by - ay * bx;

    return new Vector3(x, y, z);
  }

  normalize() {
    return this.divideScalar( this.length() || 1 );
  }

  length() {
    return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
  }

  divideScalar(scalar) {
    return this.multiplyScalar( 1 / scalar );
  }

  multiplyScalar(scalar) {
    const x = this.x * scalar;
    const y = this.y * scalar;
    const z = this.z * scalar;

    return new Vector3(x, y, z);
  }
}

/* ========================= */

const a = new Vector3(1, 1, 0);
const b = new Vector3(5, 5, 0);
const c = new Vector3(8, 2, 0);
const p1 = new Vector3(2, 5, 0);
const p2 = new Vector3(5, 3, 0);

console.log(byNormal(a, b, c, p1));
console.log(bySide(a, b, c, p2));

console.log(byNormal(a, b, c, p1));
console.log(bySide(a, b, c, p2));

console.log(bySumAngles(a, b, c, p1));
console.log(bySumAngles(a, b, c, p2));

console.log(byBarycentric(a, b, c, p1));
console.log(byBarycentric(a, b, c, p2));

console.log(byArea(a, b, c, p1));
console.log(byArea(a, b, c, p2));
