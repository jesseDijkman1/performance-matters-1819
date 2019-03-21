const fs = require("fs");

fs.readFile("public/data/temp.json", (err, data) => {
  let d = JSON.parse(data);

  recursive(d)

  let betterJSON = JSON.stringify(d);

  fs.writeFile('better.json', betterJSON, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
})

function recursive(z) {
  let keys = Object.keys(z);
  console.log(z)
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
