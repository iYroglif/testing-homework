const { assert } = require("chai");

describe("Страница с подробной информацией", () => {
    it("должны отображаться название товара, его описание, цена, цвет, материал", async ({
        browser,
    }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.goto("http://localhost:3000/hw/store/catalog/0");

        const firstSelectors = await Promise.all([
            page.waitForSelector(`[data-testid="product-name"]`, { timeout: 5000 }),
            page.waitForSelector(`[data-testid="product-description"]`, { timeout: 5000 }),
            page.waitForSelector(`[data-testid="product-price"]`, { timeout: 5000 }),
            page.waitForSelector(`[data-testid="product-color"]`, { timeout: 5000 }),
            page.waitForSelector(`[data-testid="product-material"]`, { timeout: 5000 }),
        ]);

        firstSelectors.forEach((selector) => assert.ok(selector, "Информация не отобразилась"));

        await page.goto("http://localhost:3000/hw/store/catalog/1");

        const secondSelectors = await Promise.all([
            page.waitForSelector(`[data-testid="product-name"]`, { timeout: 5000 }),
            page.waitForSelector(`[data-testid="product-description"]`, { timeout: 5000 }),
            page.waitForSelector(`[data-testid="product-price"]`, { timeout: 5000 }),
            page.waitForSelector(`[data-testid="product-color"]`, { timeout: 5000 }),
            page.waitForSelector(`[data-testid="product-material"]`, { timeout: 5000 }),
        ]);

        secondSelectors.forEach((selector) => assert.ok(selector, "Информация не отобразилась"));
    });

    it("должна быть кнопка добавить в корзину", async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        const productMock = await browser.mock("**" + "/hw/store/api/products/0", {
            method: "get",
        });
        productMock.respond(
            JSON.stringify({
                id: 0,
                name: "Small Table",
                description:
                    "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients",
                price: 144,
                color: "yellow",
                material: "Rubber",
            })
        );

        await page.goto("http://localhost:3000/hw/store/catalog/0");
        await page.waitForSelector(`[data-testid="add-to-cart-button"]`, { timeout: 5000 });
        await browser.mockRestoreAll();
        await browser.assertView("plain", `[data-testid="add-to-cart-button"]`);
    });
});
