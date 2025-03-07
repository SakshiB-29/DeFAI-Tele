import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Switch } from '@headlessui/react';
import axios from 'axios';

interface AlertSettings {
  whale_movements: boolean;
  risk_alerts: boolean;
  contract_interactions: boolean;
  price_impacts: boolean;
  email_notifications: boolean;
  telegram_notifications: boolean;
}

interface UserPreferences {
  min_transaction_value: number;
  risk_threshold: number;
  update_frequency: string;
  theme: string;
}

const Settings: React.FC = () => {
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    whale_movements: true,
    risk_alerts: true,
    contract_interactions: true,
    price_impacts: true,
    email_notifications: false,
    telegram_notifications: true,
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    min_transaction_value: 100,
    risk_threshold: 0.7,
    update_frequency: '5m',
    theme: 'light',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [alertsRes, prefsRes] = await Promise.all([
          axios.get('/api/v1/settings/alerts'),
          axios.get('/api/v1/settings/preferences'),
        ]);

        setAlertSettings(alertsRes.data);
        setPreferences(prefsRes.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleAlertToggle = async (setting: keyof AlertSettings) => {
    try {
      setSaving(true);
      const newSettings = { ...alertSettings, [setting]: !alertSettings[setting] };
      await axios.post('/api/v1/settings/alerts', newSettings);
      setAlertSettings(newSettings);
    } catch (error) {
      console.error('Error updating alert settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = async (setting: keyof UserPreferences, value: any) => {
    try {
      setSaving(true);
      const newPreferences = { ...preferences, [setting]: value };
      await axios.post('/api/v1/settings/preferences', newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Alert Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Alert Settings</h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure which alerts you want to receive
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="space-y-4">
              {Object.entries(alertSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </label>
                  </div>
                  <Switch
                    checked={value}
                    onChange={() => handleAlertToggle(key as keyof AlertSettings)}
                    className={`${
                      value ? 'bg-primary-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        value ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Preferences */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Preferences</h3>
            <p className="mt-1 text-sm text-gray-500">
              Customize your tracking preferences
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="space-y-6">
              {/* Minimum Transaction Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Transaction Value (ETH)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    value={preferences.min_transaction_value}
                    onChange={(e) => handlePreferenceChange('min_transaction_value', parseFloat(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Risk Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Risk Threshold
                </label>
                <div className="mt-1">
                  <input
                    type="range"
                    value={preferences.risk_threshold}
                    onChange={(e) => handlePreferenceChange('risk_threshold', parseFloat(e.target.value))}
                    className="block w-full"
                    min="0"
                    max="1"
                    step="0.1"
                  />
                  <div className="mt-1 text-sm text-gray-500">
                    {(preferences.risk_threshold * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Update Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Update Frequency
                </label>
                <div className="mt-1">
                  <select
                    value={preferences.update_frequency}
                    onChange={(e) => handlePreferenceChange('update_frequency', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="1m">1 minute</option>
                    <option value="5m">5 minutes</option>
                    <option value="15m">15 minutes</option>
                    <option value="30m">30 minutes</option>
                    <option value="1h">1 hour</option>
                  </select>
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Theme
                </label>
                <div className="mt-1">
                  <select
                    value={preferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Status */}
        {saving && (
          <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <span className="block sm:inline">Saving changes...</span>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Settings; 