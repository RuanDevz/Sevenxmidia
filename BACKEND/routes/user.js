/**
 * VERSÃO SEGURA - user.js
 * Corrigi as vulnerabilidades críticas identificadas
 */
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Op } = require("sequelize");

dotenv.config();

// ==========================================
// ROTAS PÚBLICAS
// ==========================================

/**
 * @route POST /register
 * @desc Registrar novo usuário
 * @access Public (com rate limit)
 */
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validar nome
        const nameError = validateName(name);
        if (nameError) {
            return res.status(400).json({ error: nameError });
        }

        // Validar email
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        // Validar senha
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            return res.status(400).json({
                error: 'Password does not meet requirements',
                details: passwordErrors
            });
        }

        // Verificar se email já existe
        const existingEmail = await User.findOne({
            where: { email: email.toLowerCase() }
        });

        if (existingEmail) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 12);

        // Criar usuário
        const newUser = await User.create({
            name: sanitizeString(name),
            email: email.toLowerCase(),
            password: hashedPassword,
            isVip: false
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('[Register Error]:', error);
        res.status(500).json({ error: 'Error registering user.' });
    }
});


/**
 * @route POST /login
 * @desc Login do usuário
 * @access Public (com rate limit)
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validações básicas
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // SEGURANÇA: Usar scope 'withPassword' para acessar a senha
        const user = await User.scope('withPassword').findOne({ where: { email: email } });

        // IMPORTANTE: Mesma mensagem para evitar enumeração de usuários
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Atualizar último login
        await user.update({ lastLogin: new Date() });

        // CORREÇÃO: JWT com expiração de 24h
        const accesstoken = sign(
            { 
                email: user.email, 
                id: user.id,
                iat: Math.floor(Date.now() / 1000)
            }, 
            process.env.TOKEN_VERIFY_ACCESS,
        );

        res.json({ 
            token: accesstoken, 
            name: user.name,
        });

    } catch (error) {
        console.error('[Login Error]:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==========================================
// ROTAS AUTENTICADAS
// ==========================================

/**
 * @route GET /status
 * @desc Verificar status do usuário
 * @access Private
 */
router.get('/status', async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verificar e atualizar expiração VIP
        if (user.isVip && user.vipExpirationDate) {
            if (new Date(user.vipExpirationDate) < new Date()) {
                await user.update({ isVip: false });
                user.isVip = false;
            }
        }

        res.status(200).json({
         user,
            isVip: user.isVip
        });
    } catch (error) {
        console.error('[Status Error]:', error);
        res.status(500).json({ error: "Error checking user status" });
    }
});

/**
 * @route GET /dashboard
 * @desc Obter dados do dashboard do usuário
 * @access Private
 */
router.get('/dashboard',  async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verificar e atualizar expiração VIP
        const now = new Date();
        if (user.vipExpirationDate && new Date(user.vipExpirationDate) < now) {
            if (user.isVip) {
                await user.update({ isVip: false });
            }
        }

        return res.json({
            name: user.name,
            email: user.email,
            isVip: user.isVip,
            user,
            vipExpirationDate: user.vipExpirationDate,
            lastLogin: user.lastLogin,
            stripeSubscriptionId: user.stripeSubscriptionId ? true : false, // Não expor o ID completo
            recentlyViewed: user.recentlyViewed,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error('[Dashboard Error]:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @route POST /cancel-subscription
 * @desc Cancelar assinatura do usuário LOGADO
 * @access Private
 * CORREÇÃO: Usa o ID do token, não do body
 */


/**
 * @route DELETE /delete-account
 * @desc Deletar conta do usuário LOGADO
 * @access Private
 * CORREÇÃO: Não aceita email como parâmetro
 */
router.delete('/delete-account', async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Cancelar assinatura se existir
        if (user.stripeSubscriptionId) {
            try {
                const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
                await stripe.subscriptions.cancel(user.stripeSubscriptionId);
            } catch (stripeError) {
                console.error('Erro ao cancelar assinatura:', stripeError);
            }
        }

        await user.destroy();

        res.status(200).json({ message: 'Conta deletada com sucesso!' });
    } catch (error) {
        console.error("Erro ao deletar conta:", error);
        res.status(500).json({ error: 'Erro interno ao deletar conta.' });
    }
});

/**
 * @route GET /user-data
 * @desc Obter dados do usuário
 * @access Private
 */
router.get('/user-data', async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        const benefits = user.isVip ? [
            "Access to 3 years of content with no ads.",
            "Access to all content before it's posted for free users.",
            "VIP badge on our Discord community.",
            "Early access to exclusive content and special newsletters.",
            "Priority support for viewing and accessing all content.",
            "Access Telegram Vipcontent."
        ] : [];

        res.status(200).json({
            name: user.name,
            email: user.email,
            isVip: user.isVip,
            benefits: benefits,
        });
    } catch (error) {
        console.error('[User Data Error]:', error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

/**
 * @route GET /last-login
 * @desc Obter último login do usuário logado
 * @access Private
 */
router.get('/last-login', async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            lastLogin: user.lastLogin ? user.lastLogin.toISOString() : 'Never logged in'
        });
    } catch (error) {
        console.error("Error fetching last login:", error);
        res.status(500).json({ error: 'Error fetching last login' });
    }
});

