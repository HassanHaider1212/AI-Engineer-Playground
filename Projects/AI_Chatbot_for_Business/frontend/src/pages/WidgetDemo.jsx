import { useState, useEffect } from 'react';
import { botsAPI } from '../api/api';
import ChatWidget from '../components/ChatWidget';
import toast from 'react-hot-toast';

export default function WidgetDemo() {
  const [bots, setBots] = useState([]);
  const [selectedBotId, setSelectedBotId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = async () => {
    try {
      const response = await botsAPI.getAll();
      setBots(response.data);
      if (response.data.length > 0) {
        setSelectedBotId(response.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load bots');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Demo Website Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">ABC Digital Solutions</h1>
          <nav className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Services</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
          </nav>
        </div>
      </header>

      {/* Demo Website Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Our Demo Website
          </h2>
          <p className="text-xl text-gray-600">
            This is a sample website demonstrating the chat widget
          </p>
        </div>

        {/* Bot Selection Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select a Bot to Test
          </h3>
          {loading ? (
            <p className="text-gray-600">Loading bots...</p>
          ) : bots.length === 0 ? (
            <p className="text-gray-600">No bots available. Create a bot first!</p>
          ) : (
            <select
              value={selectedBotId}
              onChange={(e) => setSelectedBotId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {bots.map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name} {bot.is_trained ? '✓' : '(not trained)'}
                </option>
              ))}
            </select>
          )}
          {!selectedBotId && (
            <p className="mt-2 text-sm text-gray-500">
              Select a trained bot to see the widget
            </p>
          )}
        </div>

        {/* Sample Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Web Development
            </h3>
            <p className="text-gray-600">
              Custom websites and web applications built with modern technologies
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Mobile Apps
            </h3>
            <p className="text-gray-600">
              Native and cross-platform mobile applications for iOS and Android
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI Solutions
            </h3>
            <p className="text-gray-600">
              Artificial intelligence and machine learning solutions for your business
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            💡 Click the chat widget in the bottom-right corner to start a conversation!
          </p>
        </div>
      </main>

      {/* Chat Widget */}
      {selectedBotId && <ChatWidget botId={selectedBotId} position="bottom-right" />}
    </div>
  );
}
