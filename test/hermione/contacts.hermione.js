describe("Страница контактов", () => {
    it("должна содержать статичное содержимое", async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.goto("http://localhost:3000/hw/store/contacts");

        await page.waitForSelector(".Contacts", {
            timeout: 5000,
        });

        await browser.assertView("plain", ".Contacts");
    });
});
