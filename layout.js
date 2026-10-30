import "./globals.css";

export const metadata = {
  title: "MAISON TEMPS — Time is Your Signature",
  description: "Discover the art of exceptional timekeeping.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}