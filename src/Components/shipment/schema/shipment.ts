import { Schema } from "mongoose";

import type { IOrder } from "@Order/index.js";
import { reference, statusSchema } from "@Shared";
import type { IUser } from "@User/index.js";
import shipmentStatus from "../shipment.status.js";
import type IShipment from "./shipment.d.js";

export { type IShipment };
export interface FullShipment extends Omit<IShipment, "user" | "order"> {
    user: IUser;
    order: IOrder;
}

const selectedDate = {
    type: Date,
    required: true,
    validate: {
        validator: function (this: { selectedDate: Date }) {
            const expireDate = new Date(this.selectedDate).getTime();
            const now = new Date(Date.now()).getTime();
            if (now < expireDate) return true;
            return false;
        },
        message: ({ value }: { value: Date }) =>
            `${new Date(
                value
            ).toISOString()} is passed and cannot be used as selectedDate`,
    },
};
const shipmentSchema = new Schema<IShipment>(
    {
        user: reference("User"),
        order: reference("Order"),
        selectedDate,
        deliveredAt: { type: Date, default: null },
        note: { type: String, required: false },
        status: statusSchema(shipmentStatus),
    },
    { timestamps: true }
);
export default shipmentSchema;
