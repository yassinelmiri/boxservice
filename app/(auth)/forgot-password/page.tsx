"use client";
import React, { useState, FormEvent } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import pg_auth from "@/public/assets/image/bg_Auth.jpg";
import Image from "next/image";
import Link from "next/link";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";

    try {
      await axios.post(`${apiUrl}/customer/forget-password`, { email });
      setEmailSent(true);
      toast.success("Un email de réinitialisation a été envoyé si l'adresse existe.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      toast.error("Une erreur s'est produite. Veuillez réessayer.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
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
          <h2 className="text-4xl font-bold text-[#dfd750]">Mot de passe oublié</h2>
          <p className="mt-2 text-xl font-bold text-white">
            Entrez votre email pour réinitialiser votre mot de passe
          </p>
        </div>
        
        {emailSent ? (
          <div className="text-center text-white">
            <p>Un email de réinitialisation a été envoyé à {email}.</p>
            <p className="mt-4">Veuillez vérifier votre boîte de réception.</p>
            <Link
              href="/login"
              className="mt-6 inline-block text-sm font-medium text-[#e6e297] hover:text-white"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
            </div>
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9f9911] hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfd750] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
              </motion.button>
              <div className="mt-4 text-center">
                <Link
                  href="/login"
                  className="text-sm font-medium text-white hover:text-[#e6e297]"
                >
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;