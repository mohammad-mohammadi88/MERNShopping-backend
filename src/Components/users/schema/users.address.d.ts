import type { Document } from "mongoose";
import type { UserAddressSchema } from "../users.validate.ts";

type IUserAddress = UserAddressSchema & Document;
export default IUserAddress;
