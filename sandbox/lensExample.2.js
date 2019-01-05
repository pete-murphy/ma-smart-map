const L = require("partial.lenses")

const sampleTitles = {
  titles: [
    { details: { language: "en" }, text: "Title" },
    { details: { language: "sv" }, text: "Rubrik" }
  ]
}

const toFull = abbr =>
  ({
    en: "English",
    sv: "Svenska"
  }[abbr])

const updatedTitles1 = {
  ...sampleTitles,
  titles: sampleTitles.titles.map(title => ({
    ...title,
    details: {
      ...title.details,
      fullLanguage: toFull(title.details.language)
    }
  }))
}

const updatedTitles2 = L.modify(["titles", L.elems], title => ({
  ...title,
  details: {
    ...title.details,
    fullLanguage: toFull(title.details.language)
  }
}))(sampleTitles)
