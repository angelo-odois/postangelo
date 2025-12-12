import { Request, Response, NextFunction } from "express";
import { ErrorCodes, ErrorCode, ErrorInfo, getErrorInfo } from "../errors/codes.js";

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: string;
  public readonly requestId?: string;

  constructor(
    errorCode: ErrorCode,
    options?: {
      message?: string;
      details?: Record<string, unknown>;
      requestId?: string;
    }
  ) {
    const errorInfo = getErrorInfo(errorCode);
    const message = options?.message || errorInfo.message;

    super(message);

    this.code = errorInfo.code;
    this.statusCode = errorInfo.status;
    this.isOperational = true;
    this.details = options?.details;
    this.timestamp = new Date().toISOString();
    this.requestId = options?.requestId;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details }),
        ...(this.requestId && { requestId: this.requestId }),
        timestamp: this.timestamp,
      },
    };
  }
}

// Quick error creation helpers
export const Errors = {
  // Auth
  invalidCredentials: (details?: Record<string, unknown>) =>
    new AppError("AUTH_INVALID_CREDENTIALS", { details }),
  tokenMissing: () =>
    new AppError("AUTH_TOKEN_MISSING"),
  tokenInvalid: () =>
    new AppError("AUTH_TOKEN_INVALID"),
  tokenExpired: () =>
    new AppError("AUTH_TOKEN_EXPIRED"),
  unauthorized: (message?: string) =>
    new AppError("AUTH_UNAUTHORIZED", { message }),
  adminRequired: () =>
    new AppError("AUTH_ADMIN_REQUIRED"),

  // User
  userNotFound: (userId?: string) =>
    new AppError("USER_NOT_FOUND", { details: userId ? { userId } : undefined }),
  userAlreadyExists: (email?: string) =>
    new AppError("USER_ALREADY_EXISTS", { details: email ? { email } : undefined }),
  emailTaken: (email: string) =>
    new AppError("USER_EMAIL_TAKEN", { details: { email } }),
  usernameTaken: (username: string) =>
    new AppError("USER_USERNAME_TAKEN", { details: { username } }),
  profileNotFound: () =>
    new AppError("USER_PROFILE_NOT_FOUND"),

  // Page
  pageNotFound: (pageId?: string) =>
    new AppError("PAGE_NOT_FOUND", { details: pageId ? { pageId } : undefined }),
  slugTaken: (slug: string) =>
    new AppError("PAGE_SLUG_TAKEN", { details: { slug } }),
  pageLimitReached: (limit: number, current: number) =>
    new AppError("PAGE_LIMIT_REACHED", {
      message: `Limite de ${limit} paginas atingido. Voce tem ${current} paginas.`,
      details: { limit, current }
    }),
  templateNotFound: (templateId?: string) =>
    new AppError("PAGE_TEMPLATE_NOT_FOUND", { details: templateId ? { templateId } : undefined }),

  // Upload
  fileMissing: () =>
    new AppError("UPLOAD_FILE_MISSING"),
  fileTooLarge: (maxSize: string) =>
    new AppError("UPLOAD_FILE_TOO_LARGE", {
      message: `Arquivo muito grande. Tamanho maximo: ${maxSize}`,
      details: { maxSize }
    }),
  invalidFileType: (allowedTypes: string[]) =>
    new AppError("UPLOAD_FILE_TYPE_INVALID", {
      message: `Tipo de arquivo nao permitido. Tipos aceitos: ${allowedTypes.join(", ")}`,
      details: { allowedTypes }
    }),
  uploadFailed: (reason?: string) =>
    new AppError("UPLOAD_FAILED", { details: reason ? { reason } : undefined }),

  // Validation
  requiredField: (field: string) =>
    new AppError("VALIDATION_REQUIRED_FIELD", {
      message: `Campo obrigatorio: ${field}`,
      details: { field }
    }),
  invalidFormat: (field: string, expected?: string) =>
    new AppError("VALIDATION_INVALID_FORMAT", {
      message: expected ? `Formato invalido para ${field}. Esperado: ${expected}` : `Formato invalido para ${field}`,
      details: { field, expected }
    }),
  invalidEmail: (email?: string) =>
    new AppError("VALIDATION_INVALID_EMAIL", { details: email ? { email } : undefined }),
  stringTooLong: (field: string, maxLength: number) =>
    new AppError("VALIDATION_STRING_TOO_LONG", {
      message: `${field} muito longo. Maximo: ${maxLength} caracteres`,
      details: { field, maxLength }
    }),

  // Subscription
  planNotFound: (plan?: string) =>
    new AppError("SUBSCRIPTION_PLAN_NOT_FOUND", { details: plan ? { plan } : undefined }),
  limitReached: (feature: string, limit: number) =>
    new AppError("SUBSCRIPTION_LIMIT_REACHED", {
      message: `Limite de ${feature} atingido (${limit})`,
      details: { feature, limit }
    }),
  featureUnavailable: (feature: string, requiredPlan: string) =>
    new AppError("SUBSCRIPTION_FEATURE_UNAVAILABLE", {
      message: `${feature} disponivel apenas no plano ${requiredPlan} ou superior`,
      details: { feature, requiredPlan }
    }),
  upgradeRequired: (currentPlan: string, requiredPlan: string) =>
    new AppError("SUBSCRIPTION_UPGRADE_REQUIRED", {
      details: { currentPlan, requiredPlan }
    }),

  // Database
  dbConnectionFailed: () =>
    new AppError("DB_CONNECTION_FAILED"),
  dbQueryFailed: (operation?: string) =>
    new AppError("DB_QUERY_FAILED", { details: operation ? { operation } : undefined }),
  entityNotFound: (entity: string, id?: string) =>
    new AppError("DB_ENTITY_NOT_FOUND", {
      message: `${entity} nao encontrado`,
      details: { entity, id }
    }),
  duplicateEntry: (field: string, value?: string) =>
    new AppError("DB_DUPLICATE_ENTRY", {
      message: `${field} ja existe`,
      details: { field, value }
    }),

  // System
  internalError: (message?: string) =>
    new AppError("SYSTEM_INTERNAL_ERROR", { message }),
  notImplemented: (feature?: string) =>
    new AppError("SYSTEM_NOT_IMPLEMENTED", { details: feature ? { feature } : undefined }),
  routeNotFound: (method: string, path: string) =>
    new AppError("SYSTEM_ROUTE_NOT_FOUND", {
      message: `Rota ${method} ${path} nao encontrada`,
      details: { method, path }
    }),
  rateLimited: (retryAfter?: number) =>
    new AppError("SYSTEM_RATE_LIMITED", {
      details: retryAfter ? { retryAfter } : undefined
    }),
};

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

