import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "Royal King Tailoring — Customer Records",
    description: "Professional customer measurement management for Royal King Tailoring Shop",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning className={`${inter.variable} ${poppins.variable} font-sans antialiased text-[0.925rem]`}>
                {children}
                <Toaster richColors position="top-right" />
            </body>
        </html>
    );
}
