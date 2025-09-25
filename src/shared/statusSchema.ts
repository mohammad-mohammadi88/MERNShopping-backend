export default <T extends object>(status: T, defaultParam?: keyof T) => {
    const values = Object.values(status);
    return {
        type: Number,
        enum: values,
        default: defaultParam ? (status[defaultParam] as number) : values[0],
    };
};
