import React, { useState, useCallback } from 'react';
import { Club, Fixture, Referee, MatchRecommendation } from '../types';
import { SOUTHAMPTON_AREAS, MOCK_REFEREES } from '../constants';
import { getSmartMatchRecommendations } from '../services/geminiService';
import { Calendar, MapPin, Loader2, UserCheck, Star, Clock, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ClubDashboardProps {
  club: Club;
  referees?: Referee[]; // Allow passing in full list including new registrations
}

const ClubDashboard: React.FC<ClubDashboardProps> = ({ club, referees = MOCK_REFEREES }) => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Record<string, MatchRecommendation[]>>({});
  
  // Form State
  const [newFixture, setNewFixture] = useState<Partial<Fixture>>({
    date: '2024-06-01',
    time: '10:00',
    location: club.location,
    ageGroup: 'U14',
    league: club.league,
    opponent: '',
  });

  const handleCreateFixture = (e: React.FormEvent) => {
    e.preventDefault();
    const fixture: Fixture = {
      id: Date.now().toString(),
      clubId: club.id,
      opponent: newFixture.opponent || 'TBD',
      date: newFixture.date!,
      time: newFixture.time!,
      location: newFixture.location!,
      league: newFixture.league!,
      ageGroup: newFixture.ageGroup!,
      status: 'OPEN',
    };
    setFixtures([...fixtures, fixture]);
    setShowAddModal(false);
  };

  const findReferee = async (fixtureId: string) => {
    setLoadingMatch(fixtureId);
    const fixture = fixtures.find(f => f.id === fixtureId);
    if (!fixture) return;

    // Filter refs available on that day (mock logic first, then AI ranking)
    const dayOfWeek = new Date(fixture.date).getDay() === 0 ? "Sunday" : "Saturday";
    const availableRefs = referees.filter(r => r.availableDays.includes(dayOfWeek));

    try {
      const recs = await getSmartMatchRecommendations(fixture, availableRefs);
      setRecommendations(prev => ({ ...prev, [fixtureId]: recs }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMatch(null);
    }
  };

  const assignReferee = (fixtureId: string, refereeId: string) => {
    setFixtures(prev => prev.map(f => 
      f.id === fixtureId ? { ...f, status: 'MATCHED', assignedRefereeId: refereeId } : f
    ));
    // Clear recommendation to clean up UI
    const newRecs = { ...recommendations };
    delete newRecs[fixtureId];
    setRecommendations(newRecs);
  };

  // Stats for chart
  const statsData = [
    { name: 'Matched', value: fixtures.filter(f => f.status === 'MATCHED').length },
    { name: 'Pending', value: fixtures.filter(f => f.status === 'OPEN').length },
    { name: 'Completed', value: fixtures.filter(f => f.status === 'COMPLETED').length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{club.name} Dashboard</h1>
          <p className="text-gray-500 mt-1">{club.league} • {club.location}</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all flex items-center gap-2"
        >
          <Calendar size={20} />
          Post New Fixture
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Fixtures List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Fixtures</h2>
          
          {fixtures.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No fixtures yet</h3>
              <p className="text-gray-500 mt-2">Post a game to start finding referees.</p>
            </div>
          ) : (
            fixtures.map(fixture => (
              <div key={fixture.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${
                          fixture.status === 'MATCHED' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {fixture.status}
                        </span>
                        <span className="text-sm text-gray-500">{fixture.ageGroup}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">vs {fixture.opponent}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {fixture.date} at {fixture.time}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {fixture.location}</span>
                      </div>
                    </div>

                    {fixture.status === 'MATCHED' && fixture.assignedRefereeId ? (
                      <div className="text-right">
                         <div className="flex items-center gap-2 text-brand-600 font-medium bg-brand-50 px-3 py-2 rounded-lg">
                           <UserCheck size={18} />
                           <span>Referee Assigned</span>
                         </div>
                         <p className="text-sm text-gray-500 mt-1">
                           {referees.find(r => r.id === fixture.assignedRefereeId)?.name}
                         </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => findReferee(fixture.id)}
                        disabled={loadingMatch === fixture.id}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {loadingMatch === fixture.id ? <Loader2 className="animate-spin" size={16} /> : <UserCheck size={16} />}
                        Find Referee
                      </button>
                    )}
                  </div>

                  {/* Recommendations Area */}
                  {recommendations[fixture.id] && (
                    <div className="mt-6 border-t border-gray-100 pt-4 bg-gray-50 -mx-6 -mb-6 p-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Star className="text-yellow-500" size={16}/> AI Recommended Referees
                      </h4>
                      <div className="space-y-3">
                        {recommendations[fixture.id].map((rec) => {
                          const ref = referees.find(r => r.id === rec.refereeId);
                          if (!ref) return null;
                          return (
                            <div key={rec.refereeId} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <img src={ref.avatarUrl} alt={ref.name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900 text-sm">{ref.name}</p>
                                    {ref.isMinor && (
                                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wide border border-amber-200">
                                            <AlertTriangle size={10} /> U18
                                        </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500">{ref.badgeLevel} • {ref.location}</p>
                                  <p className="text-xs text-brand-600 mt-1 italic">"{rec.reasoning}"</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className="text-xs font-bold text-slate-400">Match Score: {rec.score}%</span>
                                <button 
                                  onClick={() => assignReferee(fixture.id, ref.id)}
                                  className="text-xs bg-brand-100 text-brand-700 hover:bg-brand-200 px-3 py-1.5 rounded-md font-medium transition"
                                >
                                  Select
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Col: Stats */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Club Stats</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statsData}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {statsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#fbbf24' : '#94a3b8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Avg. Match Time</span>
                        <span className="font-medium">1.5 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Ref Rating</span>
                        <span className="font-medium text-yellow-600">4.8/5.0</span>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* Add Fixture Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Post New Fixture</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateFixture} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opponent</label>
                <input 
                  type="text" 
                  required
                  value={newFixture.opponent}
                  onChange={e => setNewFixture({...newFixture, opponent: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="e.g. AFC Stoneham"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={newFixture.date}
                    onChange={e => setNewFixture({...newFixture, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input 
                    type="time" 
                    required
                    value={newFixture.time}
                    onChange={e => setNewFixture({...newFixture, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select 
                  value={newFixture.location}
                  onChange={e => setNewFixture({...newFixture, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                >
                    {SOUTHAMPTON_AREAS.map(area => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                <select 
                  value={newFixture.ageGroup}
                  onChange={e => setNewFixture({...newFixture, ageGroup: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                >
                   <option value="U12">U12</option>
                   <option value="U13">U13</option>
                   <option value="U14">U14</option>
                   <option value="U15">U15</option>
                   <option value="U16">U16</option>
                   <option value="U18">U18</option>
                   <option value="Adults">Adults</option>
                </select>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-lg transition shadow-lg">
                  Post Fixture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDashboard;