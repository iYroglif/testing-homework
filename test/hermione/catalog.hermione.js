const { assert } = require("chai");

describe("Страница с каталогом", () => {
    it("должны отображаться товары, список которых приходит с сервера", async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await browser.setWindowSize(1920, 4000);
        await page.goto("http://localhost:3000/hw/store/catalog");

        const selectorsPromise = [];

        for (let i = 0; i < 27; i++) {
            selectorsPromise.push(page.waitForSelector(`[data-testid="${i}"]`, { timeout: 5000 }));
        }

        const selectors = await Promise.all(selectorsPromise);

        assert.equal(selectors.length, 27, "Должен прийти весь список товаров с сервера");
    });

    it("должны для каждого товара отображаться название, цена и ссылка на страницу с подробной информацией о товаре", async ({
        browser,
    }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await browser.setWindowSize(1920, 4000);
        await page.goto("http://localhost:3000/hw/store/catalog");

        const selectorsName = [];
        const selectorsPrice = [];
        const selectorsLink = [];

        for (let i = 0; i < 27; i++) {
            selectorsName.push(
                await page.waitForSelector(`[data-testid="product-name-${i}"]`, { timeout: 5000 })
            );
            selectorsPrice.push(
                await page.waitForSelector(`[data-testid="product-price-${i}"]`, { timeout: 5000 })
            );
            selectorsLink.push(
                await page.waitForSelector(`[data-testid="product-link-${i}"]`, { timeout: 5000 })
            );
        }

        const numNames = await Promise.all(
            selectorsName.map((selector) => page.evaluate((el) => el.textContent, selector))
        ).then((texts) => texts.filter(Boolean).length);

        const numPrices = await Promise.all(
            selectorsPrice.map((selector) => page.evaluate((el) => el.textContent, selector))
        ).then((texts) => texts.filter(Boolean).length);

        const numLinks = await Promise.all(
            selectorsLink.map((selector) => page.evaluate((el) => el.textContent, selector))
        ).then((texts) => texts.filter(Boolean).length);

        assert.equal(numNames, 27, "Для каждого товара должно отображаться название");
        assert.equal(numPrices, 27, "Для каждого товара должна отображаться цена");
        assert.equal(numLinks, 27, "Для каждого товара должна отображаться ссылка");
    });
});
