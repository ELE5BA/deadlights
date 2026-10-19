export function notFoundHandler(_request, response) {
  response.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'That resource was not found.' } });
}

export function errorHandler(error, _request, response, _next) {
  console.error('Unhandled server error:', error.message);
  response.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please ask the booth operator.' } });
}
