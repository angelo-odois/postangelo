/**
 * Error Codes System
 * Format: CATEGORY_SUBCATEGORY_ERROR (e.g., AUTH_TOKEN_EXPIRED)
 *
 * Categories:
 * - AUTH (1xxx): Authentication/Authorization errors
 * - USER (2xxx): User-related errors
 * - PAGE (3xxx): Page/Content errors
 * - UPLOAD (4xxx): File upload errors
 * - DB (5xxx): Database errors
 * - VALIDATION (6xxx): Input validation errors
 * - SUBSCRIPTION (7xxx): Subscription/Plan errors
 * - EXTERNAL (8xxx): External service errors
 * - SYSTEM (9xxx): System/Internal errors
 */

export const ErrorCodes = {
  // AUTH (1xxx) - Authentication/Authorization
  AUTH_INVALID_CREDENTIALS: { code: "E1001", message: "Credenciais invalidas", status: 401 },
  AUTH_TOKEN_MISSING: { code: "E1002", message: "Token de autenticacao ausente", status: 401 },
  AUTH_TOKEN_INVALID: { code: "E1003", message: "Token de autenticacao invalido", status: 401 },
  AUTH_TOKEN_EXPIRED: { code: "E1004", message: "Token de autenticacao expirado", status: 401 },
  AUTH_REFRESH_TOKEN_INVALID: { code: "E1005", message: "Refresh token invalido", status: 401 },
  AUTH_REFRESH_TOKEN_EXPIRED: { code: "E1006", message: "Refresh token expirado", status: 401 },
  AUTH_UNAUTHORIZED: { code: "E1007", message: "Acesso nao autorizado", status: 403 },
  AUTH_ADMIN_REQUIRED: { code: "E1008", message: "Acesso restrito a administradores", status: 403 },
  AUTH_SESSION_EXPIRED: { code: "E1009", message: "Sessao expirada", status: 401 },
  AUTH_PASSWORD_WEAK: { code: "E1010", message: "Senha muito fraca", status: 400 },

  // USER (2xxx) - User-related errors
  USER_NOT_FOUND: { code: "E2001", message: "Usuario nao encontrado", status: 404 },
  USER_ALREADY_EXISTS: { code: "E2002", message: "Usuario ja existe", status: 409 },
  USER_EMAIL_TAKEN: { code: "E2003", message: "Email ja esta em uso", status: 409 },
  USER_USERNAME_TAKEN: { code: "E2004", message: "Username ja esta em uso", status: 409 },
  USER_PROFILE_NOT_FOUND: { code: "E2005", message: "Perfil nao encontrado", status: 404 },
  USER_INACTIVE: { code: "E2006", message: "Usuario inativo", status: 403 },
  USER_UPDATE_FAILED: { code: "E2007", message: "Falha ao atualizar usuario", status: 500 },
  USER_DELETE_FAILED: { code: "E2008", message: "Falha ao excluir usuario", status: 500 },

  // PAGE (3xxx) - Page/Content errors
  PAGE_NOT_FOUND: { code: "E3001", message: "Pagina nao encontrada", status: 404 },
  PAGE_SLUG_TAKEN: { code: "E3002", message: "Slug ja esta em uso", status: 409 },
  PAGE_CREATE_FAILED: { code: "E3003", message: "Falha ao criar pagina", status: 500 },
  PAGE_UPDATE_FAILED: { code: "E3004", message: "Falha ao atualizar pagina", status: 500 },
  PAGE_DELETE_FAILED: { code: "E3005", message: "Falha ao excluir pagina", status: 500 },
  PAGE_LIMIT_REACHED: { code: "E3006", message: "Limite de paginas atingido", status: 403 },
  PAGE_TEMPLATE_NOT_FOUND: { code: "E3007", message: "Template de pagina nao encontrado", status: 404 },
  PAGE_BLOCK_INVALID: { code: "E3008", message: "Bloco de conteudo invalido", status: 400 },
  PAGE_CONTENT_TOO_LARGE: { code: "E3009", message: "Conteudo da pagina muito grande", status: 413 },

  // UPLOAD (4xxx) - File upload errors
  UPLOAD_FILE_MISSING: { code: "E4001", message: "Arquivo nao enviado", status: 400 },
  UPLOAD_FILE_TOO_LARGE: { code: "E4002", message: "Arquivo muito grande", status: 413 },
  UPLOAD_FILE_TYPE_INVALID: { code: "E4003", message: "Tipo de arquivo nao permitido", status: 400 },
  UPLOAD_FAILED: { code: "E4004", message: "Falha no upload do arquivo", status: 500 },
  UPLOAD_STORAGE_FULL: { code: "E4005", message: "Espaco de armazenamento esgotado", status: 507 },
  UPLOAD_IMAGE_PROCESSING_FAILED: { code: "E4006", message: "Falha ao processar imagem", status: 500 },
  UPLOAD_DELETE_FAILED: { code: "E4007", message: "Falha ao excluir arquivo", status: 500 },

  // DB (5xxx) - Database errors
  DB_CONNECTION_FAILED: { code: "E5001", message: "Falha na conexao com banco de dados", status: 503 },
  DB_QUERY_FAILED: { code: "E5002", message: "Falha na consulta ao banco de dados", status: 500 },
  DB_TRANSACTION_FAILED: { code: "E5003", message: "Falha na transacao", status: 500 },
  DB_CONSTRAINT_VIOLATION: { code: "E5004", message: "Violacao de restricao do banco", status: 409 },
  DB_ENTITY_NOT_FOUND: { code: "E5005", message: "Registro nao encontrado", status: 404 },
  DB_DUPLICATE_ENTRY: { code: "E5006", message: "Registro duplicado", status: 409 },
  DB_TIMEOUT: { code: "E5007", message: "Tempo limite da consulta excedido", status: 504 },

  // VALIDATION (6xxx) - Input validation errors
  VALIDATION_REQUIRED_FIELD: { code: "E6001", message: "Campo obrigatorio ausente", status: 400 },
  VALIDATION_INVALID_FORMAT: { code: "E6002", message: "Formato invalido", status: 400 },
  VALIDATION_INVALID_EMAIL: { code: "E6003", message: "Email invalido", status: 400 },
  VALIDATION_INVALID_URL: { code: "E6004", message: "URL invalida", status: 400 },
  VALIDATION_STRING_TOO_LONG: { code: "E6005", message: "Texto muito longo", status: 400 },
  VALIDATION_STRING_TOO_SHORT: { code: "E6006", message: "Texto muito curto", status: 400 },
  VALIDATION_INVALID_JSON: { code: "E6007", message: "JSON invalido", status: 400 },
  VALIDATION_INVALID_DATE: { code: "E6008", message: "Data invalida", status: 400 },
  VALIDATION_INVALID_NUMBER: { code: "E6009", message: "Numero invalido", status: 400 },
  VALIDATION_OUT_OF_RANGE: { code: "E6010", message: "Valor fora do intervalo permitido", status: 400 },

  // SUBSCRIPTION (7xxx) - Subscription/Plan errors
  SUBSCRIPTION_PLAN_NOT_FOUND: { code: "E7001", message: "Plano nao encontrado", status: 404 },
  SUBSCRIPTION_LIMIT_REACHED: { code: "E7002", message: "Limite do plano atingido", status: 403 },
  SUBSCRIPTION_FEATURE_UNAVAILABLE: { code: "E7003", message: "Recurso nao disponivel no seu plano", status: 403 },
  SUBSCRIPTION_UPGRADE_REQUIRED: { code: "E7004", message: "Upgrade de plano necessario", status: 403 },
  SUBSCRIPTION_PAYMENT_FAILED: { code: "E7005", message: "Falha no pagamento", status: 402 },
  SUBSCRIPTION_EXPIRED: { code: "E7006", message: "Assinatura expirada", status: 403 },
  SUBSCRIPTION_CANCEL_FAILED: { code: "E7007", message: "Falha ao cancelar assinatura", status: 500 },

  // EXTERNAL (8xxx) - External service errors
  EXTERNAL_SERVICE_UNAVAILABLE: { code: "E8001", message: "Servico externo indisponivel", status: 503 },
  EXTERNAL_API_ERROR: { code: "E8002", message: "Erro na API externa", status: 502 },
  EXTERNAL_TIMEOUT: { code: "E8003", message: "Tempo limite do servico externo", status: 504 },
  EXTERNAL_RATE_LIMITED: { code: "E8004", message: "Limite de requisicoes excedido", status: 429 },
  EXTERNAL_REDIS_ERROR: { code: "E8005", message: "Erro no servico de cache", status: 503 },

  // SYSTEM (9xxx) - System/Internal errors
  SYSTEM_INTERNAL_ERROR: { code: "E9001", message: "Erro interno do servidor", status: 500 },
  SYSTEM_NOT_IMPLEMENTED: { code: "E9002", message: "Funcionalidade nao implementada", status: 501 },
  SYSTEM_MAINTENANCE: { code: "E9003", message: "Sistema em manutencao", status: 503 },
  SYSTEM_RATE_LIMITED: { code: "E9004", message: "Muitas requisicoes. Tente novamente em breve", status: 429 },
  SYSTEM_ROUTE_NOT_FOUND: { code: "E9005", message: "Rota nao encontrada", status: 404 },
  SYSTEM_METHOD_NOT_ALLOWED: { code: "E9006", message: "Metodo nao permitido", status: 405 },
  SYSTEM_RESOURCE_EXHAUSTED: { code: "E9007", message: "Recursos do sistema esgotados", status: 503 },
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

export interface ErrorInfo {
  code: string;
  message: string;
  status: number;
}

export function getErrorInfo(errorCode: ErrorCode): ErrorInfo {
  return ErrorCodes[errorCode];
}
