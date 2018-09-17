/**
 * G - 敌人
 * . - 空地
 * # - 墙体
 */
const map = [
  '#############',
  '#GG.GGG#GGG.#',
  '###.#G#G#G#G#',
  '#.......#..G#',
  '#G#.###.#G#G#',
  '#GG.GGG.#.GG#',
  '#G#.#G#.#.###',
  '##G...G.....#',
  '#G#.#G###.#G#',
  '#...G#GGG.GG#',
  '#G#.#G#G#.#G#',
  '#GG.GGG#G.GG#',
  '#############',
];

const enumeration = (map) => {
  let x, y, p, q, score = 0;

  for (let i = 1; i < map.length - 1; i++) {
    for (let j = 1; j < map[i].length - 1; j++) {
      if (map[i].charAt(j) === '.') {
        let sum = 0;
        /* 向上 */
        x = i;
        y = j;
        while (map[x].charAt(y) != '#') {
          if (map[x].charAt(y) == 'G') {
            sum++;
          }
          x--;
        }
        /* 向下 */
        x = i;
        y = j;
        while (map[x].charAt(y) != '#') {
          if (map[x].charAt(y) == 'G') {
            sum++;
          }
          x++;
        }
        /* 向左 */
        x = i;
        y = j;
        while (map[x].charAt(y) != '#') {
          if (map[x].charAt(y) == 'G') {
            sum++;
          }
          y--;
        }
        /* 向右 */
        x = i;
        y = j;
        while (map[x].charAt(y) != '#') {
          if (map[x].charAt(y) == 'G') {
            sum++;
          }
          y++;
        }

        if (sum > score) {
          score = sum;
          p = i;
          q = j;
        }
      }
    }
  }

  return {
    x: p,
    y: q,
    sum: score,
  }
}

let ts = enumeration(map);
console.log(ts);