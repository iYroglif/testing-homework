import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import { Cart } from "../../src/client/pages/Cart";
import { CartApi, ExampleApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";
import { CartItem, CartState } from "../../src/common/types";
import { FormProps } from "../../src/client/components/Form";

const checkoutFormData = {
    name: "test",
    phone: "89999999999",
    address: "a",
};

jest.mock("../../src/client/components/Form", () => ({
    Form: ({ onSubmit }: FormProps) => (
        <button onClick={() => onSubmit(checkoutFormData)} data-testid="checkout-button"></button>
    ),
}));

describe("Shopping cart", () => {
    it("если нажать на кнопку checkout то происходит отправка запроса с заказом на сервер", async () => {
        const basename = "/";
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

        const apiCheckoutSpy = jest.spyOn(api, "checkout");
        const checkoutButton = getByTestId("checkout-button");
        const user = userEvent.setup();

        await user.click(checkoutButton);

        expect(apiCheckoutSpy).toBeCalledWith(checkoutFormData, cartState);
    });
});
