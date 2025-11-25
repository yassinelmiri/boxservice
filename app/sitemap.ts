import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://box-service.eu';

  // Exemple de valeurs dynamiques que tu devrais normalement fetcher d'une DB ou API
  const unitIds = ['1', '2', '3']; // Remplace avec tes vrais IDs d'unités
  const locationIds = ['1', '2', '3']; // Remplace avec tes vrais IDs de location

  const staticRoutes = [
    '',
    '/investisser',
    '/how-it-works',
    '/admin',
    '/account',
    '/pricing',
    '/search',
    '/storage-calculator',
  ];

  const dynamicBookingRoutes = unitIds.map((id) => `/booking/${id}`);
  const dynamicLocationRoutes = locationIds.map((id) => `/location/${id}`);

  const allRoutes = [
    ...staticRoutes,
    ...dynamicBookingRoutes,
    ...dynamicLocationRoutes,
  ];

  const today = new Date().toISOString();

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: today,
  }));
}
