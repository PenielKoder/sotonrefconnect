import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ClubDashboard from './components/ClubDashboard';
import RefereeDashboard from './components/RefereeDashboard';
import RefereeRegistration from './components/RefereeRegistration';
import { UserRole, Club, Referee } from './types';
import { MOCK_CLUBS, MOCK_REFEREES } from './constants';
import { Shield, Users, CheckCircle, ArrowRight, Download } from 'lucide-react';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  const [currentUser, setCurrentUser] = useState<Club | Referee | null>(null);
  const [currentView, setCurrentView] = useState('landing');
  const [showRefRegistration, setShowRefRegistration] = useState(false);
  
  // State to hold all referees including new registrations
  const [allReferees, setAllReferees] = useState<Referee[]>(MOCK_REFEREES);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.CLUB) {
      setCurrentUser(MOCK_CLUBS[0]); // Demo: Log in as first club
      setCurrentView('dashboard');
    } else if (role === UserRole.REFEREE) {
      setCurrentUser(allReferees[0]); 
      setCurrentView('dashboard');
    }
  };

  const handleRefereeRegistration = (newReferee: Referee) => {
    setAllReferees(prev => [...prev, newReferee]);
    setShowRefRegistration(false);
    setCurrentUser(newReferee);
    setUserRole(UserRole.REFEREE);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserRole(UserRole.GUEST);
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleNavigate = (view: string) => {
      if (view === 'home') {
          if (userRole === UserRole.GUEST) setCurrentView('landing');
          else setCurrentView('dashboard');
      } else if (view === 'login-club') {
          handleLogin(UserRole.CLUB);
      } else if (view === 'login-ref') {
          setShowRefRegistration(true);
      }
  };

  const renderContent = () => {
    if (userRole === UserRole.CLUB && currentUser) {
      return <ClubDashboard club={currentUser as Club} referees={allReferees} />;
    }
    if (userRole === UserRole.REFEREE && currentUser) {
      return <RefereeDashboard referee={currentUser as Referee} />;
    }

    return (
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-slate-900 pb-16 sm:pb-24">
           <div className="absolute inset-0">
               <img 
                 className="h-full w-full object-cover opacity-20"
                 src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=2093&q=80"
                 alt="Football Referee"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40"></div>
           </div>
           
           <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8 flex flex-col items-center text-center">
             <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
               Grassroots football,<br />
               <span className="text-brand-400">Professionally officiated.</span>
             </h1>
             <p className="mt-6 max-w-2xl text-xl text-slate-300">
               Southampton's premier platform connecting local leagues and clubs with qualified referees instantly. Powered by AI matchmaking.
             </p>
             <div className="mt-10 flex flex-wrap gap-4 justify-center">
               <button 
                 onClick={() => handleLogin(UserRole.CLUB)}
                 className="flex items-center gap-2 rounded-full bg-brand-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-brand-400 hover:scale-105"
               >
                 I'm a Club <ArrowRight size={18}/>
               </button>
               <button 
                 onClick={() => setShowRefRegistration(true)}
                 className="flex items-center gap-2 rounded-full bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
               >
                 Referee Sign Up
               </button>
               
               {deferredPrompt && (
                 <button 
                   onClick={handleInstallClick}
                   className="flex items-center gap-2 rounded-full bg-slate-800 border border-slate-700 px-8 py-4 text-base font-semibold text-brand-300 shadow-lg transition hover:bg-slate-700 hover:text-white"
                 >
                   <Download size={18}/> Install App
                 </button>
               )}
             </div>
           </div>
        </div>

        {/* Features Grid */}
        <div className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-brand-600">Why SotonRefConnect?</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Solving the Sunday League struggle
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                No more frantic phone calls on Saturday night. We use smart technology to ensure every game in Southampton has the right official.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-brand-600">
                       <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    Verified Officials
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">All referees are vetted for current FA badges and safeguarding qualifications. Quality you can trust for your players.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-brand-600">
                       <Users className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    Smart Matching
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Our AI matches referees based on location proximity, experience level, and league difficulty to ensure a fair game.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-brand-600">
                       <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    Reliable Scheduling
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Referees confirm availability instantly. Clubs get notified immediately. Reduce the risk of cancelled games.</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout userRole={userRole} onLogout={handleLogout} onNavigate={handleNavigate}>
      {renderContent()}
      {showRefRegistration && (
        <RefereeRegistration 
          onRegister={handleRefereeRegistration} 
          onCancel={() => setShowRefRegistration(false)} 
        />
      )}
    </Layout>
  );
};

export default App;