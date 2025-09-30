import Header from "./header";
import Footer from "./footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f1f1]">
      <Header />
      <main className="flex-grow p-6">{children}</main>
      <Footer />
    </div>
  );
}
