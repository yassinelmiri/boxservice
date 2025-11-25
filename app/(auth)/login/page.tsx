"use client";
import React, { useState, FormEvent } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import pg_auth from "@/public/assets/image/bg_Auth.jpg";
import Image from "next/image";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";
  
    try {
      const response = await axios.post<{ access_token: string }>(
        `${apiUrl}/customer/login-customer`,
        {
          email,
          password,
        }
      );
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      // Ajouter le rôle 'customer' dans le cookie
      document.cookie = `token=${access_token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `role=customer; path=/; max-age=${60 * 60 * 24 * 7}`;
  
      window.location.href = "/account";
    } catch (err) {
      toast.error("Invalid email or password. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${pg_auth.src})` }}
    >
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white/40 backdrop-blur-sm rounded-lg shadow-2xl"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#dfd750]">Bienvenue</h2>
          <p className="mt-2 text-xl font-bold text-gray-500">
            Veuillez vous connecter pour continuer
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm bg-white/50"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Mot de passe
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#dfd750] focus:border-[#dfd750] sm:text-sm bg-white/50"
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19.5c-5.523 0-10-4.477-10-10 0-1.61.378-3.133 1.05-4.475M9.878 9.878a3 3 0 104.243 4.243M15 15l5 5M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c1.614 0 3.14.385 4.5 1.07M21.542 12.001C20.268 16.058 16.477 19 12 19c-1.614 0-3.14-.385-4.5-1.07M15 15l5 5M3 3l18 18"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-[#9f9911] focus:ring-[#dfd750] border-gray-300 rounded"
              />
              <label
                htmlFor="remember_me"
                className="block ml-2 text-sm text-white"
              >
                Se souvenir de moi
              </label>
            </div>
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9f9911] hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfd750]"
            >
              Se connecter
            </motion.button>
            {/* Ajout du lien Mot de passe oublié */}
            <div className="mt-4 text-center">
              <a
                href="/forgot-password"
                className="text-sm font-medium text-white hover:text-[#e6e297]"
              >
                Mot de passe oublié ?
              </a>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
