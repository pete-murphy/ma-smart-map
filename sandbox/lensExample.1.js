const R = require("ramda")
const L = require("partial.lenses")

const sampleTitles = {
  titles: [
    { title: "The Peregrine", details: { language: "en" } },
    { title: "Dead Souls", details: { language: "ru" } }
  ]
}

const prices = {
  en: 455,
  ru: 890
}

const newSampleTitles = {
  ...sampleTitles,
  titles: sampleTitles.titles.map(title => ({
    ...title,
    details: { ...title.details, price: prices[title.details.language] }
  }))
}

L.transform([
  ["titles"],
  L.elems,
  L.modifyOp(x =>
    L.set(["details", "price"])(prices[L.get(["details", "language"], x)])(x)
  )
])(sampleTitles).titles //?

// const sampleAuthors = {
//   authors: [
//     {
//       author: "Nikolai Gogol",
//       works: ["The Government Inspector", "Dead Souls"]
//     },
//     {
//       author: "J. A. Baker",
//       works: ["The Peregrine"]
//     }
//   ]
// }
