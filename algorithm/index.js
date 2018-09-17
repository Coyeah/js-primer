// var menuObject = {
//   "1": {
//     name: "Area1",
//     subMenu: {
//       "3": {
//         name: "Area1-1"
//       },
//       "4": {
//         name: "Area1-2",
//         subMenu: {
//           "7": {
//             name: "Area1-2-3"
//           }
//         }
//       }
//     }
//   },
//   "2": {
//     name: "Area2",
//     subMenu: {
//       "5": {
//         name: "Area2-1",
//         subMenu: {
//           "8": {
//             name: "Area2-1-3"
//           }
//         }
//       },
//       "6": {
//         name: "Area2-2"
//       }
//     }
//   }
// }

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

let newObj = deepCopy(listObject);

newObj[1].name = "Hello World!";
console.log(listObject);
console.log(newObj);

function deepClone(obj) {
  
}