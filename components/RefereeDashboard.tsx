import React, { useState, useEffect } from 'react';
import { Referee, Fixture } from '../types';
import { generatePreMatchBrief } from '../services/geminiService';
import { Calendar, MapPin, CheckCircle, Clock, Info } from 'lucide-react';

interface RefereeDashboardProps {
  referee: Referee;
}

// Mock some initial fixtures assigned to this ref for demo purposes
const DEMO_ASSIGNED_FIXTURES: Fixture[] = [
  {
    id: "f_demo_1",
    clubId: "c2",
    opponent: "Sholing FC",
    date: "2024-06-02",
    time: "10:30",
    location: "Bitterne Park",
    league: "Tyro League",
    ageGroup: "U15",
    status: 'MATCHED',
    assignedRefereeId: "r1"
  }
];

const RefereeDashboard: React.FC<RefereeDashboardProps> = ({ referee }) => {
  const [assignedGames, setAssignedGames] = useState<Fixture[]>(DEMO_ASSIGNED_FIXTURES);
  const [briefs, setBriefs] = useState<Record<string, string>>({});

  useEffect(() => {
    // Generate AI briefs for assigned games on load
    const loadBriefs = async () => {
      const newBriefs: Record<string, string> = {};
      for (const game of assignedGames) {
        if (!briefs[game.id]) {
            newBriefs[game.id] = await generatePreMatchBrief(game, referee.name);
        }
      }
      setBriefs(prev => ({...prev, ...newBriefs}));
    };
    loadBriefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedGames]); // Only run when games change, not when briefs change

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
        <img src={referee.avatarUrl} alt={referee.name} className="w-24 h-24 rounded-full border-4 border-brand-100" />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {referee.name}</h1>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">{referee.badgeLevel}</span>
            <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-medium">{referee.location} Based</span>
          </div>
        </div>
        <div className="md:ml-auto flex gap-4 text-center">
            <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-2xl font-bold text-brand-600">12</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Games Ref'd</p>
            </div>
             <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-2xl font-bold text-slate-700">£360</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Earned</p>
            </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Calendar className="text-brand-600" />
        Your Upcoming Matches
      </h2>

      <div className="grid gap-6">
        {assignedGames.map(game => (
          <div key={game.id} className="bg-white rounded-xl shadow-md border-l-4 border-brand-500 overflow-hidden relative">
            <div className="p-6 md:flex justify-between items-start">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-brand-100 text-brand-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Confirmed</span>
                    <span className="text-gray-400 text-sm">{game.league}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{game.ageGroup} Match</h3>
                <p className="text-lg text-gray-700 font-medium">vs {game.opponent}</p>
                
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <Clock size={16} className="text-brand-600" />
                    <span>{game.date} @ {game.time}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <MapPin size={16} className="text-brand-600" />
                    <span>{game.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-0 md:ml-8 md:w-1/3 bg-blue-50 rounded-xl p-4 border border-blue-100">
                 <h4 className="text-blue-800 font-semibold text-sm mb-2 flex items-center gap-2">
                    <Info size={14} /> AI Assistant Brief
                 </h4>
                 {briefs[game.id] ? (
                     <p className="text-blue-700 text-sm italic leading-relaxed">"{briefs[game.id]}"</p>
                 ) : (
                     <div className="animate-pulse h-12 bg-blue-200/50 rounded"></div>
                 )}
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
                <button className="text-sm font-medium text-brand-700 hover:text-brand-900 flex items-center gap-1">
                    View Full Match Card →
                </button>
            </div>
          </div>
        ))}

        {assignedGames.length === 0 && (
             <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                 <p className="text-gray-500">No games assigned yet. Keep your availability updated!</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default RefereeDashboard;