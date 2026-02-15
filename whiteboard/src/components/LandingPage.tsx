import React from 'react';
import { motion } from 'framer-motion';
import keycloak from '../keycloak';

const LandingPage: React.FC = () => {
    const handleLogin = () => {
        keycloak.login();
    };

    const handleSignup = () => {
        keycloak.register();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    const features = [
        {
            title: "Real-time Sync",
            description: "See changes instantly as your team draws. Zero lag, pure collaboration.",
            icon: "⚡",
        },
        {
            title: "Secure Login",
            description: "Enterprise-grade security powered by Keycloak. Your data is safe with us.",
            icon: "🔒",
        },
        {
            title: "Easy Sharing",
            description: "Create a session, share the ID, and start collaborating in seconds.",
            icon: "🚀",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="px-6 py-6 md:px-12 border-b border-slate-200"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="text-2xl md:text-3xl font-bold text-slate-900">
                        Dentrite
                    </div>
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSignup}
                            className="px-6 py-2.5 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:border-slate-400 hover:bg-slate-50 transition-colors duration-200"
                        >
                            Sign Up
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogin}
                            className="px-6 py-2.5 rounded-lg bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors duration-200 shadow-sm"
                        >
                            Login
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="px-6 md:px-12 py-20 md:py-32"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Left Column: Hero Text */}
                        <motion.div variants={itemVariants} className="space-y-8">
                            <motion.h1
                                variants={itemVariants}
                                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-slate-900"
                            >
                                Collaborate & Create
                                <br />
                                <span className="text-primary-600">in Real-Time</span>
                            </motion.h1>
                            
                            <motion.p
                                variants={itemVariants}
                                className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl"
                            >
                                Unleash your team's creativity with our secure, real-time whiteboard.
                                Brainstorm, design, and plan together, no matter where you are.
                            </motion.p>
                            
                            <motion.div variants={itemVariants}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleLogin}
                                    className="px-8 py-4 rounded-lg bg-primary-500 text-white font-semibold text-lg hover:bg-primary-600 transition-colors duration-200 shadow-sm"
                                >
                                    Start Whiteboarding →
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        {/* Right Column: Demo Card */}
                        <motion.div
                            variants={itemVariants}
                            className="relative"
                        >
                            <motion.div
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white border border-slate-200 rounded-xl p-8 md:p-10 shadow-sm"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                        <span className="text-xl">🔓</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">
                                        Try the Demo
                                    </h3>
                                </div>
                                
                                <p className="text-slate-600 mb-6 text-sm md:text-base">
                                    Use these credentials to test collaboration features in different browsers.
                                </p>
                                
                                <div className="space-y-4">
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-slate-50 border border-slate-200 rounded-lg p-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-xl">
                                                👤
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-slate-900 mb-1">User 1 (Host)</div>
                                                <div className="text-sm text-slate-600 space-x-4">
                                                    <span>User: <code className="text-primary-600 font-mono bg-primary-50 px-1.5 py-0.5 rounded">test</code></span>
                                                    <span>Pass: <code className="text-primary-600 font-mono bg-primary-50 px-1.5 py-0.5 rounded">password</code></span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-slate-50 border border-slate-200 rounded-lg p-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-xl">
                                                👤
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-slate-900 mb-1">User 2 (Guest)</div>
                                                <div className="text-sm text-slate-600 space-x-4">
                                                    <span>User: <code className="text-primary-600 font-mono bg-primary-50 px-1.5 py-0.5 rounded">test2</code></span>
                                                    <span>Pass: <code className="text-primary-600 font-mono bg-primary-50 px-1.5 py-0.5 rounded">password2</code></span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="px-6 md:px-12 py-20 md:py-32 bg-slate-50"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={itemVariants}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                            Powerful Features
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Everything you need for seamless collaboration
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white border border-slate-200 rounded-xl p-8 hover:border-primary-300 transition-colors duration-200 shadow-sm"
                            >
                                <div className="w-14 h-14 rounded-lg bg-primary-100 flex items-center justify-center text-2xl mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="px-6 md:px-12 py-8 border-t border-slate-200"
            >
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-slate-500 text-sm">
                        Copyright © Dentrite 2025
                    </p>
                </div>
            </motion.footer>
        </div>
    );
};

export default LandingPage;
