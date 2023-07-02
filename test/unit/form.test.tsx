import React from "react";

import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import { Form } from "../../src/client/components/Form";

describe("Form", () => {
    it("если ввести валидные данные формы то по клику на кнопку checkout сработает отправка формы (submit)", async () => {
        const onSubmitStub = jest.fn();

        const { getByLabelText, getByTestId } = render(<Form onSubmit={onSubmitStub} />);

        const checkoutFormData = {
            name: "test",
            phone: "89999999999",
            address: "a",
        };

        const nameInput = getByLabelText("Name");
        const phoneInput = getByLabelText("Phone");
        const addressInput = getByLabelText("Address");
        const checkoutButton = getByTestId("checkout-button");

        const user = userEvent.setup();

        await user.type(nameInput, checkoutFormData.name);
        await user.type(phoneInput, checkoutFormData.phone);
        await user.type(addressInput, checkoutFormData.address);
        await user.click(checkoutButton);

        expect(onSubmitStub).toBeCalledWith(checkoutFormData);
    });
});
