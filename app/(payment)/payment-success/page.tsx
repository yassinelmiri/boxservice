"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";
import ImageSignature from "@/public/assets/image/Signature.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ClientInfo {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
}

interface ContractTerms {
  boxNumber: string;
  surface: string;
  startDate: string;
  monthlyPrice: number;
  deposit: string;
  fees: string;
  durationMonths: number;
  totalPrice: number;
}

interface StorageCenter {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentDetails {
  iban: string;
  bic: string;
}

interface ContractData {
  clientInfo: ClientInfo;
  contractTerms: ContractTerms;
  storageCenter: StorageCenter;
  paymentDetails: PaymentDetails;
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const contractRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://ws.box-service.eu";

  useEffect(() => {
    if (sessionId) {
      const fetchPaymentStatus = async () => {
        try {
          const response = await fetch(`${apiUrl}/payments/payment-status`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ session_id: sessionId }),
          });

          if (!response.ok) {
            throw new Error(
              `Server returned ${response.status}: ${response.statusText}`
            );
          }

          const data = await response.json();

          if (data.paymentStatus === "paid") {
            toast.success("Paiement réussi ! Votre réservation est confirmée.");
            setMessage("Paiement réussi ! Votre réservation est confirmée.");
            const booking = data.booking;
            const customer = booking.customer;
            const unit = booking.unit;
            const storageCenter = unit.storageCenter;

            setContractData({
              clientInfo: {
                firstName: customer.firstName,
                lastName: customer.lastName,
                address: `${customer.address}, ${customer.city}, ${customer.postalCode}, ${customer.country}`,
                phone: customer.phone,
                email: customer.email,
              },
              contractTerms: {
                boxNumber: unit.code,
                surface: unit.volume.toString(),
                startDate: new Date(booking.startDate).toLocaleDateString(
                  "fr-FR"
                ),
                monthlyPrice: unit.pricePerMonth,
                deposit: "100",
                fees: "30",
                durationMonths: booking.durationMonths,
                totalPrice: booking.totalPrice,
              },
              storageCenter: {
                name: storageCenter.name,
                address: storageCenter.address,
                city: storageCenter.city,
                postalCode: storageCenter.postalCode,
                country: storageCenter.country,
              },
              paymentDetails: {
                iban: "FR76 3000 1000 0100 0000 0000 X99",
                bic: "BNPAFRPPXXX",
              },
            });
          } else {
            toast.info(
              "Traitement du paiement en cours. Veuillez patienter..."
            );
            setMessage(
              "Traitement du paiement en cours. Veuillez patienter..."
            );
            setTimeout(() => {
              router.push("/");
            }, 5000);
          }
        } catch (error) {
          console.error("Fetch error:", error);
          const errorMsg = `Échec de la vérification du paiement. Veuillez vérifier que le serveur backend est en cours d'exécution à ${apiUrl}`;
          toast.error(errorMsg);
          setError(errorMsg);
        } finally {
          setLoading(false);
        }
      };

