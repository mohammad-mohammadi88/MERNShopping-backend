export { default as capitalize } from "./capitalize.js";
export { default as defaults } from "./defaults.js";
export { default as errorHandler } from "./errorHandler.js";
export { default as getDecodedName } from "./getDecodedName.js";
export { default as mongooseConnection } from "./mongoose.connection.js";
export { default as redisConnection } from "./redis.js";
export { default as reference } from "./reference.js";
export * from "./schema.js";
export { default as statusSchema } from "./statusSchema.js";
export { default as urlToPublicId } from "./urlToPublicId.js";

// I will use it as `${action}ing`
export type Action = "increas" | "decreas";
