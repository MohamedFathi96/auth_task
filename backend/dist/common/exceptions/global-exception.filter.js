"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const responceHelper_1 = require("../dto/responceHelper");
const client_1 = require("@prisma/client");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let errorResponse;
        switch (this.getExceptionType(exception)) {
            case 'HttpException':
                errorResponse = this.handleHttpException(exception);
                break;
            case 'PrismaClientKnownRequestError':
                errorResponse = this.handlePrismaError(exception);
                break;
            case 'PrismaClientValidationError':
                errorResponse = this.handlePrismaValidationError(exception);
                break;
            default:
                errorResponse = this.handleUnknownError(exception);
                break;
        }
        this.logger.error(`${request.method} ${request.url} - ${errorResponse.statusCode} - ${errorResponse.message}`, exception instanceof Error ? exception.stack : exception);
        response.status(errorResponse.statusCode).json(errorResponse);
    }
    getExceptionType(exception) {
        if (exception instanceof common_1.HttpException) {
            return 'HttpException';
        }
        if (exception && typeof exception === 'object' && 'code' in exception) {
            if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                return 'PrismaClientKnownRequestError';
            }
            if (exception instanceof client_1.Prisma.PrismaClientValidationError) {
                return 'PrismaClientValidationError';
            }
        }
        return 'Unknown';
    }
    handleHttpException(exception) {
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        let message = exception.message;
        let errorDetails = null;
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const responseObj = exceptionResponse;
            message = responseObj.message || message;
            errorDetails = responseObj;
        }
        return responceHelper_1.ApiResponseHelper.error(message, status, exception.constructor.name, errorDetails);
    }
    handlePrismaValidationError(exception) {
        return responceHelper_1.ApiResponseHelper.error('Database validation error', common_1.HttpStatus.BAD_REQUEST, 'PRISMA_VALIDATION_ERROR', exception.message);
    }
    handleUnknownError(exception) {
        this.logger.error('Unhandled exception:', exception);
        return responceHelper_1.ApiResponseHelper.error('Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_ERROR', process.env.NODE_ENV === 'development' ? exception : undefined);
    }
    handlePrismaError(exception) {
        switch (exception.code) {
            case 'P2002': {
                const field = exception.meta?.target;
                const fieldName = field?.[0] || 'field';
                return responceHelper_1.ApiResponseHelper.error(`${fieldName} already exists`, common_1.HttpStatus.CONFLICT, 'UNIQUE_CONSTRAINT_VIOLATION', exception.meta);
            }
            case 'P2025':
                return responceHelper_1.ApiResponseHelper.error('Record not found', common_1.HttpStatus.NOT_FOUND, 'RECORD_NOT_FOUND', exception.meta);
            case 'P2003':
                return responceHelper_1.ApiResponseHelper.error('Foreign key constraint violation', common_1.HttpStatus.BAD_REQUEST, 'FOREIGN_KEY_CONSTRAINT', exception.meta);
            case 'P2014':
                return responceHelper_1.ApiResponseHelper.error('Required relation missing', common_1.HttpStatus.BAD_REQUEST, 'REQUIRED_RELATION_VIOLATION', exception.meta);
            default:
                return responceHelper_1.ApiResponseHelper.error('Database error', common_1.HttpStatus.INTERNAL_SERVER_ERROR, 'DATABASE_ERROR', exception.meta);
        }
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map