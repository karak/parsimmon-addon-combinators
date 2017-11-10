module.exports = {
  "transform": {
    "^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)$",
  "testPathIgnorePatterns": [
    "lib",
  ],
  "moduleFileExtensions": [
    "ts",
    "js",
    "json"
  ],
  "testEnvironment": "node"
}
