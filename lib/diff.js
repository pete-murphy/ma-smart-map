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
    d: "Nobody will believe you"
  }
}

const normalize = x => JSON.stringify(x, null, 2).split("\n")

const last = xs => xs.reverse()[0]

const diff = (original, modified) => {
  const [oNorm, mNorm] = [original, modified].map(normalize)
  return oNorm.reduce((acc, x, i) => x === mNorm[last(acc)[1]],  [[, 0]])
}

module.exports(diff)

console.log(JSON.stringify(ex0, null, 2).split("\n"))
