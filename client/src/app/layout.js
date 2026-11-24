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
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AirDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
