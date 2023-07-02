const { assert } = require("chai");

describe("Страница корзины", () => {
    it("если сделать заказ то должен прийти валидный номер заказа", async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.goto("http://localhost:3000/hw/store/cart");

        const response = await page.evaluate(async () => {
            const checkoutFormData = {
                name: "test",
                phone: "89999999999",
                address: "a",
            };
            const cartItem = {
                name: "test",
                price: 123,
                count: 1,
            };
            const data = {
                form: checkoutFormData,
                cart: {
                    0: cartItem,
                },
            };

            const res = await fetch("http://localhost:3000/hw/store/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            return res.json();
        });

        assert.isBelow(response.id, 1e12, "Id заказа должен быть валидным");
    });
});
