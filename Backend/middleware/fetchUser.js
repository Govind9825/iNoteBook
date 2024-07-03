const jwt = require('jsonwebtoken');
const JWT_sign = "IhavesignedyourEntryy";

const fetchUser = (req, res, next) => {
    const token = req.header('Auth-token');
    if (!token) {
        return res.status(401).send({ error: "No token, authorization denied" });
    }
    try {
        const data = jwt.verify(token, JWT_sign);
        req.user = data.user;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).send({ error: "Token is not valid" });
    }
}

module.exports = fetchUser;
