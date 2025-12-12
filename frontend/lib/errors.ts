/**
 * Frontend Error Handling Utilities
 * Matches backend error codes for consistent error handling
 */

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId?: string;
  timestamp: string;
}

export interface APIErrorResponse {
  error: APIError;
}

// Error code categories for frontend handling
export const ErrorCategories = {
  AUTH: "E1",      // Authentication errors (E1xxx)
  USER: "E2",      // User errors (E2xxx)
  PAGE: "E3",      // Page errors (E3xxx)
  UPLOAD: "E4",    // Upload errors (E4xxx)
  DB: "E5",        // Database errors (E5xxx)
  VALIDATION: "E6", // Validation errors (E6xxx)
  SUBSCRIPTION: "E7", // Subscription errors (E7xxx)
  EXTERNAL: "E8",  // External service errors (E8xxx)
  SYSTEM: "E9",    // System errors (E9xxx)
} as const;

// User-friendly error messages by code
export const ErrorMessages: Record<string, string> = {
  // Auth
  E1001: "Email ou senha incorretos",
  E1002: "Voce precisa estar logado para acessar esta pagina",
  E1003: "Sua sessao e invalida. Por favor, faca login novamente",
  E1004: "Sua sessao expirou. Por favor, faca login novamente",
  E1005: "Token de atualizacao invalido",
  E1006: "Token de atualizacao expirado",
  E1007: "Voce nao tem permissao para acessar este recurso",
  E1008: "Esta acao e restrita a administradores",
  E1009: "Sessao expirada. Por favor, faca login novamente",
  E1010: "A senha e muito fraca. Use pelo menos 6 caracteres",

  // User
  E2001: "Usuario nao encontrado",
  E2002: "Este usuario ja existe",
  E2003: "Este email ja esta em uso",
  E2004: "Este username ja esta em uso",
  E2005: "Perfil nao encontrado",
  E2006: "Conta desativada. Entre em contato com o suporte",
  E2007: "Erro ao atualizar usuario",
  E2008: "Erro ao excluir usuario",

  // Page
  E3001: "Pagina nao encontrada",
  E3002: "Este slug ja esta em uso",
  E3003: "Erro ao criar pagina",
  E3004: "Erro ao atualizar pagina",
  E3005: "Erro ao excluir pagina",
  E3006: "Voce atingiu o limite de paginas do seu plano",
  E3007: "Template nao encontrado",
  E3008: "Conteudo invalido",
  E3009: "O conteudo e muito grande",

  // Upload
  E4001: "Nenhum arquivo foi enviado",
  E4002: "O arquivo e muito grande",
  E4003: "Tipo de arquivo nao permitido",
  E4004: "Erro ao fazer upload do arquivo",
  E4005: "Espaco de armazenamento esgotado",
  E4006: "Erro ao processar imagem",
  E4007: "Erro ao excluir arquivo",

  // Database
  E5001: "Erro de conexao com o servidor",
  E5002: "Erro ao processar sua solicitacao",
  E5003: "Erro na transacao",
  E5004: "Dados conflitantes",
  E5005: "Registro nao encontrado",
  E5006: "Este registro ja existe",
  E5007: "Tempo limite excedido",

  // Validation
  E6001: "Campo obrigatorio nao preenchido",
  E6002: "Formato invalido",
  E6003: "Email invalido",
  E6004: "URL invalida",
  E6005: "Texto muito longo",
  E6006: "Texto muito curto",
  E6007: "JSON invalido",
  E6008: "Data invalida",
  E6009: "Numero invalido",
  E6010: "Valor fora do intervalo permitido",

  // Subscription
  E7001: "Plano nao encontrado",
  E7002: "Limite do plano atingido",
  E7003: "Recurso nao disponivel no seu plano",
  E7004: "Faca upgrade do seu plano para continuar",
  E7005: "Erro no pagamento",
  E7006: "Sua assinatura expirou",
  E7007: "Erro ao cancelar assinatura",

  // External
  E8001: "Servico temporariamente indisponivel",
  E8002: "Erro ao conectar com servico externo",
  E8003: "Tempo limite do servico externo",
  E8004: "Muitas requisicoes. Tente novamente em alguns minutos",
  E8005: "Erro no servico de cache",

  // System
  E9001: "Erro interno. Por favor, tente novamente",
  E9002: "Funcionalidade em desenvolvimento",
  E9003: "Sistema em manutencao",
  E9004: "Muitas requisicoes. Aguarde um momento",
  E9005: "Rota nao encontrada",
  E9006: "Metodo nao permitido",
  E9007: "Sistema sobrecarregado. Tente novamente",
};

/**
 * Parse API error response into a standardized error object
 */
export function parseAPIError(error: unknown): APIError {
  // If it's already an APIError
  if (isAPIError(error)) {
    return error;
  }

  // If it's a fetch response with error
  if (error && typeof error === "object" && "error" in error) {
    const apiError = (error as APIErrorResponse).error;
    return {
      code: apiError.code || "E9001",
      message: apiError.message || "Erro desconhecido",
      details: apiError.details,
      requestId: apiError.requestId,
      timestamp: apiError.timestamp || new Date().toISOString(),
    };
  }

  // If it's a regular Error
  if (error instanceof Error) {
    return {
      code: "E9001",
      message: error.message || "Erro interno",
      timestamp: new Date().toISOString(),
    };
  }

  // Unknown error type
  return {
    code: "E9001",
    message: "Erro desconhecido",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Check if an object is an APIError
 */
export function isAPIError(obj: unknown): obj is APIError {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "code" in obj &&
    "message" in obj
  );
}

/**
 * Get a user-friendly message for an error code
 */
export function getErrorMessage(code: string): string {
  return ErrorMessages[code] || "Ocorreu um erro. Por favor, tente novamente.";
}

/**
 * Get error category from code
 */
export function getErrorCategory(code: string): string | null {
  const prefix = code.substring(0, 2);
  const category = Object.entries(ErrorCategories).find(
    ([_, value]) => value === prefix
  );
  return category ? category[0] : null;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(code: string): boolean {
  return code.startsWith(ErrorCategories.AUTH);
}

/**
 * Check if error is a validation error
 */
export function isValidationError(code: string): boolean {
  return code.startsWith(ErrorCategories.VALIDATION);
}

/**
 * Check if error requires user to upgrade plan
 */
export function isUpgradeRequired(code: string): boolean {
  return code === "E7002" || code === "E7003" || code === "E7004";
}
