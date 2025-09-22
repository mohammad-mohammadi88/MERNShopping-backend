import type { Document, Types } from "mongoose";

import type { OrderProductSchema } from "../orders.validate.ts";

type IOrderProduct = OrderProductSchema &
    Document & {
        productID: Types.ObjectId;
        count: number;
    };
export default IOrderProduct;