      fetchPaymentStatus();
    } else {
      const errorMsg = "Aucun ID de session trouvé dans l'URL";
      toast.error(errorMsg);
      setError(errorMsg);
      setLoading(false);
    }
  }, [sessionId, apiUrl, router]);

  useEffect(() => {
    if (contractData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
      };

      resizeCanvas();

      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }
  }, [contractData]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Ajuster le canvas pour correspondre à sa taille CSS
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const generatePDFAlternative = async () => {
    if (!contractData) return null;

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;
      const blueColor = [0, 105, 180];
      const lightBlueColor = [225, 235, 245];

      const addHeading = (text: string, yPos: number) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
        pdf.text(text, margin, yPos);
        pdf.setTextColor(0, 0, 0);
        return yPos + 7;
      };

      const addText = (text: string, yPos: number, fontSize = 10) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSize);
        pdf.setTextColor(0, 0, 0);

        const lines = pdf.splitTextToSize(text, contentWidth);
        pdf.text(lines, margin, yPos);
        return yPos + lines.length * (fontSize / 2.5) + 2;
      };

      const addSectionHeader = (text: string, yPos: number) => {
        pdf.setFillColor(
          lightBlueColor[0],
          lightBlueColor[1],
          lightBlueColor[2]
        );
        pdf.rect(margin, yPos - 5, contentWidth, 8, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
        pdf.text(text.toUpperCase(), margin + 2, yPos);
        pdf.setTextColor(0, 0, 0);
        return yPos + 8;
      };
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
      pdf.text("box-service.eu", margin, y);
      pdf.setTextColor(0, 0, 0);
      y = addText("\n\nwww.box-service.eu", y + 5);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
      pdf.text("Adresse de correspondance", pageWidth - margin - 50, 15);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(
        "SCI Millet\n15 Allée DE LAUNIS\n17620 ECHILLAIS",
        pageWidth - margin - 50,
        20
      );
      y += 5;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
      pdf.text(
        "Contrat de mise à disposition d'un box de stockage",
        pageWidth / 2,
        y,
        { align: "center" }
      );
      pdf.setTextColor(0, 0, 0);
      y += 5;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        "Le présent contrat est soumis aux Conditions Générales de Mise à disposition d'un box.",
        pageWidth / 2,
        y + 5,
        { align: "center" }
      );
      y += 5;
      y = addSectionHeader(
        "– SOCIÉTÉ – Licencié membre indépendant du réseau box-service.eu",
        y
      );
      y = addText("SCI Millet, 15 Allée DE LAUNIS, 17620 ECHILLAIS", y + 5);
      y += 5;

      y = addSectionHeader("– CLIENT –", y);
      y = addText(
        `Nom : ${contractData.clientInfo.lastName}     Prénom : ${contractData.clientInfo.firstName}`,
        y + 5
      );
      y = addText(`Adresse : ${contractData.clientInfo.address}`, y + 5);
      y = addText(
        `Téléphone : ${contractData.clientInfo.phone}     Email : ${contractData.clientInfo.email}`,
        y + 5
      );
      y += 5;

      y = addSectionHeader("– CENTRE DE STOCKAGE –", y);
      y = addText(
        `${contractData.storageCenter.name} - ${contractData.storageCenter.address}, ${contractData.storageCenter.postalCode} ${contractData.storageCenter.city}, ${contractData.storageCenter.country}`,
        y + 5
      );
      y += 5;

      y = addSectionHeader("– TERMES DU CONTRAT –", y);
      y = addText(
        "Entre les deux parties, il a été convenu ce qui suit :",
        y + 5,
        11
      );
      y += 3;

      y = addText(
        `Désignation - La Société met à disposition du Client le box numéro : ${contractData.contractTerms.boxNumber} d'une surface d'environ ${contractData.contractTerms.surface} m³ situé dans le centre de stockage désigné ci-dessus.`,
        y + 5
      );
      y += 5;

      y = addText(
        `Date d'effet et durée - Le présent contrat prend effet à compter du : ${contractData.contractTerms.startDate} pour une durée de ${contractData.contractTerms.durationMonths} mois renouvelable tacitement pour une même durée, sauf dénonciation par l'une des parties conformément à l'article 4 des Conditions Générales.`,
        y
      );
      y += 5;

      y = addText(
        `Prix mensuel assurance incluse - Le tarif mensuel pour la mise à disposition du box est actuellement fixé à ${contractData.contractTerms.monthlyPrice}€ TTC. Ce tarif pourra être modifié conformément aux dispositions de l'article 8 des Conditions Générales.`,
        y
      );
      y += 5;

      y = addText(
        `Prix total pour la période - Le montant total pour la période de ${contractData.contractTerms.durationMonths} mois est de ${contractData.contractTerms.totalPrice}€ TTC.`,
        y
      );
      y += 5;

      y = addText(
        `Dépôt de garantie et frais de dossier - A la signature du contrat, un dépôt de garantie de ${contractData.contractTerms.deposit}€ a été versé (restituable sous 15aine après rendu des clés), ainsi que ${contractData.contractTerms.fees}€ couvrant les frais de dossier.`,
        y
      );
      y += 15;
      const signatureWidth = (contentWidth - 10) / 2;
      pdf.setDrawColor(blueColor[0], blueColor[1], blueColor[2]);
      pdf.rect(margin, y, signatureWidth, 40);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
      pdf.text("– SOCIÉTÉ –", margin + 5, y + 5);
      pdf.setTextColor(0, 0, 0);

      if (ImageSignature?.src) {
        try {
          pdf.addImage(
            ImageSignature.src,
            "PNG",
            margin + 10,
            y + 10,
            signatureWidth - 20,
            25
          );
        } catch (e) {
          console.error("Erreur lors de l'ajout de l'image de signature:", e);
        }
      }
      pdf.setDrawColor(blueColor[0], blueColor[1], blueColor[2]);
      pdf.rect(margin + signatureWidth + 10, y, signatureWidth, 40);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
      pdf.text("– CLIENT –", margin + signatureWidth + 15, y + 5);
      pdf.setTextColor(0, 0, 0);

      if (signatureData) {
        pdf.addImage(
          signatureData,
          "PNG",
          margin + signatureWidth + 15,
          y + 10,
          signatureWidth - 20,
          25
        );
      }

      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(9);
      pdf.text("« Lu et approuvé »", margin + signatureWidth + 15, y + 38);

      return pdf;
    } catch (error) {
      console.error("Erreur détaillée lors de la génération du PDF:", error);
      toast.error(
        `Erreur de génération du contrat: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
      return null;
    }
  };

  const sendContractData = async () => {
    if (!hasSignature || !canvasRef.current) return false;

    try {
      const signatureData = canvasRef.current.toDataURL("image/png");

      const response = await fetch(`${apiUrl}/payments/customer-signature`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          signature: signatureData,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur serveur: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Réponse du serveur:", result);

      setShowSuccessModal(true);

      return true;
    } catch (error: unknown) {
      console.error("Erreur lors de l'envoi des données:", error);
      toast.error(
        `Erreur lors de l'envoi du contrat: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return false;
    }
  };

  const handlePrint = async () => {
    if (!signatureData) {
      toast.error("Veuillez signer le contrat avant d'imprimer");
      return;
    }

    if (!hasSignature || !termsAccepted) {
      if (!hasSignature) {
        toast.error("Veuillez signer le contrat avant d'imprimer");
      }
      if (!termsAccepted) {
        toast.error(
          "Veuillez accepter les conditions générales avant d'imprimer"
        );
      }
      return;
    }

    setIsPrinting(true);
    try {
      const pdf = await generatePDFAlternative();
      if (!pdf) return;

      await sendContractData();

      setTimeout(() => {
        setIsPrinting(false);
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "contrat_box_services.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      setIsPrinting(false);
    }
  };

  const confirmRedirect = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      router.push("/login");
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasSignature, termsAccepted, contractData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-3xl font-bold text-green-600">Payment Success</h1>
        <p>Vérification du statut de paiement...</p>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-8 px-4 mt-10 md:mt-20">
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Payment Success
      </h1>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 w-full max-w-4xl">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
          <p className="mt-2">
            Veuillez vérifier votre connexion réseau et vous assurer que votre
            serveur backend est en cours d'exécution.
          </p>
        </div>
      ) : (
        <p className="mb-8 text-lg text-center">{message}</p>
      )}

      {contractData && (
        <div className="w-full max-w-4xl">
          <div
            className="mb-8 p-4 border rounded-lg bg-white shadow-md"
            ref={contractRef}
          >
            <div className="print-contract">
              <div className="docusign-id text-xs text-gray-500 mb-4">
                Docusign Envelope ID: 911F3276-8928-4D36-903C-57DD42CBEO7B
              </div>

              <div className="flex flex-col md:flex-row justify-between mb-6 pb-4 border-b">
                <div className="mb-4 md:mb-0">
                  <p className="font-bold text-[#6e6a0c]">box-service.eu</p>
                  <p></p>
                  <p></p>
                  <p>www.box-service.eu</p>
                </div>
                <div>
                  <p className="font-bold text-[#6e6a0c]">
                    Adresse de correspondance
                  </p>
                  <p>SCI Millet</p>
                  <p>15 Allée DE LAUNIS</p>
                  <p>17620 ECHILLAIS</p>
                </div>
              </div>

              <div className="text-center mb-4">
                <h2 className="text-xl font-bold underline mb-2 text-[#6e6a0c]">
                  Contrat de mise à disposition d'un box de stockage
                </h2>
                <p className="text-sm">
                  Le présent contrat est soumis aux Conditions Générales de Mise
                  à disposition d'un box.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase py-1 border-y border-[#9f9911] bg-[#f9f8e6] text-[#6e6a0c]">
                  – SOCIÉTÉ – Licencié membre indépendant du réseau
                  box-service.eu
                </h3>
                <p className="my-2">
                  Bordeaux, France 
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase py-1 border-y border-[#9f9911] bg-[#f9f8e6] text-[#6e6a0c]">
                  – CLIENT –
                </h3>
                <div className="my-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p>
                    <span>Nom : </span>
                    <span className="font-bold">
                      {contractData.clientInfo.lastName}
                    </span>
                  </p>
                  <p>
                    <span>Prénom : </span>
                    <span className="font-bold">
                      {contractData.clientInfo.firstName}
                    </span>
                  </p>
                </div>
                <p className="my-1">
                  Adresse : {contractData.clientInfo.address}
                </p>
                <div className="my-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p>
                    <span>Téléphone : </span>
                    <span className="font-bold">
                      {contractData.clientInfo.phone}
                    </span>
                  </p>
                  <p>
                    <span>Email : </span>
                    <span>{contractData.clientInfo.email}</span>
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase py-1 border-y border-[#9f9911] bg-[#f9f8e6] text-[#6e6a0c]">
                  – CENTRE DE STOCKAGE –
                </h3>
                <p className="my-2">
                  {contractData.storageCenter.name} -{" "}
                  {contractData.storageCenter.address},{" "}
                  {contractData.storageCenter.postalCode}{" "}
                  {contractData.storageCenter.city},{" "}
                  {contractData.storageCenter.country}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase py-1 border-y border-[#9f9911] bg-[#f9f8e6] text-[#6e6a0c]">
                  – TERMES DU CONTRAT –
                </h3>
                <div className="my-2">
                  <p className="font-bold mb-1">
                    Entre les deux parties, il a été convenu ce qui suit :
                  </p>
                  <p className="mb-2">
                    <span className="font-bold">Désignation</span> - La Société
                    met à disposition du Client le box numéro :{" "}
                    <span className="font-bold">
                      {contractData.contractTerms.boxNumber}
                    </span>{" "}
                    d'une surface d'environ{" "}
                    <span className="font-bold">
                      {contractData.contractTerms.surface}
                    </span>{" "}
                    m³ situé dans le centre de stockage désigné ci-dessus.
                  </p>
                  <p className="mb-2">
                    <span className="font-bold">Date d'effet et durée</span> -
                    Le présent contrat prend effet à compter du :{" "}
                    <span className="font-bold">
                      {contractData.contractTerms.startDate}
                    </span>{" "}
                    pour une durée de{" "}
                    <span className="font-bold">
                      {contractData.contractTerms.durationMonths}
                    </span>{" "}
                    mois renouvelable tacitement pour une même durée, sauf
                    dénonciation par l'une des parties conformément à l'article
                    4 des Conditions Générales.
                  </p>
                  <p className="mb-2">
                    <span className="font-bold">
                      Prix mensuel assurance incluse
                    </span>{" "}
                    - Le tarif mensuel pour la mise à disposition du box est
                    actuellement fixé à
                    <span className="font-bold">
                      {" "}
                      {contractData.contractTerms.monthlyPrice}€ TTC
                    </span>
                    . Ce tarif pourra être modifié conformément aux dispositions
                    de l'article 8 des Conditions Générales.
                  </p>
                  <p className="mb-2">
                    <span className="font-bold">
                      Prix total pour la période
                    </span>{" "}
                    - Le montant total pour la période de
                    <span className="font-bold">
                      {" "}
                      {contractData.contractTerms.durationMonths}
                    </span>{" "}
                    mois est de
                    <span className="font-bold">
                      {" "}
                      {contractData.contractTerms.totalPrice}€ TTC
                    </span>
                    .
                  </p>
                  <p className="mb-2">
                    <span className="font-bold">
                      Dépôt de garantie et frais de dossier
                    </span>{" "}
                    - A la signature du contrat, un dépôt de garantie de
                    <span className="font-bold">
                      {" "}
                      {contractData.contractTerms.deposit}€
                    </span>{" "}
                    a été versé (restituable sous 15aine après rendu des clés),
                    ainsi que
                    <span className="font-bold">
                      {" "}
                      {contractData.contractTerms.fees}€
                    </span>{" "}
                    couvrant les frais de dossier.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
                <div className="border border-[#9f9911] p-3 flex-1">
                  <p className="text-sm mb-2 text-[#6e6a0c]">– SOCIÉTÉ –</p>
                  <div className="h-24 flex items-center justify-center">
                    <img
                      src={ImageSignature.src}
                      alt="Company Signature"
                      className="max-h-full object-contain"
                    />
                  </div>
                </div>
                <div className="border-2 border-[#9f9911] rounded-lg p-4 flex-1 bg-white shadow-sm transition hover:shadow-md">
                  <p className="text-sm font-semibold mb-3 text-[#6e6a0c] tracking-wide">
                    – CLIENT –
                  </p>
                  <button
                    onClick={() => setShowSignatureModal(true)}
                    className="w-full px-4 py-2 bg-[#9f9911] text-white font-medium rounded-lg transition hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-[#d6cf47] focus:ring-offset-2"
                  >
                    Signer le contrat
                  </button>
                  {signatureData && (
                    <p className="mt-3 text-green-600 text-sm text-center">
                      Signature enregistrée ✔️
                    </p>
                  )}
                  <p className="text-xs italic text-gray-600 text-right mt-2">
                    « Lu et approuvé »
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 mr-2"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <span className="text-sm">
                    J'ai lu et j'accepte les{" "}
                    <a
                      href="/conditions_generales"
                      target="_blank"
                      className="text-[#9f9911] underline hover:text-[#525008]"
                    >
                      Conditions Générales
                    </a>{" "}
                    et la{" "}
                    <a
                      href="#"
                      target="_blank"
                      className="text-[#9f9911] underline hover:text-[#525008]"
                    >
                      Politique de Confidentialité
                    </a>
                    .
                  </span>
                </label>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handlePrint}
                  disabled={isPrinting || !hasSignature || !termsAccepted}
                  className={`px-8 py-3 text-white rounded-lg transition-colors ${
                    isPrinting || !hasSignature || !termsAccepted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isPrinting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Traitement en cours...
                    </span>
                  ) : (
                    "Télécharger le contrat"
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="font-bold text-lg mb-2">Instructions</p>
            <ol className="text-left list-decimal pl-6 space-y-2">
              <li>Veuillez signer le document dans la zone désignée</li>
              <li>Acceptez les conditions générales</li>
              <li>Téléchargez le contrat finalisé</li>
              <li>
                Vous recevrez également une copie par email pour vos archives
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* Modal de confirmation */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Contrat signé avec succès!
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Votre contrat a été signé et enregistré. Vous pouvez maintenant
                accéder à votre espace client pour gérer votre box.
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={confirmRedirect}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#9f9911] text-base font-medium text-white hover:bg-[#6e6a0c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dfd750]"
                >
                  Accéder à mon espace client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
            <h2 className="text-lg font-bold mb-4 text-[#6e6a0c]">
              Signer le contrat
            </h2>
            <canvas
              ref={canvasRef}
              className="border border-dashed border-gray-300 w-full h-48 cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            ></canvas>
            <div className="flex justify-between mt-4">
              <button
                onClick={clearSignature}
                className="text-sm text-[#9f9911] hover:text-[#525008]"
                type="button"
              >
                Effacer
              </button>
              <button
                onClick={() => {
                  if (canvasRef.current) {
                    const dataUrl = canvasRef.current.toDataURL("image/png");
                    setSignatureData(dataUrl);
                    setHasSignature(true);
                    setShowSignatureModal(false);
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Valider la signature
              </button>
            </div>
            <button
              onClick={() => setShowSignatureModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
