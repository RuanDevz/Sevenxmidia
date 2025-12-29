const { verify } = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware de autenticação JWT
 * Verifica se o token é válido e extrai as informações do usuário
 */
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token not provided' });
        }

        const decoded = verify(token, process.env.TOKEN_VERIFY_ACCESS);
        
        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authMiddleware;
