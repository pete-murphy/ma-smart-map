const R = require("ramda")

const baz = R.lensPath(["foo", "bar", "baz"])
const quux = R.lensPath(["foo", "bar", "quux"])

//

const addQuuxBasedOnBaz_ = f => obj => R.set(quux, f(R.view(baz, obj)), obj)
const f_ = R.add(1)
const obj = { foo: { bar: { baz: 3 } } }
addQuuxBasedOnBaz_(f_)(obj) //?

//

const addQuuxBasedOnBaz__ = f => obj => R.set(quux, f(obj), obj)
const f__ = R.pipe(
  R.view(baz),
  R.add(1)
)
addQuuxBasedOnBaz__(f__)(obj)

//

const addQuuxBasedOnBaz = R.chain(R.set(quux))
const f = R.pipe(
  R.view(baz),
  R.add(1)
)
addQuuxBasedOnBaz(f)(obj) //?

R.pipe(
  R.lensPath,
  R.set,
  R.chain
)(["foo"])(R.view(R.lensPath(["bar"])))({ bar: 2 })
//?
