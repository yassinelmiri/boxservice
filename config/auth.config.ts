// config/auth.config.ts

// Liste des chemins qui requièrent une authentification
export const protectedPaths = [
    '/admin',
    '/admin/users',
    '/admin/locations',
    '/admin/units',
    '/admin/bookings',
    '/admin/service',
    '/admin/liste-dattents',
  ];
  
  // Fonction pour vérifier si un chemin est protégé
  export const isProtectedPath = (path: string): boolean => {
    return protectedPaths.some(protectedPath => {
      if (protectedPath.endsWith('*')) {
        const basePath = protectedPath.slice(0, -1);
        return path.startsWith(basePath);
      }
      return path === protectedPath;
    });
  };
  
  export const publicPaths = [
    '/login'
  ];