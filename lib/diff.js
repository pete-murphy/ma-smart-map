const { diff } = require("../output/Diff")

const ex0 = {
  a: "Hello",
  b: "What",
  c: {
    d: "No-one will believe you"
  }
}

const ex0_4 = {
  a: "Hello",
  b: "What",
  c: {
    d: "No-one will believe you",
    e: "poop"
  }
}

const normalize = x => JSON.stringify(x, null, 2).split("\n")

// const diff = undefined
console.log(diff(normalize(ex0))(normalize(ex0_4)))

module.exports = diff

// console.log(JSON.stringify(ex0, null, 2).split("\n"))
