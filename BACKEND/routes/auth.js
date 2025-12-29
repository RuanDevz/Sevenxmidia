const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

// Validações de entrada
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const errors = [];
    if (password.length < 8) errors.push('Minimum 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Must contain uppercase letters');
    if (!/[a-z]/.test(password)) errors.push('Must contain lowercase letters');
    if (!/[0-9]/.test(password)) errors.push('Must contain numbers');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Must contain special characters (!@#$%^&*)');
    return errors;
}

function validateName(name) {
    if (!name || typeof name !== 'string') return 'Invalid name';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.trim().length > 100) return 'Name too long';
    return null;
}

function sanitizeString(str) {
    return str.trim().replace(/[<>]/g, '');
}

/**
 * @route POST /auth/register
 * @desc Registrar novo usuário
 * @access Public
 * @body { name, email, password, confirmPassword }
 */
router.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        // Validações
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        // Validar nome
        const nameError = validateName(name);
        if (nameError) {
            return res.status(400).json({ error: nameError });
        }

        // Validar email
        if (!isValidEmail(email)) {
            return res.status(400).json({
                error: 'Invalid email'
            });
        }

        // Verificar se senhas coincidem
        if (password !== confirmPassword) {
            return res.status(400).json({
                error: 'Passwords do not match'
            });
        }

        // Validar senha
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            return res.status(400).json({
                error: 'Password does not meet requirements',
                requirements: passwordErrors
            });
        }

        // Verificar se email já existe
        const existingUser = await User.findOne({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return res.status(409).json({
                error: 'Email already registered'
            });
        }

        // Hash da senha com salt de 12 rodadas
        const hashedPassword = await bcrypt.hash(password, 12);

        // Criar usuário
        const newUser = await User.create({
            name: sanitizeString(name),
            email: email.toLowerCase(),
            password: hashedPassword,
            isVip: false,
            isAdmin: false
        });

        // Gerar token
        const token = sign(
            { 
                email: newUser.email, 
                id: newUser.id,
                iat: Math.floor(Date.now() / 1000)
            }, 
            process.env.TOKEN_VERIFY_ACCESS
        );

        res.status(201).json({
            message: 'Usuário registrado com sucesso',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                isVip: newUser.isVip,
                isAdmin: newUser.isAdmin
            }
        });

    } catch (error) {
        console.error('[Register Error]:', error);
        res.status(500).json({ 
            error: 'Erro ao registrar usuário' 
        });
    }
});

/**
 * @route POST /auth/login
 * @desc Login do usuário
 * @access Public
 * @body { email, password }
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validações básicas
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email e senha são obrigatórios' 
            });
        }

        // Validar email
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                error: 'Email inválido' 
            });
        }

        // Buscar usuário com scope para acessar password
        const user = await User.scope('withPassword').findOne({ 
            where: { email: email.toLowerCase() } 
        });

        // Mensagem genérica para evitar enumeração de usuários
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ 
                error: 'Email ou senha inválidos' 
            });
        }

        // Atualizar último login
        await user.update({ lastLogin: new Date() });

        // Gerar JWT token com expiração de 24h
        const token = sign(
            { 
                email: user.email, 
                id: user.id,
                iat: Math.floor(Date.now() / 1000)
            }, 
            process.env.TOKEN_VERIFY_ACCESS,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isVip: user.isVip,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.error('[Login Error]:', error);
        res.status(500).json({ 
            error: 'Erro ao fazer login' 
        });
    }
});

/**
 * @route POST /auth/refresh
 * @desc Renovar token JWT
 * @access Private
 * @headers { Authorization: "Bearer token" }
 */
router.post('/refresh', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ 
                error: 'Usuário não encontrado' 
            });
        }

        // Gerar novo token
        const newToken = sign(
            { 
                email: user.email, 
                id: user.id,
                iat: Math.floor(Date.now() / 1000)
            }, 
            process.env.TOKEN_VERIFY_ACCESS,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Token renovado com sucesso',
            token: newToken
        });

    } catch (error) {
        console.error('[Refresh Token Error]:', error);
        res.status(500).json({ 
            error: 'Erro ao renovar token' 
        });
    }
});

/**
 * @route GET /auth/verify
 * @desc Verificar se o token é válido e obter dados do usuário
 * @access Private
 * @headers { Authorization: "Bearer token" }
 */
router.get('/verify', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ 
                error: 'Usuário não encontrado' 
            });
        }

        res.json({
            message: 'Token válido',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isVip: user.isVip,
                isAdmin: user.isAdmin,
                vipExpirationDate: user.vipExpirationDate,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('[Verify Token Error]:', error);
        res.status(500).json({ 
            error: 'Erro ao verificar token' 
        });
    }
});

/**
 * @route POST /auth/logout
 * @desc Logout do usuário (apenas notifica o frontend)
 * @access Private
 */
router.post('/logout', authMiddleware, (req, res) => {
    try {
        // O logout é feito no frontend removendo o token
        // Aqui apenas confirmamos a solicitação
        res.json({
            message: 'Logout realizado com sucesso'
        });
    } catch (error) {
        console.error('[Logout Error]:', error);
        res.status(500).json({ 
            error: 'Erro ao fazer logout' 
        });
    }
});

module.exports = router;
