import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Action, applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import { createEpicMiddleware, ofType } from "redux-observable";
import { EMPTY, mergeMapTo, tap } from "rxjs";

import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import { ProductDetails } from "../../src/client/components/ProductDetails";
import { CartApi, ExampleApi } from "../../src/client/api";
import { ApplicationState, EpicDeps, ExampleEpic, createRootReducer } from "../../src/client/store";
import { Product } from "../../src/common/types";

describe("Product", () => {
    it("если товар уже добавлен в корзину, повторное нажатие кнопки добавить в корзину должно увеличить его количество", async () => {
        const basename = "/";
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const product: Product = {
            color: "silver",
            description:
                "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
            id: 0,
            material: "Wooden",
            name: "Ergonomic Ball",
            price: 661,
        };
        const mockEpic: ExampleEpic = (action$, store$, { cart }) =>
            action$.pipe(
                ofType("ADD_TO_CART"),
                tap(() => {
                    cart.setState(store$.value.cart);
                }),
                mergeMapTo(EMPTY)
            );
        const rootReducer: any = createRootReducer({
            cart: cart.getState(),
        });
        const epicMiddleware = createEpicMiddleware<Action, Action, ApplicationState, EpicDeps>({
            dependencies: { api, cart },
        });
        const store = createStore(rootReducer, applyMiddleware(epicMiddleware));

        epicMiddleware.run(mockEpic);

        const productDetails = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <ProductDetails product={product} />
                </Provider>
            </BrowserRouter>
        );

        const { getByTestId } = render(productDetails);

        const addToCartButton = getByTestId("add-to-cart-button");
        const user = userEvent.setup();

        await user.click(addToCartButton);

        expect(cart.getState()).toStrictEqual({
            "0": {
                count: 1,
                name: product.name,
                price: product.price,
            },
        });
    });
});
