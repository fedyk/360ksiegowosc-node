import test from "node:test"
import assert from "node:assert"
import { Ksiegowosc360 } from "./index.js";

const API_ID = String(process.env.API_ID || "")
const API_KEY = String(process.env.API_KEY || "")
const run = (API_ID && API_KEY) ? test.describe : test.skip;

run("spec", function () {
  let instance: Ksiegowosc360

  test.before(function () {
    instance = new Ksiegowosc360(API_ID, API_KEY)
  })

  test.after(function () {
    // cleanup
  })

  test("list of customers", async function ({ signal }) {
    const customers = await instance.getCustomers({}, signal)

    assert.ok(Array.isArray(customers))

    for (const customer of customers) {
      assert.ok(customer.CustomerId, new assert.AssertionError({
        message: "`customer.CustomerId` is required",
        actual: customer.CustomerId,
        expected: "non empty string"
      }))
    }
  })

  test("list of tax ids", async function ({ signal }) {
    const taxes = await instance.getTaxes({}, signal)

    assert.ok(Array.isArray(taxes), "taxes is array")

    for (const tax of taxes) {
      assert.ok(typeof tax.Id === "string", "`tax.Id` is required")
      assert.ok(typeof tax.Code === "string", "`tax.Code` is required")
      assert.ok(typeof tax.NonActive === "boolean", "`tax.NonActive` is required")
    }
  })
})

