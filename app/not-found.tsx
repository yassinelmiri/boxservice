'use client';

import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-28">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-2xl text-gray-600 mb-8">
            Oups ! La page que vous cherchez n'existe pas.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#9f9911] hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfd750] transition-colors"
          >
            Retour à la page de contact
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;