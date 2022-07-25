import assert from "assert"
import { completeKeys, isWhiteListed } from "../../utils/utils"

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

        const keys = ["amount", "description", "category", "extrakey", "expense_date"]

        assert.ok(!completeKeys(keys, object))
    })
})

describe("Utils isWhiteListed", () => {
    it("Return True only if all provided keys are whitelisted", () => {
        const data = ["amount","expense_date","description","category"]

        const keys = ["amount", "expense_date", "description", "category"]

        assert.ok(isWhiteListed(keys, data))
    })

    it("Return True only if all provided keys are whitelisted even if fewer keys provided", () => {
        const data = ["amount","expense_date"]

        const keys = ["amount", "expense_date", "description", "category"]

        assert.ok(isWhiteListed(keys, data))
    })

    it("Return False when there are non whitelisted keys", () => {
        const data = ["amount","expense_date","not_real","category"]

        const keys = ["amount", "expense_date", "description", "category"]

        assert.ok(!isWhiteListed(keys, data))
    })

    it("Return False when there are extra data", () => {
        const data = ["amount","expense_date","description","not_real","category"]

        const keys = ["amount", "expense_date", "description", "category"]

        assert.ok(!isWhiteListed(keys, data))
    })
})