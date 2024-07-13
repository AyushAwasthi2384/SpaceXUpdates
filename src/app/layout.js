import StoreProvider from "./StoreProvider";
import "./globals.css";

export const metadata = {
  title: "SpaceX Launches",
  description: "A list of SpaceX launches",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body><StoreProvider>{children}</StoreProvider></body>
    </html>
  );
}
