"use client";

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Check, HelpCircle, ArrowRight, Phone, Mail, MapPin,
    Star, TrendingUp, Shield, Clock, Users, Eye, EyeOff,
    ChevronDown, ChevronUp, Play, X, Download
} from 'lucide-react';

// Interfaces pour typer les données
interface InvestmentOption {
    title: string;
    description: string;
    features: string[];
    price?: string;
    profitability?: string;
    highlight?: boolean;
    icon?: string;
    monthlyReturn?: string;
    roi?: string;
}

interface BenefitItem {
    title: string;
    description: string;
    items: string[];
    icon: React.ReactNode;
}

interface FAQItem {
    question: string;
    answer: string;
    isOpen?: boolean;
}

interface Testimonial {
    name: string;
    role: string;
    content: string;
    rating: number;
    image?: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
    investmentType: string;
}

const InvestPage = () => {
    // États
    const [activeTab, setActiveTab] = useState<"investor" | "franchise">("investor");
    const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
        investmentType: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Données des options d'investissement
    const investmentOptions: InvestmentOption[] = [
        {
            title: "LOCATION DE TERRAIN",
            description: "Mon terrain devient rentable (Box Services gère tout)",
            features: [
                "Je loue un emplacement à partir de 1000m (je n'achète pas de container)",
                "Je perçois 40 € / mois / emplacement",
                "Mon terrain devient rentable (Box Services gère tout)"
            ],
            icon: "🏞️",
            monthlyReturn: "40€/mois",
            highlight: false
        },
        {
            title: "ACHAT DE CONTAINER",
            description: "Investissement intelligent dès 3 000 €",
            features: [
                "Container neuf, garanti acier Corten",
                "Mise en location par Box Services ou en autonomie",
                "Le loyer paye l'investissement (3 ans d'opération blanche)",
                "Dès la 4ème année : cela rapporte mensuellement",
                "Rentabilité moyenne : à partir de 20 % / an",
                "Garantie de rachat à 2 500 €"
            ],
            price: "Dès 3 000 €",
            profitability: "20% / an",
            monthlyReturn: "Jusqu'à 129,90€/mois",
            roi: "ROI en 2-3 ans",
            icon: "📦",
            highlight: true
        },
        {
            title: "FRANCHISE OU INVESTISSEUR TERRAIN",
            description: "Une rentabilité multipliée",
            features: [
                "À partir de 1 000 m²",
                "Accompagnement permis, clôtures, sécurité, démarches, poseurs",
                "Sans frais d'entrée",
                "Sans gestion locative",
                "Sans état des lieux",
                "Réseau national établi"
            ],
            icon: "🏢",
            monthlyReturn: "Variable selon surface",
            highlight: false
        }
    ];

    // Données des bénéfices
    const benefits: BenefitItem[] = [
        {
            title: "Rentabilité élevée, sans contraintes",
            description: "Ex. client : 6 containers, loués à 100 % depuis 2 ans",
            icon: <TrendingUp className="w-8 h-8 text-green-500" />,
            items: [
                "Paiement automatisé / suivi via site en ligne",
                "Jusqu'à 780 € / mois de loyer pour un investissement initial de 18 000 € remboursé en 2 ans",
                "Possibilité de percevoir une rente passive sécurisée",
                "Taux d'occupation moyen de 95%"
            ]
        },
        {
            title: "Zéro tracas",
            description: "Une gestion simplifiée pour les investisseurs",
            icon: <Clock className="w-8 h-8 text-blue-500" />,
            items: [
                "Pas de risque d'impayé (souscription en ligne)",
                "Résiliation simple et autonome (préavis 15 jours, boîte à clés sécurisée)",
                "Pas d'état des lieux, pas de gestion",
                "Support client 7j/7"
            ]
        },
        {
            title: "Sécurité & garanties",
            description: "Investissez en toute sérénité",
            icon: <Shield className="w-8 h-8 text-purple-500" />,
            items: [
                "Containers inviolables (shutlock inox)",
                "Sites équipés : grillages, portails, caméras",
                "Contenu assuré jusqu'à 5 000 €",
                "Garantie de rachat",
                "Matériau : acier Corten garanti longue durée (25 ans en mer = 80 ans sur terre)"
            ]
        }
    ];

    // Témoignages
    const testimonials: Testimonial[] = [
        {
            name: "Marie Dubois",
            role: "Investisseuse depuis 3 ans",
            content: "J'ai commencé avec 2 containers et maintenant j'en ai 8. Le retour sur investissement est exactement comme promis, et la gestion est vraiment sans tracas.",
            rating: 5
        },
        {
            name: "Jean-Pierre Martin",
            role: "Propriétaire de terrain",
            content: "Mon terrain rapporte maintenant 320€/mois sans aucun effort de ma part. Box Services s'occupe de tout, c'est parfait pour préparer ma retraite.",
            rating: 5
        },
        {
            name: "Sophie Laurent",
            role: "Franchisée",
            content: "L'accompagnement a été exceptionnel du début à la fin. Mon site génère maintenant plus de 2000€/mois de revenus nets.",
            rating: 5
        }
    ];

    // Initialisation des FAQs
    useEffect(() => {
        setFaqItems([
            {
                question: "Quelle est la durée minimale d'engagement ?",
                answer: "Il n'y a pas de durée minimale d'engagement. Vous pouvez commencer avec un seul container et augmenter votre investissement à tout moment. La flexibilité est au cœur de notre modèle.",
                isOpen: false
            },
            {
                question: "Comment sont gérés les containers ?",
                answer: "Box Services s'occupe de toute la gestion locative, de la maintenance et de la sécurité des containers. Vous n'avez rien à faire si ce n'est percevoir vos loyers mensuellement sur votre compte.",
                isOpen: false
            },
            {
                question: "Quelle est la garantie de rachat ?",
                answer: "Nous garantissons le rachat de votre container à 2 500 € quel que soit son âge, vous offrant ainsi une sécurité supplémentaire pour votre investissement. Cette garantie est valable à vie.",
                isOpen: false
            },
            {
                question: "Puis-je visiter les sites avant d'investir ?",
                answer: "Oui, nous organisons des visites sur rendez-vous pour que vous puissiez voir par vous-même la qualité de nos installations et notre système de sécurité. Nous avons des sites dans toute la France.",
                isOpen: false
            },
            {
                question: "Quels sont les frais cachés ?",
                answer: "Il n'y a aucun frais caché. Le prix annoncé inclut tout : transport, installation, mise en service, gestion locative si souhaitée. Transparence totale garantée.",
                isOpen: false
            },
            {
                question: "Comment puis-je suivre mes revenus ?",
                answer: "Vous avez accès à un espace personnel en ligne où vous pouvez suivre en temps réel l'occupation de vos containers, vos revenus mensuels, et toutes les informations importantes.",
                isOpen: false
            }
        ]);
    }, []);

    // Fonction pour basculer l'état d'une FAQ
    const toggleFAQ = (index: number) => {
        setFaqItems(prev => prev.map((item, i) =>
            i === index ? { ...item, isOpen: !item.isOpen } : { ...item, isOpen: false }
        ));
    };

    // Gestion des changements de formulaire
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

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

            toast.success('Message envoyé avec succès ! Nous vous recontactons sous 24h.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setFormData({ name: '', email: '', phone: '', message: '', investmentType: '' });
            setTimeout(() => setShowSuccess(false), 5000);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error("Une erreur s'est produite lors de l'envoi du formulaire. Veuillez réessayer.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fonction pour télécharger le PDF
    const downloadPdf = () => {
        const pdfPath = '/assets/pdf/plaquette_BOX_SERVICE_V2.pdf';
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = 'plaquette_BOX_SERVICE_V2.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Composant Message de Succès
    const SuccessMessage = () => (
        <div className="fixed top-48 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-40 animate-slide-in">
            <div className="flex items-center">
                <Check size={20} className="mr-2" />
                <span>Message envoyé avec succès ! Nous vous recontactons sous 24h.</span>
            </div>
        </div>
    );

    // Statistiques rapides
    const quickStats = [
        { number: "20%", label: "Rentabilité brute", icon: <TrendingUp className="w-6 h-6" /> },
        { number: "0", label: "Risque d'impayé", icon: <Shield className="w-6 h-6" /> },
        { number: "95%", label: "Taux d'occupation", icon: <Users className="w-6 h-6" /> },
        { number: "500+", label: "Investisseurs satisfaits", icon: <Star className="w-6 h-6" /> }
    ];

    // Logos de preuve sociale
    const socialProofLogos = ["BFM Business", "Le Figaro", "Capital", "Challenges", "Les Échos"];

    return (
        <div className="flex flex-col min-h-screen bg-white">
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <main className="flex-grow">
                {/* Section Hero */}
                <section className="relative bg-gradient-to-br from-[#ccc32d] to-[#363504d0] text-white py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#9f9911]/20 to-[#525008]/20"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center bg-[#9f9911]/20 rounded-full px-4 py-2 mb-6 border border-[#9f9911]/30">
                                <Star className="w-4 h-4 text-[#dfd750] mr-2" />
                                <span className="text-sm text-[#dfd750]">Investissement le plus rentable de France</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-[#dfd750] to-white bg-clip-text text-transparent leading-tight">
                                INVESTISSEZ DANS<br />DU SOLIDE !
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
                                Location de containers sécurisés - <span className="text-[#dfd750] font-semibold">Rentabilité jusqu'à 20% par an</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                                <button
                                    onClick={() => document.getElementById('investissement')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#9f9911] to-[#dfd750] text-black font-bold rounded-full shadow-2xl hover:shadow-[#9f9911]/25 transform hover:scale-105 transition-all duration-300"
                                >
                                    Découvrir les options
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>

                                {/* <button
                                    onClick={downloadPdf}
                                    className="group inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300"
                                >
                                    <Download className="mr-2 w-5 h-5" />
                                    Télécharger PDF
                                </button> */}
                            </div>
                        </div>

                        {/* Statistiques rapides */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            {quickStats.map((stat, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                                    <div className="flex justify-center mb-2 text-[#dfd750]">
                                        {stat.icon}
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                                    <div className="text-sm text-gray-300">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section Preuve Sociale */}
                <section className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <p className="text-gray-600 font-medium">Ils nous font confiance</p>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                            {socialProofLogos.map((logo, index) => (
                                <div key={index} className="text-gray-500 font-bold text-lg">
                                    {logo}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section Options d'Investissement */}
                <section id="investissement" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                3 MANIÈRES D'INVESTIR
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Un investissement intelligent, accessible à tous les profils et tous les budgets
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {investmentOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className={`relative bg-white rounded-3xl overflow-hidden shadow-xl border-2 ${option.highlight
                                        ? "border-[#dfd750] transform scale-105 z-10 shadow-2xl shadow-[#9f9911]/20"
                                        : "border-gray-100 hover:border-[#dfd750]/50"
                                        } transition-all duration-500 hover:shadow-2xl group`}
                                >
                                    {option.highlight && (
                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-50">
                                            <div className="bg-gradient-to-r from-[#9f9911] to-[#dfd750] text-white text-sm font-bold py-2 px-6 rounded-full shadow-lg z-50">
                                                ⭐ Le plus populaire
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-8">
                                        <div className="text-center mb-6">
                                            <div className="text-4xl mb-3">{option.icon}</div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.title}</h3>
                                            <p className="text-gray-600">{option.description}</p>
                                        </div>

                                        {(option.price || option.monthlyReturn) && (
                                            <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-center">
                                                {option.price && (
                                                    <div className="mb-2">
                                                        <span className="text-3xl font-black text-[#9f9911]">{option.price}</span>
                                                    </div>
                                                )}
                                                {option.monthlyReturn && (
                                                    <div className="text-sm text-gray-600 mb-1">Revenus mensuels</div>
                                                )}
                                                {option.monthlyReturn && (
                                                    <div className="text-lg font-semibold text-green-600">{option.monthlyReturn}</div>
                                                )}
                                                {option.profitability && (
                                                    <div className="text-sm text-[#9f9911] font-medium mt-2">{option.profitability}</div>
                                                )}
                                                {option.roi && (
                                                    <div className="text-sm text-blue-600 font-medium">{option.roi}</div>
                                                )}
                                            </div>
                                        )}

                                        <ul className="space-y-4 mb-8">
                                            {option.features.map((feature, i) => (
                                                <li key={i} className="flex items-start">
                                                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                                        <Check size={14} className="text-green-600" />
                                                    </div>
                                                    <span className="text-gray-700 leading-relaxed">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                            className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 ${option.highlight
                                                ? "bg-gradient-to-r from-[#9f9911] to-[#dfd750] text-black hover:shadow-lg transform hover:translate-y-[-2px]"
                                                : "bg-gray-100 text-gray-900 hover:bg-[#f3f1cc] hover:text-[#9f9911]"
                                                }`}
                                        >
                                            {option.highlight ? "En savoir plus" : "En savoir plus"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section Bénéfices */}
                <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
                            LES BÉNÉFICES POUR LES INVESTISSEURS
                        </h2>

                        <div className="space-y-12">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    <div className="flex items-start mb-6">
                                        <div className="flex-shrink-0 mr-6">
                                            {benefit.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                                            <p className="text-gray-600 text-lg">{benefit.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {benefit.items.map((item, i) => (
                                            <div key={i} className="flex items-start">
                                                <Check size={18} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                                                <span className="text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section Témoignages */}
                <section className="py-20 bg-gradient-to-r from-[#9f9911] to-[#525008] text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center mb-16">
                            Ce que disent nos investisseurs
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                    <div className="flex items-center mb-4">
                                        <div className="flex text-yellow-400">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} size={16} fill="currentColor" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-white/90 mb-6 italic">"{testimonial.content}"</p>
                                    <div>
                                        <div className="font-semibold text-white">{testimonial.name}</div>
                                        <div className="text-white/70 text-sm">{testimonial.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section FAQ */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
                            Questions fréquentes
                        </h2>

                        <div className="space-y-4">
                            {faqItems.map((item, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-8 h-8 bg-[#f3f1cc] rounded-full flex items-center justify-center mr-4">
                                                <HelpCircle size={16} className="text-[#9f9911]" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 pr-4">
                                                {item.question}
                                            </h3>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {item.isOpen ? (
                                                <ChevronUp size={20} className="text-gray-500" />
                                            ) : (
                                                <ChevronDown size={20} className="text-gray-500" />
                                            )}
                                        </div>
                                    </button>

                                    {item.isOpen && (
                                        <div className="px-6 pb-6">
                                            <div className="pl-12">
                                                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section Contact */}
                <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-6">Prêt à investir dans votre avenir ?</h2>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Contactez Vincent Vitte pour discuter de votre projet d'investissement personnalisé
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Informations de contact */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-2xl font-bold mb-6 text-[#dfd750]">Parlons de votre projet</h3>
                                    <p className="text-gray-300 mb-8 leading-relaxed">
                                        Que vous ayez un terrain à valoriser ou que vous souhaitiez investir dans des containers,
                                        notre équipe vous accompagne à chaque étape pour maximiser votre rentabilité.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <Phone className="w-5 h-5 text-[#dfd750] mr-4" />
                                            <span className="text-lg">06 69 91 65 34</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Mail className="w-5 h-5 text-[#dfd750] mr-4" />
                                            <span className="text-lg">contact@box-service.eu</span>
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="w-5 h-5 text-[#dfd750] mr-4" />
                                            <span className="text-lg">Partout en France</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h4 className="font-semibold text-[#dfd750] mb-2">Réponse garantie sous 24h</h4>
                                    <p className="text-gray-300 text-sm">
                                        Vincent Vitte, fondateur de Box Services, vous recontacte personnellement
                                        pour analyser votre situation et vous proposer la solution la plus adaptée.
                                    </p>
                                </div>
                            </div>

                            {/* Formulaire de contact */}
                            <div className="bg-white rounded-3xl p-8 shadow-2xl">
                                <form onSubmit={handleSubmit} className="space-y-6  text-black ">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Nom complet *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9f9911] focus:border-transparent transition-all duration-200"
                                                placeholder="Votre nom complet"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9f9911] focus:border-transparent transition-all duration-200"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Téléphone
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9f9911] focus:border-transparent transition-all duration-200"
                                                placeholder="06 12 34 56 78"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="investmentType" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Type d'investissement
                                            </label>
                                            <select
                                                id="investmentType"
                                                name="investmentType"
                                                value={formData.investmentType}
                                                onChange={handleInputChange}
                                                className="w-fullpx-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9f9911] focus:border-transparent transition-all duration-200"
                                            >
                                                <option value="">Sélectionnez une option</option>
                                                <option value="terrain">Location de terrain</option>
                                                <option value="container">Achat de container</option>
                                                <option value="franchise">Franchise/Investisseur terrain</option>
                                                <option value="info">Demande d'information</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9f9911] focus:border-transparent transition-all duration-200 resize-none"
                                            placeholder="Décrivez votre projet, vos questions ou votre situation..."
                                        ></textarea>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-[#9f9911] to-[#dfd750] text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:translate-y-[-2px] disabled:opacity-50 disabled:transform-none flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                <>
                                                    Envoyer le message
                                                    <ArrowRight size={20} className="ml-2" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">
                                            En soumettant ce formulaire, vous acceptez d'être recontacté par Box Services
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section CTA Finale */}
                <section className="py-16 bg-gradient-to-r from-[#9f9911] to-[#dfd750]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-black mb-4">
                            Rejoignez les 500+ investisseurs qui nous font confiance
                        </h2>
                        <p className="text-xl text-black/80 mb-8">
                            Commencez votre investissement dès aujourd'hui et sécurisez votre avenir financier
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                            >
                                Commencer mon investissement
                            </button>
                            {/* <button
                                onClick={downloadPdf}
                                className="bg-white/20 text-black px-8 py-4 rounded-full font-bold hover:bg-white/30 transition-all duration-300 border border-black/20"
                            >
                                Télécharger la plaquette
                            </button> */}
                        </div>
                    </div>
                </section>
            </main>


        </div>
    );
};

export default InvestPage;