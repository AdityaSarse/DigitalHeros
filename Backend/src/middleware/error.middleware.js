/**
 * Global error handling middleware.
 * Must be registered last in the Express app (after all routes).
 */
const errorMiddleware = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

export default errorMiddleware;
