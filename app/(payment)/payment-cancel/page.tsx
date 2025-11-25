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
          if (!response.ok) throw new Error("Network response error");
          return response.json();
        })
        .then((data) => {
          setMessage("Payment canceled successfully. You can try again later.");
          setLoading(false);
          setTimeout(() => {
            window.location.href = "/";
          }, 5000);
        })
        .catch((error) => {
          console.error("Error cancelling payment:", error);
          setMessage("Failed to cancel payment. Please contact support.");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setMessage("Invalid session ID");
    }
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600">Payment Canceled</h1>
      {loading ? <p>Processing cancellation...</p> : <p>{message}</p>}
    </div>
  );
}

export default function PaymentCancel() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center h-screen text-center">Loading...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
}