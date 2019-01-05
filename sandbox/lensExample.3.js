const L = require("partial.lenses")
const R = require("ramda")

const ex = {
  foo: {
    bar: {
      baz: 1
    }
  }
}

const addQuuxBasedOnBaz = f => obj => ({
  ...obj,
  foo: {
    ...obj.foo,
    bar: {
      ...obj.foo.bar,
      quux: f(obj.foo.bar.baz)
    }
  }
})

addQuuxBasedOnBaz(x => x + 1)(ex) //?

const addQuuxBasedOnBazL = f => obj =>
  L.set(["foo", "bar", "quux"], f(L.get(["foo", "bar", "baz"])(obj)))(obj)

addQuuxBasedOnBazL(x => x + 1)(ex) //?

const addQuuxBasedOnBazR = f =>
  R.chain(
    L.set(["foo", "bar", "quux"]),
    R.compose(
      f,
      L.get(["foo", "bar", "baz"])
    )
  )

addQuuxBasedOnBazR(x => x + 1)(ex) //?

R.split(",")("Hello,sir") //?
