import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "./header/Header";
import { AuthContextProvider } from "./context/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TeloMapp",
  description: "TeloMapp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="telomapp">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
      <AuthContextProvider>
            <Header />
            <main className="w-full h-full">
              <div className="container py-6">
                {children}
              </div>
              
            </main>
        </AuthContextProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
