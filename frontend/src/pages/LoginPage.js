import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, loading, error, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [localError, setLocalError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Redirecionar se já estiver autenticado
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setLocalError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password.trim()) {
            setLocalError("Email e senha são obrigatórios");
            return;
        }

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate("/");
        }
    };

    const displayError = localError || error;

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
                            <h1 className="text-3xl font-bold mb-2">Login</h1>
                            <p className="text-muted-foreground">
                                Entre em sua conta para continuar
                            </p>
                        </div>

                        {/* Alert de Erro */}
                        {displayError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6"
                            >
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{displayError}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}

                        {/* Formulário */}
                        <form onSubmit={handleSubmit} className="space-y-4">
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

                            {/* Botão Login */}
                            <Button
                                type="submit"
                                className="w-full mt-6"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Entrando...
                                    </>
                                ) : (
                                    "Entrar"
                                )}
                            </Button>
                        </form>

                        {/* Links */}
                        <div className="mt-6 space-y-3 text-center text-sm">
                            <p className="text-muted-foreground">
                                Não tem conta?{" "}
                                <Link
                                    to="/register"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Registre-se aqui
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
                        Este site é protegido por reCAPTCHA e a{" "}
                        <a href="#" className="hover:underline">
                            Política de Privacidade
                        </a>
                        {" "}e os{" "}
                        <a href="#" className="hover:underline">
                            Termos de Serviço
                        </a>
                        {" "}se aplicam.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
