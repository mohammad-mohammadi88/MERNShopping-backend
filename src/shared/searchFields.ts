export default <T>(fields: (keyof T)[], query: string) =>
    (fields as unknown[] as string[]).map((field) => ({
        [field]: new RegExp(query, "img"),
    }));
