import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { AirDataProvider } from '../context/AirDataContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'AirAware AI – Smart Winter Smog & Air Pollution Assistant',
  description:
    'Full-stack GenAI assistant providing real-time air quality metrics, personalized low-emission daily routines, indoor air purification guidance, and sustainability impact analytics.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <AuthProvider>
          <AirDataProvider>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-slate-900 focus:shadow-lg">Skip to main content</a>
            <Navbar />
            <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
            <Footer />
          </AirDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
