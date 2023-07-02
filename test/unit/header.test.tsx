import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { render } from "@testing-library/react";

import { Application } from "../../src/client/Application";
import { CartApi, ExampleApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";

describe("Header", () => {
    it("название магазина в шапке должно быть ссылкой на главную", async () => {
        const basename = "/";
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);
        const applicationComponent = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const { getByTestId } = render(applicationComponent);

        const headerTitle = getByTestId("header-title");

        expect(headerTitle.tagName).toBe("A");
        expect(headerTitle.getAttribute("href")).toBe("/");
    });
});
