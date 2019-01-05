const d3 = require("d3")
const fs = require("fs")
const path = require("path")

const {
  chain,
  compose,
  defaultTo,
  equals,
  eqBy,
  find,
  flatten,
  lensPath,
  map,
  prop,
  split,
  uniq,
  view,
  whereEq
} = require("ramda")
const { elems, get, modify, set } = require("partial.lenses")

const normalize = provider =>
  ["UNITIL", "NSTAR", "NANTUCKET", "WMECO", "MASSACHUSETTS"].find(normalized =>
    new RegExp(normalized, "gi").test(provider)
  ) || provider.toUpperCase()

const geoData = require("./json/ma.topo")
const block1Data = d3
  // Reading CSV data from file and parsing as JSON
  .csvParse(fs.readFileSync(path.join(__dirname, "../csv/Block1.csv"), "utf-8"))
  // Only need the highest base rate rows (these are most common for residential installs)
  .filter(({ ["Base Compensation Rate Factor"]: base }) => base === "230%")
  // From those rows, only need the utility provider and the rate
  .map(
    ({ ["Electric Distribution Company"]: provider, ["Block 1"]: rate }) => ({
      provider,
      // Convert to number
      rate: +rate.slice(1)
    })
  )

// Inspecting Block 1 data
block1Data

// Checking if there is a difference between "ELEC" and "ELEC_LABEL" values.
// (And indeed there is; turns out we only need care about what's in "ELEC_LABEL".)
geoData.objects.towns.geometries
  // .filter(({ properties: p }) => !p.ELEC_LABEL.includes("Municipal"))
  .filter(({ properties: p }) => p.ELEC !== p.ELEC_LABEL)

// Inspecting town data
geoData.objects.towns.geometries

// Making sure the normalized provider names of both data sets match up
uniq(block1Data.map(({ provider }) => provider).map(normalize))
uniq(
  flatten(
    geoData.objects.towns.geometries.map(
      ({ properties: { ELEC_LABEL: label } }) => label.split(", ")
    )
  )
).map(normalize)

const geometries = ["objects", "towns", "geometries", elems]
const ELEC_LABEL = ["properties", "ELEC_LABEL"]
const splitByLabel = split(", ")

const findWhereEqBy = optic =>
  map(
    compose(
      find,
      whereEq
    ),
    optic
  )

const ex = { properties: { ELEC_LABEL: { foo: 1 } } }
const bx = [{ foo: 1, goo: 2 }]

findWhereEqBy(get(ELEC_LABEL))(ex)(bx) //?

// mapToRate :: BlockInfo -> [Util] ->  [Float]
const mapToRate = blockInfo =>
  map(label =>
    compose(
      defaultTo(0),
      prop("rate"),
      find(
        compose(
          eqBy(normalize, label),
          prop("provider")
        )
      )
    )(blockInfo)
  )

// insertSMARTRate :: Geometry -> BlockInfo -> Geometry
const insertSMARTRate = b =>
  compose(
    mapToRate(b),
    splitByLabel,
    get(ELEC_LABEL)
  )

insertSMARTRate(block1Data)({ properties: { ELEC_LABEL: "UNITIL" } }) //?

// findWhereEqBy(compose(normalize, get(["properties", "ELEC_LABEL"])))({ properties: { ELEC_LABEL: "UNITIL" } })

const joinSMARTData = modify(
  ["objects", "towns", "geometries", elems],
  chain(
    set(["properties", "SMART"]),
    //
    //  This part takes an object (the geometry obj)
    //  (and it should also be parameterized by the block obj)
    //  and returns the first object with an updated nested field
    //  then gets the properties.ELEC_LABEL value
    //
    compose(
      map(label =>
        compose(
          defaultTo(0),
          prop("rate"),
          find(
            compose(
              eqBy(normalize, label),
              prop("provider")
            )
          )
        )(block1Data)
      ),
      split(", "),
      get(["properties", "ELEC_LABEL"])
    )

    //
  )
)

joinSMARTData(geoData).objects.towns.geometries[58].properties.SMART //?
