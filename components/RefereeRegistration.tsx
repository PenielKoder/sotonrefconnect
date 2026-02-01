import React, { useState, useEffect } from 'react';
import { Referee } from '../types';
import { Shield, AlertTriangle, CheckCircle, User, Calendar } from 'lucide-react';
import { SOUTHAMPTON_AREAS } from '../constants';

interface RefereeRegistrationProps {
  onRegister: (referee: Referee) => void;
  onCancel: () => void;
}

const RefereeRegistration: React.FC<RefereeRegistrationProps> = ({ onRegister, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    faNumber: '',
    dob: '',
    location: SOUTHAMPTON_AREAS[0],
    badgeLevel: 'Level 7',
    parentName: '',
    parentEmail: '',
  });

  const [isMinor, setIsMinor] = useState(false);

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setIsMinor(age < 18);
    }
  }, [formData.dob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReferee: Referee = {
      id: `r-${Date.now()}`,
      name: formData.name,
      badgeLevel: formData.badgeLevel,
      location: formData.location,
      experienceYears: 0, 
      availableDays: ["Saturday", "Sunday"],
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=0D8ABC&color=fff`,
      faNumber: formData.faNumber,
      dob: formData.dob,
      isMinor: isMinor,
      parentContact: isMinor ? formData.parentEmail : undefined
    };

    onRegister(newReferee);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-brand-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3 text-white">
            <Shield className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Referee Registration</h2>
              <p className="text-brand-100 text-sm">Join the Southampton Match Officials Pool</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User size={20} className="text-gray-400"/> Personal Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. James Ward-Prowse"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FA Number (FAN)</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  value={formData.faNumber}
                  onChange={e => setFormData({...formData, faNumber: e.target.value})}
                  placeholder="8-digit FA Number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input 
                  required
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  value={formData.dob}
                  onChange={e => setFormData({...formData, dob: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge Level</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  value={formData.badgeLevel}
                  onChange={e => setFormData({...formData, badgeLevel: e.target.value})}
                >
                  <option value="Level 9 (Trainee)">Level 9 (Trainee)</option>
                  <option value="Level 7 (Junior)">Level 7 (Junior)</option>
                  <option value="Level 6 (County)">Level 6 (County)</option>
                  <option value="Level 5 (Senior)">Level 5 (Senior)</option>
                  <option value="Level 4">Level 4</option>
                </select>
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Based In (Southampton Area)</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                >
                  {SOUTHAMPTON_AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
            </div>
          </div>

          {isMinor && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="text-amber-600 shrink-0 mt-1" />
                <div>
                  <h4 className="text-amber-800 font-bold">Under 18 Safeguarding Notice</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    As you are under 18, we require parent/guardian consent. Your parent will be copied into all assignment emails in compliance with Hampshire FA safeguarding rules.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                  <input 
                    required={isMinor}
                    type="text" 
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                    value={formData.parentName}
                    onChange={e => setFormData({...formData, parentName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Email</label>
                  <input 
                    required={isMinor}
                    type="email" 
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                    value={formData.parentEmail}
                    onChange={e => setFormData({...formData, parentEmail: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex gap-3 border-t border-gray-100">
             <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-6 py-3 bg-brand-600 rounded-lg text-white font-bold hover:bg-brand-700 transition shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefereeRegistration;