import type { Document } from "mongoose";

import type { UserAddressSchema } from "../users.validate.js";

type IUserAddress = UserAddressSchema & Document;
export default IUserAddress;
