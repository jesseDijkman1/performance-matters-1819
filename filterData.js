const fs = require("fs");

fs.readFile("public/data/temp.json", (err, data) => {
  let d = JSON.parse(data);

  recursive(d)

  console.log(d)
})

function recursive(z) {
  let keys = Object.keys(z);
  keys.forEach(k => {
    if (typeof z[k] == "object" && z[k].length == undefined) {
      Object.keys(z[k]).forEach(() => recursive(z[k]))
    } else if (typeof z[k] == "object" && z[k].length == 1) {
      z[k] = z[k][0]
      Object.keys(z[k]).forEach(() => recursive(z[k]))
    } else if (typeof z[k] == "object" && z[k].length > 1) {
      z[k].forEach(recursive)
    }
  })
}
