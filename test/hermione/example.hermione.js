const { assert } = require("chai");

describe("Верстка", () => {
    it("в шапке должны отображаться ссылки на страницы магазина а также ссылка на корзину", async ({
        browser,
    }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.goto("http://localhost:3000/hw/store/");

        await page.waitForSelector(`[data-testid="nav-menu"]`, {
            timeout: 5000,
        });

        await browser.assertView("plain", `[data-testid="nav-menu"]`);
    });

    it("должно закрываться меню при выборе эелемента из гамбургера", async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await browser.setWindowSize(570, 1080);
        await page.goto("http://localhost:3000/hw/store/delivery");

        const menuButton = await page.waitForSelector(`[data-testid="nav-menu-button"]`, {
            timeout: 5000,
        });

        await menuButton.click();
        await browser.pause(1000);
        await browser.assertView("open", `[data-testid="nav-menu"]`);

        const menuItem = await page.waitForSelector("a.nav-link", { timeout: 5000 });

        await menuItem.click();
        await browser.pause(1000);

        const isMenuDisplayed = await page.$eval(
            `[data-testid="nav-menu"]`,
            (el) => el.offsetParent !== null
        );

        assert.isFalse(isMenuDisplayed, "Меню должно закрыться после клика");
    });
});
