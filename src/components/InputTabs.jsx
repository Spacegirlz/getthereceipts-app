import React, { useState } from 'react';
import { Camera, Type } from 'lucide-react';

const InputTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'text', label: 'Text Input', icon: Type },
    { id: 'screenshot', label: 'Screenshot', icon: Camera }
  ];

  return (
    <div className="flex gap-1 p-1 bg-gray-900/50 rounded-lg mb-4">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default InputTabs;
