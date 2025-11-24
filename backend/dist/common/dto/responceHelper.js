"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseHelper = exports.ApiMeta = void 0;
class ApiMeta {
    pagination;
}
exports.ApiMeta = ApiMeta;
class ApiResponseHelper {
    static success(data, message = "Operation completed successfully", statusCode = 200, meta) {
        return {
            success: true,
            data,
            message,
            statusCode,
            meta,
        };
    }
    static error(message, statusCode = 500, errorCode, errorDetails, meta) {
        return {
            success: false,
            data: null,
            message,
            error: {
                code: errorCode,
                details: errorDetails,
            },
            statusCode,
            meta,
        };
    }
    static paginated(data, pagination, message = "Data retrieved successfully", statusCode = 200) {
        return {
            success: true,
            data,
            message,
            statusCode,
            meta: {
                pagination,
            },
        };
    }
}
exports.ApiResponseHelper = ApiResponseHelper;
//# sourceMappingURL=responceHelper.js.map