import type { Document } from "mongoose";

import type { UserAddressSchema } from "../user.validate.js";

type IUserAddress = UserAddressSchema & Document;
export default IUserAddress;
