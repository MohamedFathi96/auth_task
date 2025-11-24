import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseHelper, ErrorResponse } from '../dto/responceHelper';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorResponse: ErrorResponse;

    switch (this.getExceptionType(exception)) {
      case 'HttpException':
        errorResponse = this.handleHttpException(exception as HttpException);
        break;

      case 'PrismaClientKnownRequestError':
        errorResponse = this.handlePrismaError(
          exception as Prisma.PrismaClientKnownRequestError,
        );
        break;

      case 'PrismaClientValidationError':
        errorResponse = this.handlePrismaValidationError(
          exception as Prisma.PrismaClientValidationError,
        );
        break;

      default:
        errorResponse = this.handleUnknownError(exception);
        break;
    }

    this.logger.error(
      `${request.method} ${request.url} - ${errorResponse.statusCode} - ${errorResponse.message}`,
      exception instanceof Error ? exception.stack : exception,
    );

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private getExceptionType(exception: unknown): string {
    if (exception instanceof HttpException) {
      return 'HttpException';
    }
    if (exception && typeof exception === 'object' && 'code' in exception) {
      if (exception instanceof Prisma.PrismaClientKnownRequestError) {
        return 'PrismaClientKnownRequestError';
      }
      if (exception instanceof Prisma.PrismaClientValidationError) {
        return 'PrismaClientValidationError';
      }
    }
    return 'Unknown';
  }

  private handleHttpException(exception: HttpException): ErrorResponse {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;
    let errorDetails: Record<string, any> | null = null;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as Record<string, any>;
      message = responseObj.message || message;
      errorDetails = responseObj;
    }

    return ApiResponseHelper.error(
      message,
      status,
      exception.constructor.name,
      errorDetails,
    );
  }

  private handlePrismaValidationError(
    exception: Prisma.PrismaClientValidationError,
  ): ErrorResponse {
    return ApiResponseHelper.error(
      'Database validation error',
      HttpStatus.BAD_REQUEST,
      'PRISMA_VALIDATION_ERROR',
      exception.message,
    );
  }

  private handleUnknownError(exception: unknown): ErrorResponse {
    this.logger.error('Unhandled exception:', exception);
    return ApiResponseHelper.error(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
      'INTERNAL_ERROR',
      process.env.NODE_ENV === 'development' ? exception : undefined,
    );
  }

  private handlePrismaError(
    exception: Prisma.PrismaClientKnownRequestError,
  ): ErrorResponse {
    switch (exception.code) {
      case 'P2002': {
        // Unique constraint violation
        const field = exception.meta?.target as string[] | undefined;
        const fieldName = field?.[0] || 'field';
        return ApiResponseHelper.error(
          `${fieldName} already exists`,
          HttpStatus.CONFLICT,
          'UNIQUE_CONSTRAINT_VIOLATION',
          exception.meta,
        );
      }
      case 'P2025':
        // Record not found
        return ApiResponseHelper.error(
          'Record not found',
          HttpStatus.NOT_FOUND,
          'RECORD_NOT_FOUND',
          exception.meta,
        );
      case 'P2003':
        // Foreign key constraint violation
        return ApiResponseHelper.error(
          'Foreign key constraint violation',
          HttpStatus.BAD_REQUEST,
          'FOREIGN_KEY_CONSTRAINT',
          exception.meta,
        );
      case 'P2014':
        // Required relation violation
        return ApiResponseHelper.error(
          'Required relation missing',
          HttpStatus.BAD_REQUEST,
          'REQUIRED_RELATION_VIOLATION',
          exception.meta,
        );
      default:
        return ApiResponseHelper.error(
          'Database error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          'DATABASE_ERROR',
          exception.meta,
        );
    }
  }
}
