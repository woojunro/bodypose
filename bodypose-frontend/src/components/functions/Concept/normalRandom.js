export const normalRandom = () => {
  let u, v, s;
  do {
    u = Math.random() * 2 - 1;
    v = Math.random() * 2 - 1;
    s = u * u + v * v;
  } while (s === 0 || s >= 1);

  const mul = Math.sqrt((-2 * Math.log(s)) / s);
  const val = Math.abs(u * mul);
  return Math.floor(val * 50) + 1;
};
