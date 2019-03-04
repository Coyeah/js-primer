let menuObject = {
  "1": {
    name: "Area1",
    subMenu: {
      "3": {
        name: "Area1-1"
      },
      "4": {
        name: "Area1-2",
        subMenu: {
          "7": {
            name: "Area1-2-3"
          }
        }
      }
    }
  },
  "2": {
    name: "Area2",
    subMenu: {
      "5": {
        name: "Area2-1",
        subMenu: {
          "8": {
            name: "Area2-1-3"
          }
        }
      },
      "6": {
        name: "Area2-2"
      }
    }
  }
}

let listObject = {
  "1": {
    name: "Leanne",
    contact: "92998",
  },
  "2": {
    name: "Ervin",
    contact: "90566",
  },
  "3": {
    name: "Graham",
    contact: "59590",
  },
  "4": {
    name: "Howell",
    contact: "53919",
  },
  "5": {
    name: "Clementine",
    contact: "33263",
  },
  "6": {
    name: "Bauch",
    contact: "23505",
  },
  "7": {
    name: "Samantha",
    contact: "58804",
  },
  "8": {
    name: "Bret",
    contact: "76495",
  }
}

let one = deepCopy(menuObject);

one[1].name = "Coyeah";
console.log(menuObject);
console.log(one);

function deepCopy(target) {
  let flag = false;
  if (target instanceof Array) {
    flag = true;
  } else if (!(target instanceof Object)) {
    return target;
  }

  let result = flag ? [] : {};

  if (flag) {
    target.map(value => {
      if (value instanceof Object) {
        result.push(deepCopy(value));
      } else {
        result.push(value);
      }
    })
  } else {
    for (let key in target) {
      if (target[key] instanceof Object) {
        result[key] = deepCopy(target[key]);
      } else {
        result[key] = target[key];
      }
    }
  }

  return result;
}

// 一种无算法的深拷贝
// obj2 = JSON.parse(JSON.stringify(obj1));
