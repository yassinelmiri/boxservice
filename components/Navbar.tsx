'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/public/assets/image/logo.png";
import { FiLogIn, FiLogOut, FiUser } from "react-icons/fi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [servicesTimeout, setServicesTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      const accountPopupInterval = setInterval(() => {
        setShowAccountPopup(true);
        setTimeout(() => {
          setShowAccountPopup(false);
        }, 5000);
      }, 5 * 60 * 1000);

      return () => clearInterval(accountPopupInterval);
    } else {
      const loginPopupInterval = setInterval(() => {
        setShowLoginPopup(true);
        setTimeout(() => {
          setShowLoginPopup(false);
        }, 5000);
      }, 5 * 60 * 1000);

      return () => clearInterval(loginPopupInterval);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  const handleServicesMouseEnter = () => {
    if (servicesTimeout) {
      clearTimeout(servicesTimeout);
      setServicesTimeout(null);
    }
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsServicesOpen(false);
    }, 300);
    setServicesTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    if (servicesTimeout) {
      clearTimeout(servicesTimeout);
      setServicesTimeout(null);
    }
  };

  const handleDropdownMouseLeave = () => {
    setIsServicesOpen(false);
  };

  const toggleServicesDropdown = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const closeServicesDropdown = () => {
    setIsServicesOpen(false);
  };
  
  const navAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const menuItemAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const dropdownAnimation = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.55, 0.085, 0.68, 0.53] as const
      }
    }
  };

  const mobileMenuAnimation = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.55, 0.085, 0.68, 0.53] as const
      }
    }
  };

  const popupAnimation = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.55, 0.085, 0.68, 0.53] as const
      }
    }
  };

  const linkVariants = {
    initial: { color: "" },
    hover: {
      color: "#9f9911",
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || pathname !== "/"
          ? "bg-white shadow-md text-gray-800"
          : "bg-white shadow-md text-gray-800"
          }`}
        initial="hidden"
        animate="visible"
        variants={navAnimation}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/">
                <img src={logo.src} alt="Logo" className="h-[70px] w-auto" />
              </Link>
            </motion.div>

            {/* Navigation desktop */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <motion.div
                  variants={linkVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Link
                    href="/"
                    className={`font-medium transition-colors ${pathname === "/" ? "text-[#9f9911] font-semibold" : ""
                      }`}
                  >
                    Accueil
                  </Link>
                </motion.div>

                <motion.div
                  variants={linkVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Link
                    href="/how-it-works"
                    className={`font-medium transition-colors ${pathname === "/how-it-works"
                      ? "text-[#9f9911] font-semibold"
                      : ""
                      }`}
                  >
                    Comment ça marche
                  </Link>
                </motion.div>
                <motion.div
                  variants={linkVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Link
                    href="/pricing"
                    className={`font-medium transition-colors ${pathname === "/pricing" ? "text-[#9f9911] font-semibold" : ""
                      }`}
                  >
                    Tarifs
                  </Link>
                </motion.div>
                <div
                  className="relative"
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <motion.button
                    onClick={toggleServicesDropdown}
                    className="flex items-center font-medium transition-colors"
                    variants={linkVariants}
                    initial="initial"
                    whileHover="hover"
                  >
                    Services
                    <motion.div
                      animate={{ rotate: isServicesOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={16} className="ml-1" />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.div
                        className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownAnimation}
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                      >
                        <div className="py-2">
                          <motion.div
                            variants={menuItemAnimation}
                            initial="hidden"
                            animate="visible"
                            custom={0}
                          >
                            <Link
                              href="/search"
                              onClick={() => {
                                closeServicesDropdown();
                                closeMenu();
                              }}
                              className="block px-4 py-2 text-gray-800 hover:bg-[#f9f8e6] hover:text-[#9f9911] transition-colors"
                            >
                              Stockage / Boxes
                            </Link>
                          </motion.div>

                          <motion.div
                            variants={menuItemAnimation}
                            initial="hidden"
                            animate="visible"
                            custom={1}
                          >
                            <Link
                              href="/storage-calculator"
                              onClick={() => {
                                closeServicesDropdown();
                                closeMenu();
                              }}
                              className="block px-4 py-2 text-gray-800 hover:bg-[#f9f8e6] hover:text-[#9f9911] transition-colors"
                            >
                              Calculateur D'espace
                            </Link>
                          </motion.div>

                          <motion.div
                            variants={menuItemAnimation}
                            initial="hidden"
                            animate="visible"
                            custom={2}
                          >
                            <Link
                              href="/"
                              onClick={() => {
                                closeServicesDropdown();
                                closeMenu();
                              }}
                              className="block px-4 py-2 text-gray-800 hover:bg-[#f9f8e6] hover:text-[#9f9911] transition-colors"
                            >
                              Foire aux questions
                            </Link>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.div
                  variants={linkVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Link
                    href="/investisser"
                    className={`font-medium transition-colors ${pathname === "/investisser" ? "text-[#9f9911] font-semibold" : ""
                      }`}
                  >
                    Investisseur
                  </Link>
                </motion.div>
                <motion.div
                  variants={linkVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Link
                    href="/contact"
                    className={`font-medium transition-colors ${pathname === "/contact" ? "text-[#9f9911] font-semibold" : ""
                      }`}
                  >
                    Contact
                  </Link>
                </motion.div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <Link href="/account" passHref>
                    <motion.div
                      className="flex items-center gap-2 bg-[#e2e3f8] text-black px-4 py-2 rounded-lg hover:bg-[#6e6a0c] hover:text-white transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05, backgroundColor: "#9f9911" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiUser className="text-lg" />
                      Mon compte
                    </motion.div>
                  </Link>
                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-[#9f9911] text-white px-4 py-2 rounded-lg hover:bg-[#6e6a0c] transition-colors"
                    whileHover={{ scale: 1.05, backgroundColor: "#9f9911" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiLogOut className="text-lg" />
                    Déconnexion
                  </motion.button>
                </div>
              ) : (
                <Link href="/login" passHref>
                  <motion.div
                    className="flex items-center gap-2 bg-[#9f9911] text-white px-4 py-2 rounded-lg hover:bg-[#6e6a0c] transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05, backgroundColor: "#9f9911" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiLogIn className="text-lg" />
                    Espace Client
                  </motion.div>
                </Link>
              )}
            </div>

            <motion.div
              className="md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                onClick={toggleMenu}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#dfd750]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? (
                  <X size={24} aria-hidden="true" />
                ) : (
                  <Menu size={24} aria-hidden="true" />
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-white overflow-hidden shadow-lg"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuAnimation}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <motion.div
                  variants={menuItemAnimation}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                >
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-[#f9f8e6] hover:text-[#9f9911] transition-colors"
                  >
                    Accueil
                  </Link>
                </motion.div>

                <motion.div
                  variants={menuItemAnimation}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                >
                  <Link
                    href="/how-it-works"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-[#f9f8e6] hover:text-[#9f9911] transition-colors"
                  >
                    Comment ça marche
                  </Link>
                </motion.div>

                <motion.div
                  variants={menuItemAnimation}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  <Link
                    href="/pricing"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-[#f9f8e6] hover:text-[#9f9911] transition-colors"
                  >
                    Tarifs
                  </Link>
                </motion.div>

                <motion.div
                  variants={menuItemAnimation}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                >
                  <button
                    onClick={toggleServicesDropdown}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-[#f9f8e6] hover:text-[#9f9911] transition-colors flex items-center justify-between"
                  >
                    Services
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isServicesOpen && (
                    <div className="pl-4 space-y-1 mt-1">
                      <Link
                        href="/search"
                        onClick={closeMenu}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-[#f9f8e6] hover:text-[#9f9911] transition-colors"
                      >
                        Stockage / Boxes
                      </Link>
                      <Link
                        href="/storage-calculator"
                        onClick={closeMenu}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-[#f9f8e6] hover:text-[#9f9911] transition-colors"
                      >
                        Calculateur D'espace
                      </Link>
                      <Link
                        href="/"
                        onClick={closeMenu}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-[#f9f8e6] hover:text-[#9f9911] transition-colors"
                      >
                        Foire aux questions
                      </Link>
                    </div>
                  )}
                </motion.div>
                <motion.div
                  variants={menuItemAnimation}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                >
                  <Link
                    href="/investisser"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-[#f9f8e6] hover:text-[#9f9911] transition-colors"
                  >
                    Investisseur
                  </Link>
                </motion.div>
                <motion.div
                  variants={menuItemAnimation}
                  initial="hidden"
                  animate="visible"
                  custom={4}
                >
                  <Link
                    href="/contact"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-[#f9f8e6] hover:text-[#9f9911] transition-colors"
                  >
                    Contact
                  </Link>
                </motion.div>
              </div>

              <motion.div
                className="pt-4 pb-3 border-t border-gray-200"
                variants={menuItemAnimation}
                initial="hidden"
                animate="visible"
                custom={5}
              >
                <div className="flex items-center px-5">
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/account"
                        onClick={closeMenu}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-[#f9f8e6] hover:text-[#9f9911] transition-colors"
                      >
                        Mon compte
                      </Link>
                      <motion.button
                        onClick={() => {
                          handleLogout();
                          closeMenu();
                        }}
                        className="ml-auto bg-[#9f9911] text-white px-4 py-2 rounded-lg hover:bg-[#6e6a0c] transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Déconnexion
                      </motion.button>
                    </>
                  ) : (
                    <div className="flex flex-col w-full space-y-2 px-3">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Link
                          href="/login"
                          onClick={closeMenu}
                          className="block w-full text-center py-2 bg-[#9f9911] text-white font-medium rounded-lg hover:bg-[#6e6a0c] transition-all transform"
                        >
                          Espace Client
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Popup de notification de compte connecté */}
      <AnimatePresence>
        {isLoggedIn && showAccountPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4 border border-[#e6e297] pointer-events-auto"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={popupAnimation}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#f3f1cc] mb-4">
                  <FiUser className="h-6 w-6 text-[#9f9911]" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Vous êtes connecté</h3>
                <div className="mt-2 text-sm text-gray-500">
                  Votre compte est actuellement connecté. Pensez à vous déconnecter si vous partagez cet appareil.
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#9f9911] text-base font-medium text-white hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfd750] sm:text-sm"
                    onClick={() => setShowAccountPopup(false)}
                  >
                    Compris
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Popup pour inviter à se connecter */}
      <AnimatePresence>
        {!isLoggedIn && showLoginPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4 border border-[#e6e297] pointer-events-auto"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={popupAnimation}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#f3f1cc] mb-4">
                  <FiLogIn className="h-6 w-6 text-[#9f9911]" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Connectez-vous</h3>
                <div className="mt-2 text-sm text-gray-500">
                  Pour accéder à toutes les fonctionnalités, veuillez vous connecter à votre compte.
                </div>
                <div className="mt-4 flex gap-3 justify-center">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfd750] sm:text-sm"
                    onClick={() => setShowLoginPopup(false)}
                  >
                    Plus tard
                  </button>
                  <Link href="/login" passHref>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#9f9911] text-base font-medium text-white hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfd750] sm:text-sm"
                      onClick={() => setShowLoginPopup(false)}
                    >
                      Se connecter
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;