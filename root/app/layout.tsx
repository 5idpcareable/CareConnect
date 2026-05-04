import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import BootstrapClient from "./components/BootstrapClient";

export const metadata = {
  title: "CareAble",
  description: "Supporting hidden carers through skill recognition",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}