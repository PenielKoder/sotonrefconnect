import React from 'react';
import { UserRole } from '../types';
import { Shield, User, LogOut, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800">
      <nav className="bg-brand-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
              <Shield className="h-8 w-8 text-brand-300" />
              <span className="ml-2 text-xl font-bold tracking-tight">SotonRefConnect</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {userRole === UserRole.GUEST ? (
                  <>
                    <button onClick={() => onNavigate('login-club')} className="hover:bg-brand-700 px-3 py-2 rounded-md text-sm font-medium transition">Club Login</button>
                    <button onClick={() => onNavigate('login-ref')} className="bg-brand-600 hover:bg-brand-500 px-3 py-2 rounded-md text-sm font-medium transition shadow-sm">Referee Sign Up</button>
                  </>
                ) : (
                  <div className="flex items-center space-x-4">
                    <span className="text-brand-200 text-sm">Logged in as {userRole === UserRole.CLUB ? 'Club Admin' : 'Referee'}</span>
                    <button 
                      onClick={onLogout}
                      className="flex items-center space-x-1 hover:bg-brand-700 px-3 py-2 rounded-md text-sm font-medium transition text-red-200 hover:text-white"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-brand-700 inline-flex items-center justify-center p-2 rounded-md text-brand-200 hover:text-white hover:bg-brand-600 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
               {userRole === UserRole.GUEST ? (
                  <>
                    <button onClick={() => { onNavigate('login-club'); setIsMenuOpen(false); }} className="block w-full text-left hover:bg-brand-600 px-3 py-2 rounded-md text-base font-medium">Club Login</button>
                    <button onClick={() => { onNavigate('login-ref'); setIsMenuOpen(false); }} className="block w-full text-left hover:bg-brand-600 px-3 py-2 rounded-md text-base font-medium">Referee Sign Up</button>
                  </>
                ) : (
                  <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="block w-full text-left hover:bg-brand-600 px-3 py-2 rounded-md text-base font-medium text-red-300">Logout</button>
                )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2024 SotonRefConnect. Supporting Grassroots Football in Hampshire.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;