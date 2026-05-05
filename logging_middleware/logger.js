const logger = (req, res, next) => {
    const start = Date.now();

    const oldSend = res.send;

    let responseData;

    res.send = function (data) {
        responseData = data;
        return oldSend.apply(res, arguments);
    };

    res.on("finish", () => {
        const duration = Date.now() - start;

        console.log("========== API LOG ==========");
        console.log("Time:", new Date().toISOString());
        console.log("Method:", req.method);
        console.log("URL:", req.originalUrl);
        console.log("Request Body:", req.body);
        console.log("Status Code:", res.statusCode);
        console.log("Response:", responseData);
        console.log("Response Time:", duration + "ms");
        console.log("=============================\n");
    });

    next();
};

export default logger;