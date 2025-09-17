type Result<T> = {
    status: number;
    error?: string;
    data?: NonNullable<T>;
};
interface Options {
    notFoundError?: string;
    successStatus?: number;
}
export default async <T>(
    fn: () => Promise<T>,
    action: string,
    {
        notFoundError = `No result found while ${action}`,
        successStatus = 200,
    }: Options = {}
): Promise<Result<T>> => {
    try {
        const result = await fn();
        if (!result) {
            return {
                error: notFoundError,
                status: 404,
            };
        }
        return { data: result, status: successStatus };
    } catch (e: any) {
        return {
            error: e?.message ?? `Unexpected error happened while ${action}`,
            status: 500,
        };
    }
};
