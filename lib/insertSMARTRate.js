const {
  chain,
  compose,
  defaultTo,
  eqBy,
  find,
  map,
  prop,
  split
} = require("ramda")
const { elems, get, modify, set } = require("partial.lenses")

// normalize :: String -> String
const normalize = provider =>
  ["UNITIL", "NSTAR", "NANTUCKET", "WMECO", "MASSACHUSETTS"].find(normalized =>
    new RegExp(normalized, "giu").test(provider)
  ) || provider.toUpperCase()

// geometries, SMART, ELEC_LABEL :: LensPath
const geometries = ["objects", "towns", "geometries", elems]
const SMART = ["properties", "SMART"]
const ELEC_LABEL = ["properties", "ELEC_LABEL"]

// toArray :: String -> [String]
const toArray = split(", ")

// ????
// findWhereEqBy :: Eq a => (String -> a) -> String -> (Object -> String) -> Object -> Object
const findWhereEqBy = fn => x => lens =>
  find(
    compose(
      eqBy(fn, x),
      lens
    )
  )

// mapToRate :: BlockInfo -> [Util] -> [Float]
const mapToRate = blockInfo =>
  map(label =>
    compose(
      defaultTo(0),
      prop("rate"),
      findWhereEqBy(normalize)(label)(prop("provider"))
    )(blockInfo)
  )

// insertSMARTRate :: BlockInfo -> Geometry -> Geometry
const insertSMARTRate = blockInfo =>
  compose(
    mapToRate(blockInfo),
    toArray,
    get(ELEC_LABEL)
  )

// joinData :: BlockInfo -> GeoJSON -> GeoJSON
const joinData = blockInfo =>
  modify(geometries, chain(set(SMART), insertSMARTRate(blockInfo)))

module.exports = joinData
