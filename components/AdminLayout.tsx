'use client';

import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Link from "next/link";
import {
  FiUsers,
  FiMapPin,
  FiHome,
  FiLogOut,
  FiClipboard,
  FiMenu,
  FiX,
  FiDollarSign,
  FiGrid,
  FiTool,
  FiCreditCard,
} from "react-icons/fi";
import Image from "next/image";

interface NavigationItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token") || '';

      if (!token ) {
        router.push('/login');
        return;
      }
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const user = {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  };
  const navigationItems: NavigationItem[] = [
    {
      path: "/admin",
      icon: <FiGrid size={20} />,
      label: "Tableau de bord",
      exact: true,
    },
    {
      path: "/admin/users",
      icon: <FiUsers size={20} />,
      label: "Utilisateurs",
    },
    {
      path: "/admin/locations",
      icon: <FiMapPin size={20} />,
      label: "Emplacements",
    },
    { path: "/admin/units", icon: <FiHome size={20} />, label: "Unités" },
    {
      path: "/admin/bookings",
      icon: <FiDollarSign size={20} />,
      label: "Réservations",
    },
    {
    path: "/admin/abonnement",
    icon: <FiCreditCard size={20} />,
    label: "Abonnement",
  },
    {
      path: "/admin/service",
      icon: <FiTool size={20} />,
      label: "Services",
    },
    
    {
      path: "/admin/soldes",
      icon: <FiCreditCard size={20} />,
      label: "Remise",
    },
    {
      path: "/admin/liste-dattents",
      icon: <FiClipboard size={20} />,
      label: "Liste D'attents",
    },
  ];
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(path);
  };
  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter?")) {
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/login");
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9f9911]"></div>
        <span className="ml-3 text-gray-600">Chargement...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-md  z-50  fixed w-full">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden text-gray-500 p-2 mr-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <button
              onClick={toggleSidebar}
              className="hidden lg:flex text-gray-500 p-2 mr-3 rounded-md hover:bg-gray-100 transition-colors duration-200 items-center justify-center"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <FiMenu size={24} /> : <FiX size={24} />}
            </button>

            <div className="flex items-center space-x-2">
              <div className="px-2">
                <div className="flex items-center justify-center">
                  <Image
                    src="/assets/image/logo.png"
                    alt="Logo"
                    width={collapsed ? 40 : 64}
                    height={collapsed ? 40 : 64}
                    className="transition-all duration-300"
                  />
                </div>
              </div>
              <span className="px-2 py-1 bg-[#f3f1cc] text-[#525008] rounded-md text-xs font-medium shadow-sm">
                ADMIN
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center space-x-1">
              <div className="h-10 w-10 mx-4 rounded-full bg-gradient-to-br from-[#ccc32d] to-[#9f9911] flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                A
              </div>

              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-900">Admin</div>
                <div className="text-xs text-gray-500">contact@box-service.eu</div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-grow pt-16">
        <aside
          className={`fixed inset-y-0 left-0 pt-16 z-40 bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out ${collapsed ? "lg:w-20" : "lg:w-64"
            } ${mobileMenuOpen
              ? "translate-x-0 shadow-2xl"
              : "-translate-x-full lg:translate-x-0"
            }`}
        >
          <div
            className="h-full flex flex-col justify-between overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            style={{ height: "calc(100vh - 4rem)" }}
          >
            <nav className="px-3 py-6">
              <ul className="space-y-2">
                {navigationItems.map((item) => {
                  const active = isActive(item.path);
                  const isHovered = hoveredItem === item.path;

                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${active
                            ? "bg-[#f9f8e6] text-[#9f9911] shadow-md"
                            : "text-gray-700 hover:bg-gray-50"
                          } ${isHovered && !active ? "bg-gray-100 transform scale-105" : ""
                          }`}
                        onMouseEnter={() => setHoveredItem(item.path)}
                        onMouseLeave={() => setHoveredItem(null)}
                        style={{
                          transform: isHovered ? "translateY(-2px)" : "none",
                          boxShadow: isHovered && !active ? "0 4px 6px rgba(0, 0, 0, 0.05)" : "",
                        }}
                      >
                        <div
                          className={`mr-3 text-lg transition-transform duration-300 ${isHovered ? "transform rotate-12" : ""
                            }`}
                        >
                          {item.icon}
                        </div>
                        {(!collapsed || mobileMenuOpen) && (
                          <span className="font-medium">{item.label}</span>
                        )}
                        {active && !collapsed && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-[#9f9911] animate-pulse"></div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className={`flex items-center px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-all duration-200 hover:shadow-md ${collapsed && !mobileMenuOpen ? "justify-center" : ""
                  }`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <FiLogOut
                  size={20}
                  className="mr-3 transition-transform duration-300 hover:rotate-12"
                />
                {(!collapsed || mobileMenuOpen) && (
                  <span className="font-medium">Déconnexion</span>
                )}
              </button>

              {(!collapsed || mobileMenuOpen) && (
                <div className="mt-4 text-center text-xs text-gray-500">
                  Box-Service Admin v1.1
                </div>
              )}
            </div>
          </div>
        </aside>
        <main
          className={`flex-1 px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"
            }`}
        >
          {children}
        </main>
      </div>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-70 backdrop-blur-sm lg:hidden z-30 transition-opacity duration-300"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;