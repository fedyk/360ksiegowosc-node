import { equal } from "node:assert/strict"
import { describe } from "node:test"
import { getDatestamp, getTimestamp } from "./index.js"

describe("360ksiegowosc-api", function () {
  describe(getTimestamp.name, function () {
    equal(
      getTimestamp(new Date("2024-12-10T10:40:49.553")),
      "20241210104049"
    )
  })
  
  describe(getDatestamp.name, function () {
    equal(
      getDatestamp(new Date("2024-12-10T10:40:49.553")),
      "20241210"
    )
  })
})
