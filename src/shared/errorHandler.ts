export default async <T>(
    fn: () => Promise<T>,
    action: string
): Promise<T | string> =>
    await fn().catch(
        (e) => e?.message ?? `Unexpected Error happend while ${action}`
    );
