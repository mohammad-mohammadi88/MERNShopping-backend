const statusToString = <T extends Record<string, number>>(
    statuses: T,
    status: T[keyof T]
): keyof T | undefined =>
    Object.keys(statuses).find((key) => statuses[key] === status);

export default statusToString;
