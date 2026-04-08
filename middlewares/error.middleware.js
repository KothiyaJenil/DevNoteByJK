export const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error"
  const error = err.error || "backend error"

  return res.status(status).json({success: false, message, error});
}