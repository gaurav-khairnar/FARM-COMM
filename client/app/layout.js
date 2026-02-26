import './globals.css';
import Providers from '@/lib/providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Farm-Connect - Fresh Produce from Local Farms',
  description: 'Connect with local farmers and buy fresh, organic produce delivered to your doorstep. Support sustainable farming.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-7xl px-4 py-8 md:px-6">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