// Log formatter for structured logging
function formatErrorLog(
  error: Error | AppError,
  req: Request,
  requestId: string
): Record<string, unknown> {
  const isAppError = error instanceof AppError;

  return {
    timestamp: new Date().toISOString(),
    requestId,
    level: isAppError && error.statusCode < 500 ? "warn" : "error",
    code: isAppError ? error.code : "E9001",
    message: error.message,
    statusCode: isAppError ? error.statusCode : 500,
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      userId: (req as any).user?.userId,
    },
    ...(isAppError && error.details && { details: error.details }),
    ...(!isAppError && process.env.NODE_ENV !== "production" && { stack: error.stack }),
  };
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = (req as any).requestId || generateRequestId();

  // Log the error with structured format
  const logEntry = formatErrorLog(err, req, requestId);
  console.error(JSON.stringify(logEntry));

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && process.env.NODE_ENV !== "production" && { details: err.details }),
        requestId,
        timestamp: err.timestamp,
      },
    });
    return;
  }

  // Handle unknown errors
  const systemError = ErrorCodes.SYSTEM_INTERNAL_ERROR;
  res.status(500).json({
    error: {
      code: systemError.code,
      message: process.env.NODE_ENV === "production"
        ? systemError.message
        : err.message,
      requestId,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    },
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  const requestId = generateRequestId();
  const error = Errors.routeNotFound(req.method, req.originalUrl);

  console.warn(JSON.stringify({
    timestamp: new Date().toISOString(),
    requestId,
    level: "warn",
    code: error.code,
    message: error.message,
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    },
  }));

  res.status(404).json({
    error: {
      code: error.code,
      message: error.message,
      requestId,
      timestamp: new Date().toISOString(),
    },
  });
}

// Middleware to add request ID to all requests
export function requestIdMiddleware(req: Request, _res: Response, next: NextFunction): void {
  (req as any).requestId = generateRequestId();
  next();
}

export function asyncHandler<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
