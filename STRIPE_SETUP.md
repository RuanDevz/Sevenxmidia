# Instruções para Configurar o Stripe

## Passo 1: Obter suas Chaves da API Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/register) e crie uma conta (se ainda não tiver)
2. Após fazer login, vá para [API Keys](https://dashboard.stripe.com/test/apikeys)
3. Você verá duas chaves:
   - **Publishable key** (pk_test_...) - NÃO é necessária para este projeto
   - **Secret key** (sk_test_...) - ⚠️ ESTA é a que você precisa!

## Passo 2: Adicionar a Chave no Arquivo .env

1. Abra o arquivo `/app/backend/.env`
2. Substitua a linha:
   ```
   STRIPE_API_KEY=
   ```
   
   Por (usando sua chave real que começa com sk_test_ ou sk_live_):
   ```
   STRIPE_API_KEY=SUA_CHAVE_AQUI
   ```

3. Salve o arquivo

## Passo 3: Reiniciar o Backend

Execute no terminal:
```bash
sudo supervisorctl restart backend
```

## Passo 4: Testar o Pagamento

1. Acesse o site
2. Clique em qualquer plano de assinatura
3. Use o cartão de teste da Stripe:
   - **Número do cartão**: `4242 4242 4242 4242`
   - **Data de validade**: Qualquer data futura (ex: 12/30)
   - **CVC**: Qualquer 3 dígitos (ex: 123)
   - **CEP**: Qualquer código postal

4. Complete o pagamento
5. Você será redirecionado de volta ao site com status de sucesso!

## Webhook (Opcional para Produção)

Para ambientes de produção, configure o webhook:

1. Vá para [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Clique em "Add endpoint"
3. Cole a URL: `https://seu-dominio.com/api/webhook/stripe`
4. Selecione o evento: `checkout.session.completed`
5. Copie o **Signing secret** (que começa com whsec_)
6. Adicione no `/app/backend/.env`:
   ```
   STRIPE_WEBHOOK_SECRET=SEU_WEBHOOK_SECRET_AQUI
   ```

## Cartões de Teste Adicionais

- **Sucesso**: 4242 4242 4242 4242
- **Recusado**: 4000 0000 0000 0002
- **Autenticação requerida**: 4000 0025 0000 3155

## Troubleshooting

### "Payment failed" ou erro 401
- Verifique se a chave começa com sk_test_ ou sk_live_
- Certifique-se de não ter espaços antes ou depois da chave
- Reinicie o backend após modificar o .env

### Checkout não abre
- Verifique se o backend está rodando: `sudo supervisorctl status backend`
- Veja os logs: `tail -f /var/log/supervisor/backend.err.log`

### Status de pagamento não atualiza
- Aguarde alguns segundos, o sistema faz polling automático
- Verifique a conexão com o MongoDB

## Produção (Modo Live)

Para usar em produção:
1. Ative sua conta Stripe completando o processo de verificação
2. Use as chaves LIVE (começam com sk_live_) em vez das de teste
3. Configure o webhook para a URL de produção
4. Teste tudo novamente antes de lançar!

## Suporte

Se tiver problemas, verifique:
- [Documentação Stripe](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- Logs do backend: `/var/log/supervisor/backend.err.log`
