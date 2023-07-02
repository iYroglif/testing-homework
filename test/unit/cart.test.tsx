import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import { Cart } from "../../src/client/pages/Cart";
import { CartApi, ExampleApi } from "../../src/client/api";
import { checkoutComplete, initStore } from "../../src/client/store";
import { CartItem, CartState } from "../../src/common/types";

const basename = "/";

describe("Cart", () => {
    it("если нажать на кнопку очистить корзину то все товары должны удалиться", async () => {
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const cartItem: CartItem = {
            name: "test",
            price: 123,
            count: 1,
        };
        const cartState: CartState = { 0: cartItem };

        cart.setState(cartState);

        const store = initStore(api, cart);
        const cartComponent = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </BrowserRouter>
        );

        const { getByTestId } = render(cartComponent);

        const clearButton = getByTestId("clear-button");

        const user = userEvent.setup();

        await user.click(clearButton);

        expect(cart.getState()).toStrictEqual({});
    });

    it("если получилось сделать заказ то должен отобразиться успешный алерт", () => {
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);
        const cartComponent = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </BrowserRouter>
        );

        const { getByTestId } = render(cartComponent);

        store.dispatch(checkoutComplete(1));

        const clearButton = getByTestId("success-alert");

        expect(clearButton.classList.contains("alert-success")).toBeTruthy();
    });
});
