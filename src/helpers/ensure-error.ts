export function ensureError(value: unknown): Error {
    if (value instanceof Error) return value;

    let stringified = "[Unable to stringify the thrown value]";
    try {
        stringified = JSON.stringify(value);
    } catch {
        /* empty */
    }

    return new Error(`Error thrown: ${stringified}`);
}
