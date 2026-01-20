'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";


const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (sessionId) {
      fetch(`${apiUrl}/payments/cancel?sessionId=${sessionId}`, {
        method: "POST",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erreur de réponse réseau");
          return response.json();
        })
        .then((data) => {
          setMessage("Paiement annulé avec succès. Vous pouvez réessayer plus tard.");
          setLoading(false);
          setTimeout(() => {
            window.location.href = "/";
          }, 5000);
        })
        .catch((error) => {
          console.error("Erreur lors de l'annulation du paiement :", error);
          setMessage("Échec de l'annulation du paiement. Veuillez contacter le support.");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setMessage("ID de session invalide");
    }
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600">Paiement Annulé</h1>
      {loading ? <p>Traitement de l'annulation...</p> : <p>{message}</p>}
    </div>
  );
}

export default function PaymentCancel() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center h-screen text-center">Chargement...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
}