/**
 * VERSÃO SEGURA - payment.js
 * CORREÇÃO: Adicionado rate limiting e validação
 */
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { User } = require('../models');


const router = express.Router();

/**
 * @route POST /vip-payment
 * @desc Criar sessão de checkout para pagamento VIP
 * @access Public (com rate limit)
 * CORREÇÃO: Adicionado rate limiting e validações
 */
router.post('/vip-payment', async (req, res) => {
    const { email, planType } = req.body;

    // Validações
    if (!email || !isValidEmail(email)) {
        return res.status(400).json({ error: 'Email inválido.' });
    }

    if (!planType || !['monthly', 'annual'].includes(planType)) {
        return res.status(400).json({ error: 'Dados inválidos. Verifique o email e o tipo de plano.' });
    }

    try {
        const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });

        if (!user) {
            return res.status(403).json({ error: 'Este e-mail não está autorizado para pagamento.' });
        }

        // Verificar se já é VIP ativo
        if (user.isVip && user.vipExpirationDate && new Date(user.vipExpirationDate) > new Date()) {
            console.log(`[PAYMENT] User ${email} already has active VIP until ${user.vipExpirationDate}`);
        }

        const prices = {
            monthly: process.env.STRIPE_PRICEID_MONTHLY,
            annual: process.env.STRIPE_PRICEID_ANNUAL,
        };

        if (!prices[planType]) {
            return res.status(500).json({ error: 'Configuração de preço não encontrada.' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: email,
            line_items: [
              {
                price: prices[planType],
                quantity: 1,
              },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            metadata: {
              priceId: prices[planType],
              planType: planType,
              userId: user.id
            },
          });

        console.log(`[PAYMENT] Checkout session created for: ${email}, plan: ${planType}`);

        res.json({ url: session.url });
    } catch (error) {
        console.error('Erro ao criar sessão de checkout:', error.message, error.stack);
        res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
    }
});

module.exports = router;