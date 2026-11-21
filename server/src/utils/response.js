/**
 * Unified API Response Envelope
 */
export function apiSuccess(res, data = null, message = "Success", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

export function apiError(res, message = "An unexpected error occurred", statusCode = 500, details = null, code = "INTERNAL_SERVER_ERROR") {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      details
    },
    timestamp: new Date().toISOString()
  });
}
