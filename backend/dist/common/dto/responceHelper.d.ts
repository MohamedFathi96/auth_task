export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};
export type ApiError = {
    code?: string;
    details?: unknown;
};
export declare class ApiMeta {
    pagination?: PaginationMeta;
    [key: string]: unknown;
}
export type ApiResponse<T = unknown> = {
    success: boolean;
    data: T | null;
    message: string;
    error?: ApiError;
    statusCode: number;
    meta?: ApiMeta;
};
export type SuccessResponse<T = any> = ApiResponse<T> & {
    success: true;
    data: T;
};
export type ErrorResponse = ApiResponse<null> & {
    success: false;
    data: null;
    error: ApiError;
};
export declare class ApiResponseHelper {
    static success<T>(data: T, message?: string, statusCode?: number, meta?: Record<string, unknown>): SuccessResponse<T>;
    static error(message: string, statusCode?: number, errorCode?: string, errorDetails?: unknown, meta?: Record<string, unknown>): ErrorResponse;
    static paginated<T>(data: T, pagination: PaginationMeta, message?: string, statusCode?: number): SuccessResponse<T>;
}
