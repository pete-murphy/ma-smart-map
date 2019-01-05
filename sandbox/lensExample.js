const R = require("ramda")
const L = require("partial.lenses")

const sampleTitles = {
  titles: [
    { language: "en", text: "Title" },
    { language: "sv", text: "Rubrik" }
  ]
}

L.get(L.prop("titles"))(sampleTitles) //?

L.get(
  L.compose(
    L.prop("titles"),
    L.index(0),
    L.prop("text")
  ),
  sampleTitles
) //?
// is the same as:
L.get(
  L.compose(
    "titles",
    0,
    "text"
  )
)(sampleTitles) //?
// which is the same as
L.get(["titles", 0, "text"])(sampleTitles) //?

L.set(
  L.compose(
    "titles",
    0,
    "text"
  )
)("POop")(sampleTitles) //?

const textIn = language =>
  L.compose(
    L.prop("titles"),
    L.normalize(R.sortBy(L.get("language"))),
    L.find(R.whereEq({ language })),
    L.valueOr({ language, text: "" }),
    L.removable("text"),
    L.prop("text")
  )

L.get(textIn("sv"))(sampleTitles) //?
L.get(textIn("fi"), sampleTitles) //?
L.set(textIn("en"), "The title", sampleTitles) //?

// ...
// Furthermore, we could organize the lenses to reflect the structure of the JSON model:
const Title = {
  text: [L.removable("text"), "text"]
}

const Titles = {
  titleIn: language => [
    L.find(R.whereEq({ language })),
    L.valueOr({ language, text: "" })
  ]
}

const Model = {
  titles: ["titles", L.normalize(R.sortBy(L.get("language")))],
  textIn: language => [Model.titles, Titles.titleIn(language), Title.text]
}

const texts = [Model.titles, L.elems, "text"]

const sampleTitles2 = {
  titles: [
    { language: "en", text: { name: "Title" } },
    { language: "sv", text: { name: "Rubrik" } }
  ]
}

L.modify(texts, L.set(["goo"])(L.get(["name"])), sampleTitles2).titles //?

const what = x =>
  L.modify(["titles", L.elems, x], L.set(["foo"], x))(sampleTitles2).titles

what("name") //?
