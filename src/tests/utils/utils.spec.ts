import assert from "assert"
import { completeKeys } from "../../utils/utils"

describe("Utils completeKeys", () => {
    it("Return True when all keys are present", () => {
        const object = {
            "amount": 23,
            "expense_date": "2022-06-19 02:51:00",
            "description":"Grab home from Star after finale night",
            "category": "Transport"
        }

        const keys = ["amount", "expense_date", "description", "category"]

        assert.ok(completeKeys(keys, object))
    })

    it("Return False when there are missing keys", () => {
        const object = {
            "amount": 23,
            "expense_date": "2022-06-19 02:51:00",
            "description":"Grab home from Star after finale night",
            "category": "Transport"
        }

        const keys = ["amount", "expense_date", "description", "category", "extrakey"]

        assert.ok(!completeKeys(keys, object))
    })
})