export type ToolResponse<T> =
    | {
        result: T;
        isError: false;
        error: null;
    }
    | {
        result: null;
        isError: true;
        error: string;
    };
