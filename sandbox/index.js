const d3 = require("d3")
const fs = require("fs")
const path = require("path")
const { flatten, sum, uniq } = require("ramda")

const normalize = provider =>
  ["UNITIL", "NSTAR", "NANTUCKET", "WMECO", "MASSACHUSETTS"].find(normalized =>
    new RegExp(normalized, "gi").test(provider)
  ) || provider

const geoData = require("./json/ma.topo")
const block1Data = d3
  // Reading CSV data from file and parsing as JSON
  .csvParse(fs.readFileSync(path.join(__dirname, "../csv/Block1.csv"), "utf-8"))
  // Only need the highest base rate rows (these are most common for residential installs)
  .filter(({ ["Base Compensation Rate Factor"]: base }) => base === "230%")
  // From those rows, only need the utility provider and the rate
  .map(
    ({ ["Electric Distribution Company"]: provider, ["Block 1"]: rate }) => ({
      // Trimming the footnote markers off
      provider,
      // : normalize(provider),
      // Convert to number
      rate: +rate.slice(1)
    })
  )

// Inspecting Block 1 data
block1Data //?

// Checking if there is a difference between "ELEC" and "ELEC_LABEL" values.
// (And indeed there is; turns out we only need care about what's in "ELEC_LABEL".)
geoData.objects.towns.geometries
  // .filter(({ properties: p }) => !p.ELEC_LABEL.includes("Municipal"))
  .filter(({ properties: p }) => p.ELEC !== p.ELEC_LABEL) //?

// Inspecting town data
geoData.objects.towns.geometries //?

// Making sure the normalized provider names of both data sets match up
uniq(block1Data.map(({ provider }) => provider).map(normalize)) //?
uniq(
  flatten(
    geoData.objects.towns.geometries.map(
      ({ properties: { ELEC_LABEL: label } }) => label.split(", ")
    )
  )
).map(normalize) //?

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
})) //?

// You could do something like this?
// But that's not respecting immutability

geoData.objects.towns.geometries.forEach(
  (x, i) =>
    (geoData.objects.towns.geometries[i] = {
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
    })
) //?