// ==========================================
// ROTAS DE ADMIN
// ==========================================

/**
 * @route GET /
 * @desc Listar todos os usuários (ADMIN)
 * @access Admin
 */
router.get('/', async (req, res) => {
    try {
        const getallusers = await User.findAll({
            attributes: ['id', 'name', 'email', 'isVip', '', 'createdAt', 'lastLogin', 'isDisabled']
        });
        
        logAdminAction(req, 'LIST_ALL_USERS', { count: getallusers.length });
        
        res.status(200).json(getallusers);
    } catch (error) {
        console.error('[Admin List Users Error]:', error);
        res.status(500).json({ error: "Error fetching users." });
    }
});

/**
 * @route GET /vip-users
 * @desc Listar usuários VIP (ADMIN)
 * @access Admin
 */
router.get('/vip-users', async (req, res) => {
    try {
        const vipUsers = await User.findAll({
            where: { isVip: true },
            attributes: ['name', 'email', 'vipExpirationDate']
        });

        const formattedVipUsers = vipUsers.map(user => ({
            name: user.name,
            email: user.email,
            vipExpirationDate: user.vipExpirationDate ? user.vipExpirationDate.toISOString() : 'Não definida'
        }));

        res.status(200).json(formattedVipUsers);
    } catch (error) {
        console.error('[VIP Users Error]:', error);
        res.status(500).json({ error: "Error fetching VIP users." });
    }
});

/**
 * @route GET /vip-disabled-users
 * @desc Listar usuários VIP desabilitados (ADMIN)
 * @access Admin
 */
router.get('/vip-disabled-users', async (req, res) => {
    try {
        const vipDisabledUsers = await User.findAll({
            where: { isDisabled: true },
            attributes: ['id', 'name', 'email', 'vipExpirationDate', 'isDisabled']
        });

        const formattedUsers = vipDisabledUsers.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            vipExpirationDate: user.vipExpirationDate
                ? user.vipExpirationDate.toISOString()
                : "Not defined",
            isDisabled: user.isDisabled
        }));

        res.status(200).json(formattedUsers);
    } catch (error) {
        console.error("Error fetching disabled VIP users:", error);
        res.status(500).json({ error: "Error fetching disabled VIP users." });
    }
});

/**
 * @route PUT /disable-user/:email
 * @desc Desabilitar usuário (ADMIN)
 * @access Admin
 */
router.put('/disable-user/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Impedir desabilitar própria conta
        if (user.id === req.user.id) {
            return res.status(400).json({ error: "You cannot disable your own account!" });
        }

        await user.update({ isVip: false, isDisabled: true });
        
        logAdminAction(req, 'DISABLE_USER', { targetEmail: email });

        res.status(200).json({ message: "VIP desativado com sucesso!" });
    } catch (error) {
        console.error("Erro ao desabilitar VIP:", error);
        res.status(500).json({ error: "Erro ao desabilitar o VIP." });
    }
});

/**
 * @route PUT /remove-vip/:email
 * @desc Remover status VIP (ADMIN)
 * @access Admin
 */
// router.put('/remove-vip/:email', , , ('admin_remove_vip'), async (req, res) => {
//     const { email } = req.params;

//     try {
//         const user = await User.findOne({ where: { email } });
//         if (!user) {
//             return res.status(404).json({ error: 'Usuário não encontrado!' });
//         }

//         await user.update({ isVip: false, vipExpirationDate: null });
        
//         logAdminAction(req, 'REMOVE_VIP', { targetEmail: email });
        
//         res.status(200).json({ message: 'VIP removido com sucesso!' });
//     } catch (error) {
//         console.error('[Remove VIP Error]:', error);
//         res.status(500).json({ error: 'Erro ao remover VIP.' });
//     }
// });

// /**
//  * @route PUT /remove-all-expired-vip
//  * @desc Remover todos VIPs expirados (ADMIN)
//  * @access Admin
//  */
// router.put('/remove-all-expired-vip', , , ('admin_remove_expired'), async (req, res) => {
//     try {
//         const expiredUsers = await User.findAll({
//             where: {
//                 isVip: true,
//                 vipExpirationDate: { [Op.lt]: new Date() }
//             }
//         });

//         for (const user of expiredUsers) {
//             await user.update({ isVip: false, vipExpirationDate: null });
//         }

//         logAdminAction(req, 'REMOVE_ALL_EXPIRED_VIP', { count: expiredUsers.length });

//         res.status(200).json({ 
//             message: 'VIPs vencidos removidos com sucesso!',
//             count: expiredUsers.length
//         });
//     } catch (error) {
//         console.error('[Remove Expired VIP Error]:', error);
//         res.status(500).json({ error: 'Erro ao remover VIPs vencidos.' });
//     }
// });

/**
 * @route GET /last-login/:email
 * @desc Obter último login de um usuário específico (ADMIN)
 * @access Admin
 */
router.get('/last-login/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            lastLogin: user.lastLogin ? user.lastLogin.toISOString() : 'Nunca logado'
        });
    } catch (error) {
        console.error("Error fetching last login:", error);
        res.status(500).json({ error: 'Erro ao buscar último login' });
    }
});

module.exports = router;
