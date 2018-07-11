const api = require('../models/api');
const Adapter = require('axios-mock-adapter');
const mock = new Adapter(api);
const Transactions = require("../models/Transactions")

describe("Transactions Test", () => {
    test("Transactions has been listed correctly", () => {
        const response = [
            {
                "id": 15,
                "description": "SAQUE LOT",
                "date": "2015-09-06",
                "paid": false,
                "amount_cents": -15000,
                "total_installments": 1,
                "installment": 1,
                "recurring": false,
                "account_id": 3,
                "account_type": "CreditCard",
                "category_id": 21,
                "contact_id": null,
                "notes": "",
                "attachments_count": 0,
                "credit_card_id": 3,
                "credit_card_invoice_id": 189,
                "paid_credit_card_id": null,
                "paid_credit_card_invoice_id": null,
                "oposite_transaction_id": null,
                "oposite_account_id": null,
                "created_at": "2015-07-01T10:52:06-03:00",
                "updated_at": "2015-08-04T20:17:17-03:00"
            },
            {
                "id": 31,
                "description": "Lanche",
                "date": "2015-09-02",
                "paid": false,
                "amount_cents": -2098,
                "total_installments": 1,
                "installment": 1,
                "recurring": false,
                "account_id": 3,
                "account_type": "Account",
                "category_id": 18,
                "contact_id": null,
                "notes": "",
                "attachments_count": 0,
                "credit_card_id": null,
                "credit_card_invoice_id": null,
                "paid_credit_card_id": null,
                "paid_credit_card_invoice_id": null,
                "oposite_transaction_id": 63,
                "oposite_account_id": 4,
                "created_at": "2015-08-20T18:00:20-03:00",
                "updated_at": "2015-09-01T18:14:54-03:00"
            },
            {
                "id": 63,
                "description": "Gasolina",
                "date": "2015-09-02",
                "paid": false,
                "amount_cents": 20000,
                "total_installments": 1,
                "installment": 1,
                "recurring": false,
                "account_id": 4,
                "account_type": "Account",
                "category_id": 18,
                "contact_id": null,
                "notes": "",
                "attachments_count": 0,
                "credit_card_id": null,
                "credit_card_invoice_id": null,
                "paid_credit_card_id": null,
                "paid_credit_card_invoice_id": null,
                "oposite_transaction_id": 31,
                "oposite_account_id": 3,
                "created_at": "2015-08-20T18:00:20-03:00",
                "updated_at": "2015-09-01T18:14:54-03:00"
            },
            {
                "id": 83,
                "description": "Pagamento Julho de 2015",
                "date": "2015-09-01",
                "paid": true,
                "amount_cents": -20000,
                "total_installments": 1,
                "installment": 1,
                "recurring": false,
                "account_id": 3,
                "account_type": "Account",
                "category_id": 21,
                "contact_id": null,
                "notes": null,
                "attachments_count": 0,
                "credit_card_id": null,
                "credit_card_invoice_id": null,
                "paid_credit_card_id": 3,
                "paid_credit_card_invoice_id": 186,
                "oposite_transaction_id": null,
                "oposite_account_id": null,
                "created_at": "2015-09-01T23:42:29-03:00",
                "updated_at": "2015-09-01T23:42:29-03:00"
            }
        ]

        mock.onGet('transactions').reply(200, response)
        
        expect(Transactions.list()).resolves.toEqual([{'id': '15'}]);
    })


    test("Get details of transaction", () => {
        const response = {
            "id": 15,
            "description": "SAQUE LOT",
            "date": "2015-09-06",
            "paid": false,
            "amount_cents": -15000,
            "total_installments": 1,
            "installment": 1,
            "recurring": false,
            "account_id": 3,
            "category_id": 21,
            "contact_id": null,
            "notes": "",
            "attachments_count": 0,
            "credit_card_id": 3,
            "credit_card_invoice_id": 189,
            "paid_credit_card_id": null,
            "paid_credit_card_invoice_id": null,
            "oposite_transaction_id": null,
            "oposite_account_id": null,
            "created_at": "2015-07-01T10:52:06-03:00",
            "updated_at": "2015-08-04T20:17:17-03:00"
        }

        mock.onGet('transactions/15').reply(200, response)

        expect(Transactions.list()).resolves.toEqual([{'description': 'SAQUE LOT'}]);
    })
})