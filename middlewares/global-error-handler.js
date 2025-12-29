const globalErrorHandler = (err, req, res, next) => {

    const statusCode=err.statusCode || 500;
    const message = err.message || "something went wrong";
    res.status(statusCode)
        .json({
            success: false,
            message: message
        });
}