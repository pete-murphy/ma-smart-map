const d3 = require("d3")
const fs = require("fs")
const path = require("path")

const {
  flatten,
  defaultTo,
  view,
  find,
  map,
  split,
  lensPath,
  uniq,
  chain,
  eqBy,
  pluck,
  compose,
  prop
} = require("ramda")
const {
  transform,
  modifyOp,
  modify,
  elems,
  get,
  set
} = require("partial.lenses")

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

// This almost works, but we don't get the surrounding object back,
// just the nested "geometries" array :(
// (Also, its already a bit of a mess)
geoData.objects.towns.geometries.map(x => ({
  ...x,
  properties: {
    ...x.properties,
    rate: x.properties.ELEC_LABEL.split(", ").map(label => {
      const match = block1Data.find(
        ({ provider }) => normalize(provider) === normalize(label)
      )
      return match ? match.rate : 0
    })
  }
}))

// Progress, but this is broken
// (Need to fix `modifyOp`)
transform([
  ["objects", "towns", "geometries"],
  elems,
  modifyOp(o => ({
    ...o,
    properties: {
      ...o.properties,
      rate: o.properties.ELEC_LABEL.split(", ").map(label => {
        const match = block1Data.find(
          ({ provider }) => normalize(provider) === normalize(label)
        )
        return match ? match.rate : 0
      })
    }
  }))
])(geoData).objects.towns.geometries[0]

// A bit better
modify([["objects", "towns", "geometries"], elems], o => ({
  ...o,
  properties: {
    ...o.properties,
    rate: o.properties.ELEC_LABEL.split(", ").map(label => {
      const match = block1Data.find(
        ({ provider }) => normalize(provider) === normalize(label)
      )
      return match ? match.rate : 0
    })
  }
}))(geoData).objects.towns.geometries[0]

// Pointfree using `chain`
modify(
  ["objects", "towns", "geometries", elems],
  chain(
    set(["properties", "rate"]),
    compose(
      map(label => {
        const match = block1Data.find(
          ({ provider }) => normalize(provider) === normalize(label)
        )
        return match ? match.rate : 0
      }),
      split(", "),
      view(lensPath(["properties", "ELEC_LABEL"]))
    )
  )
)(geoData).objects.towns.geometries[0]

modify(
  ["objects", "towns", "geometries", elems],
  chain(
    set(["properties", "rate"]),
    compose(
      map(label => {
        const match = block1Data.find(({ provider }) =>
          eqBy(normalize, label, provider)
        )
        return match ? match.rate : 0
      }),
      split(", "),
      view(lensPath(["properties", "ELEC_LABEL"]))
    )
  )
)(geoData).objects.towns.geometries[0] //?

modify(
  ["objects", "towns", "geometries", elems],
  chain(
    set(["properties", "SMART"]),
    compose(
      map(label =>
        defaultTo(0)(
          prop("rate")(
            block1Data.find(({ provider }) => eqBy(normalize, label, provider))
          )
        )
      ),
      split(", "),
      view(lensPath(["properties", "ELEC_LABEL"]))
    )
  )
)(geoData).objects.towns.geometries[25] //?

modify(
  ["objects", "towns", "geometries", elems],
  chain(
    set(["properties", "SMART"]),
    compose(
      map(label =>
        compose(
          defaultTo(0),
          prop("rate"),
          find(({ provider }) => eqBy(normalize, label, provider))
        )(block1Data)
      ),
      split(", "),
      view(lensPath(["properties", "ELEC_LABEL"]))
    )
  )
)(geoData).objects.towns.geometries[25] //?

const trace = msg => x => {
  console.log(msg, x)
  return x
}
