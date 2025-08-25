import React, { useState } from 'react';

interface SettingsPageProps {
  className?: string;
}

interface SettingsState {
  notifications: boolean;
  autoplay: boolean;
  darkMode: boolean;
  language: string;
  quality: string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ className }) => {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    autoplay: false,
    darkMode: false,
    language: 'en',
    quality: 'auto'
  });

  const handleSettingChange = (key: keyof SettingsState, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`settings-page ${className || ''}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Playback</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Autoplay</label>
                <input
                  type="checkbox"
                  checked={settings.autoplay}
                  onChange={(e) => handleSettingChange('autoplay', e.target.checked)}
                  className="toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Video Quality</label>
                <select
                  value={settings.quality}
                  onChange={(e) => handleSettingChange('quality', e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="auto">Auto</option>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className="toggle"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Dark Mode</label>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                  className="toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;