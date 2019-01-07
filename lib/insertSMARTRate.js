const { readFile } = require("fs")
const { node, encase, of: future } = require("fluture")
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
const { csvParse } = require("d3")

const readBlockInfo = file =>
  node(done => {
    readFile(file, "utf8", done)
  })
    .chain(encase(csvParse))
    .map(xs =>
      xs
        .filter(({ "Base Compensation Rate Factor": base }) => base === "230%")
        .map(
          ({ "Electric Distribution Company": provider, "Block 1": rate }) => ({
            provider,
            rate: Number(rate.slice(1))
          })
        )
    )

const readTopoJSON = file =>
  node(done => {
    readFile(file, "utf8", done)
  }).chain(encase(JSON.parse))

// normalize :: String -> String
const normalize = provider =>
  ["UNITIL", "NSTAR", "NANTUCKET", "WMECO", "MASSACHUSETTS"].find(normalized =>
    new RegExp(normalized, "giu").test(provider)
  ) || provider.toUpperCase()

// geometries, SMART, ELEC_LABEL :: LensPath
const geometries = ["objects", "regions", "geometries", elems]
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

// main :: IO ()
const main = () => {
  const [CSV, TopoJSON] = process.argv.slice(2)
  return future(joinData)
    .ap(readBlockInfo(CSV))
    .ap(readTopoJSON(TopoJSON))
    .fork(
      console.error,
      compose(
        console.log,
        JSON.stringify
      )
    )
}

main()
