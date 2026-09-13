export function getErrorMessage(
  error,
  fallbackMessage = "Something went wrong."
) {
  if (!error) {
    return fallbackMessage;
  }

  /*
   * Spring Boot response:
   *
   * {
   *   "message": "Invalid credentials"
   * }
   */
  if (
    error.response?.data?.message
  ) {
    return error.response.data.message;
  }

  /*
   * Validation response:
   *
   * {
   *   "error": "Validation failed"
   * }
   */
  if (
    error.response?.data?.error
  ) {
    return error.response.data.error;
  }

  /*
   * Axios error
   */
  if (error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export function getErrorStatus(
  error
) {
  return (
    error?.response?.status ||
    null
  );
}

export function isUnauthorizedError(
  error
) {
  return (
    getErrorStatus(error) === 401
  );
}

export function isForbiddenError(
  error
) {
  return (
    getErrorStatus(error) === 403
  );
}

export function isNotFoundError(
  error
) {
  return (
    getErrorStatus(error) === 404
  );
}

export function isServerError(
  error
) {
  const status =
    getErrorStatus(error);

  return (
    status !== null &&
    status >= 500
  );
}

export function isNetworkError(
  error
) {
  return (
    !error.response &&
    Boolean(error.request)
  );
}

export function normalizeApiError(
  error,
  fallbackMessage
) {
  return {
    message: getErrorMessage(
      error,
      fallbackMessage
    ),

    status: getErrorStatus(error),

    unauthorized:
      isUnauthorizedError(error),

    forbidden:
      isForbiddenError(error),

    notFound:
      isNotFoundError(error),

    serverError:
      isServerError(error),

    networkError:
      isNetworkError(error),
  };
}