import express from 'express';

function loggingMiddleware(req, res, next) {
    const startTime = Date.now();

    // Log request
    console.log(`Request: ${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
        const processTime = (Date.now() - startTime) / 1000;
        // Log response
        console.log(`Response: ${res.statusCode} - Processed in ${processTime.toFixed(2)}s`);
    });

    next();
}

export default loggingMiddleware;
