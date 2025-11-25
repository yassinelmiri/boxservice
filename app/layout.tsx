import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBotIcon from "../components/ChatBotIcon";
import Script from "next/script";

export const metadata = {
  title: {
    default: "Box Service",
    template: "%s | Box Service",
  },
  description:
    "Box Service propose des solutions de stockage flexibles et sécurisées dans toute l'Europe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="canonical" href="https://box-service.eu/" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Navbar />
        <div className="bg-white">{children}</div>
        <ChatBotIcon />
        <Footer />
        <Script id="clarity-script" strategy="afterInteractive">
          {`
             (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
             })(window, document, "clarity", "script", "s8jrld90or");
          `}
        </Script>
        
      </body>
    </html>
  );
}
