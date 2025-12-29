import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Check } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, loading, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        match: false
    });

    // Redirecionar se já estiver autenticado
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const validatePasswordRequirements = (password, confirmPassword) => {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password),
            match: password === confirmPassword && password.length > 0
        };
        setPasswordRequirements(requirements);
        return Object.values(requirements).every(v => v);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = {
            ...formData,
            [name]: value
        };
        setFormData(newFormData);
        setError("");

        // Validar requisitos de senha
        if (name === "password" || name === "confirmPassword") {
            validatePasswordRequirements(newFormData.password, newFormData.confirmPassword);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validações básicas
        if (!formData.name.trim()) {
            setError("Nome é obrigatório");
            return;
        }

        if (!formData.email.trim()) {
            setError("Email é obrigatório");
            return;
        }

        if (!formData.password.trim()) {
            setError("Senha é obrigatória");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        // Verificar requisitos da senha
        if (!Object.values(passwordRequirements).every(v => v)) {
            setError("A senha não atende a todos os requisitos");
            return;
        }

        const result = await register(
            formData.name,
            formData.email,
            formData.password,
            formData.confirmPassword
        );

        if (result.success) {
            navigate("/");
        } else {
            setError(result.error);
        }
    };

    const allRequirementsMet = Object.values(passwordRequirements).every(v => v);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-2">
                    <div className="p-8">
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold mb-2">Registre-se</h1>
                            <p className="text-muted-foreground">
                                Crie uma conta para começar
                            </p>
                        </div>

                        {/* Alert de Erro */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6"
                            >
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}

                        {/* Formulário */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nome */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    Nome Completo
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Seu nome"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-full"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-full"
                                    required
                                />
                            </div>

                            {/* Senha */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? "Ocultar" : "Mostrar"}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar Senha */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                                    Confirmar Senha
                                </label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? "Ocultar" : "Mostrar"}
                                    </button>
                                </div>
                            </div>

                            {/* Requisitos de Senha */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-secondary/50 p-4 rounded-lg space-y-2"
                            >
                                <p className="text-xs font-medium text-muted-foreground">
                                    Requisitos da senha:
                                </p>
                                <div className="space-y-1 text-sm">
                                    <RequirementItem
                                        met={passwordRequirements.length}
                                        text="Mínimo 8 caracteres"
                                    />
                                    <RequirementItem
                                        met={passwordRequirements.uppercase}
                                        text="Letras maiúsculas"
                                    />
                                    <RequirementItem
                                        met={passwordRequirements.lowercase}
                                        text="Letras minúsculas"
                                    />
                                    <RequirementItem
                                        met={passwordRequirements.number}
                                        text="Números"
                                    />
                                    <RequirementItem
                                        met={passwordRequirements.special}
                                        text="Caracteres especiais (!@#$%^&*)"
                                    />
                                    <RequirementItem
                                        met={passwordRequirements.match}
                                        text="Senhas coincidem"
                                    />
                                </div>
                            </motion.div>

                            {/* Botão Registrar */}
                            <Button
                                type="submit"
                                className="w-full mt-6"
                                disabled={loading || !allRequirementsMet}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Registrando...
                                    </>
                                ) : (
                                    "Registrar"
                                )}
                            </Button>
                        </form>

                        {/* Links */}
                        <div className="mt-6 space-y-3 text-center text-sm">
                            <p className="text-muted-foreground">
                                Já tem conta?{" "}
                                <Link
                                    to="/login"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Faça login aqui
                                </Link>
                            </p>
                            <p>
                                <Link
                                    to="/"
                                    className="text-primary hover:underline"
                                >
                                    Voltar para home
                                </Link>
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Informações de segurança */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-center text-xs text-muted-foreground"
                >
                    <p>
                        Ao se registrar, você concorda com nossa{" "}
                        <a href="#" className="hover:underline">
                            Política de Privacidade
                        </a>
                        {" "}e{" "}
                        <a href="#" className="hover:underline">
                            Termos de Serviço
                        </a>
                        .
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

const RequirementItem = ({ met, text }) => (
    <div className="flex items-center gap-2">
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                met
                    ? "bg-green-500/20 text-green-600"
                    : "bg-muted text-muted-foreground"
            }`}
        >
            {met && <Check className="w-3 h-3" />}
        </motion.div>
        <span className={met ? "text-foreground" : "text-muted-foreground"}>
            {text}
        </span>
    </div>
);

export default RegisterPage;
