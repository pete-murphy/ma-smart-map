module.exports = function() {
  return {
    files: ["lib/*.js"],

    tests: ["test/*.test.js"],

    testFramework: "tape",
    env: {
      type: "node",
      runner: "node"
    }
  }
}
