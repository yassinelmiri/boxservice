'use client';

import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Send, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormStatus {
  submitted: boolean;
  error: boolean;
  message: string;
}

interface OfficeLocation {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [formStatus, setFormStatus] = useState<FormStatus>({
    submitted: false,
    error: false,
    message: "",
  });

  const [isVisible, setIsVisible] = useState({
    hero: false,
    form: false,
    offices: false,
    map: false
  });

  useEffect(() => {
    setIsVisible({
      hero: true,
      form: true,
      offices: true,
      map: true
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu"}/users/contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      setFormStatus({
        submitted: true,
        error: false,
        message: "Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

    } catch (error) {
      setFormStatus({
        submitted: true,
        error: true,
        message: "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer plus tard.",
      });
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const officeLocations: OfficeLocation[] = [
    {
      name: "Saint-Martin-d'Ary",
      address: "Bordeaux, France",
      phone: "097 222 4661",
      email: "contact@box-service.eu",
      hours: "Lun-Ven: 9h-18h, Sam: 10h-16h",
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-grow pt-16">
        <motion.section
          className="bg-gradient-to-r from-[#9f9911] to-[#525008] text-white py-24 relative overflow-hidden"
          initial="hidden"
          animate={isVisible.hero ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[#363504] opacity-10"></div>
            <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-[#dfd750] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -top-48 -right-48 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.h1
              className="text-5xl font-bold mb-6 sm:text-6xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Contactez-nous
            </motion.h1>
            <motion.p
              className="text-xl max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Notre équipe est à votre disposition pour répondre à toutes vos
              questions
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <a
                href="#contact-form"
                className="inline-flex items-center px-6 py-3 bg-white text-[#6e6a0c] font-medium rounded-full hover:bg-[#f9f8e6] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Contacter maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </motion.div>
          </div>
        </motion.section>
        <section className="py-24 bg-white" id="contact-form">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-50"
                initial="hidden"
                animate={isVisible.form ? "visible" : "hidden"}
                variants={fadeIn}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Envoyez-nous un message
                </h2>

                {formStatus.submitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-lg mb-6 text-sm font-medium ${formStatus.error
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-green-50 text-green-800 border border-green-200"
                      }`}
                  >
                    {formStatus.message}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      variants={itemFadeIn}
                    >
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Nom complet *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all outline-none"
                      />
                    </motion.div>
                    <motion.div
                      variants={itemFadeIn}
                    >
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all outline-none"
                      />
                    </motion.div>
                  </div>
                  <motion.div variants={itemFadeIn}>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all outline-none"
                    />
                  </motion.div>
                  <motion.div variants={itemFadeIn}>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all outline-none"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="reservation">Réservation de box</option>
                      <option value="info">Demande d'information</option>
                      <option value="support">Support technique</option>
                      <option value="partnership">Partenariat</option>
                      <option value="other">Autre</option>
                    </select>
                  </motion.div>
                  <motion.div variants={itemFadeIn}>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfd750] focus:border-[#dfd750] transition-all outline-none"
                    ></textarea>
                  </motion.div>
                  <motion.div
                    className="flex items-start"
                    variants={itemFadeIn}
                  >
                    <input
                      id="privacy"
                      name="privacy"
                      type="checkbox"
                      required
                      className="h-5 w-5 text-[#9f9911] focus:ring-[#dfd750] border-gray-300 rounded mt-1"
                    />
                    <label
                      htmlFor="privacy"
                      className="ml-3 block text-sm text-gray-700"
                    >
                      J'accepte que mes données soient traitées conformément à la{" "}
                      <Link
                        href="/privacy"
                        className="text-[#9f9911] hover:underline"
                      >
                        politique de confidentialité
                      </Link>
                    </label>
                  </motion.div>
                  <motion.button
                    type="submit"
                    className="w-full flex justify-center items-center px-6 py-4 bg-[#9f9911] text-white font-semibold rounded-lg hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-[#dfd750] focus:ring-offset-2 transition-all transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    variants={itemFadeIn}
                    whileHover={{ scale: isLoading ? 1 : 1.03 }}
                    whileTap={{ scale: isLoading ? 1 : 0.97 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
              <motion.div
                initial="hidden"
                animate={isVisible.offices ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Nos bureaux
                </h2>

                <div className="space-y-8">
                  {officeLocations.map((office, index) => (
                    <motion.div
                      key={index}
                      className="bg-white rounded-lg shadow-lg p-6 border border-gray-50 transform transition-all hover:shadow-xl hover:-translate-y-1"
                      variants={itemFadeIn}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {office.name}
                      </h3>
                      <div className="space-y-4 text-gray-600">
                        <div className="flex items-start group">
                          <MapPin
                            size={20}
                            className="text-[#9f9911] mr-3 flex-shrink-0 mt-1 group-hover:text-[#525008] transition-colors"
                          />
                          <span className="group-hover:text-gray-900 transition-colors">{office.address}</span>
                        </div>
                        <div className="flex items-center group">
                          <Phone
                            size={20}
                            className="text-[#9f9911] mr-3 flex-shrink-0 group-hover:text-[#525008] transition-colors"
                          />
                          <a
                            href={`tel:${office.phone.replace(/\s/g, "")}`}
                            className="hover:text-[#9f9911] transition-colors"
                          >
                            {office.phone}
                          </a>
                        </div>
                        <div className="flex items-center group">
                          <Mail
                            size={20}
                            className="text-[#9f9911] mr-3 flex-shrink-0 group-hover:text-[#525008] transition-colors"
                          />
                          <a
                            href={`mailto:${office.email}`}
                            className="hover:text-[#9f9911] transition-colors"
                          >
                            {office.email}
                          </a>
                        </div>
                        <div className="flex items-center group">
                          <Clock
                            size={20}
                            className="text-[#9f9911] mr-3 flex-shrink-0 group-hover:text-[#525008] transition-colors"
                          />
                          <span className="group-hover:text-gray-900 transition-colors">{office.hours}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-8 bg-gradient-to-r from-[#9f9911] to-[#9f9911] rounded-lg p-6 shadow-md"
                  variants={itemFadeIn}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Service client
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Notre service client est disponible 24h/24 et 7j/7 pour
                    répondre à vos questions.
                  </p>
                  <div className="flex items-center bg-white p-3 rounded-lg shadow-sm transform transition-all hover:shadow hover:-translate-y-1">
                    <Phone size={20} className="text-[#9f9911] mr-3" />
                    <a
                      href="tel:(+33) 972 22 4661"
                      className="text-lg font-semibold text-[#9f9911] hover:text-[#525008] transition-colors"
                    >
                      097 222 4661
                    </a>
                    <span className="ml-2 text-sm text-gray-500">
                      (Appel gratuit)
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
        <motion.section
          className="py-16 bg-gray-50"
          initial="hidden"
          animate={isVisible.map ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Localisez nos centres
            </h2>
            <motion.div
              className="bg-white rounded-lg shadow-xl overflow-hidden relative group cursor-pointer"
              style={{ height: "500px" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <a
                href="https://maps.app.goo.gl/K4CfsFeKJdr3BWXo7"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full relative"
              >
                <Image
                  src="/assets/image/contact.png"
                  alt="Localisation de nos centres"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/95 rounded-full px-6 py-3 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <MapPin className="text-[#9f9911]" size={24} />
                    <span className="text-gray-900 font-semibold">
                      Ouvrir dans Google Maps
                    </span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-[#9f9911] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 animate-pulse">
                  <MapPin size={16} />
                  <span>Cliquez pour ouvrir</span>
                </div>
              </a>
            </motion.div>
          </div>
        </motion.section>
        <style jsx global>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </main>
    </div>
  );
};

export default Contact;