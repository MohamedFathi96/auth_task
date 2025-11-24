import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
    private getExceptionType;
    private handleHttpException;
    private handlePrismaValidationError;
    private handleUnknownError;
    private handlePrismaError;
}
