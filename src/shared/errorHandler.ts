export type Result<T> =
    | {
          data: NonNullable<T>;
          status: number;
          error?: undefined;
      }
    | {
          status: number;
          data?: undefined;
          error: string;
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
        const error =
            typeof e === "string"
                ? e
                : e instanceof Error
                ? e?.message
                : `Unexpected error happened while ${action}`;
        return {
            error,
            status: 500,
        };
    }
};
