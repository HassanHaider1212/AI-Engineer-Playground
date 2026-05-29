import { useState, useEffect, useRef } from 'react';
import { botsAPI } from '../api/api';
import toast from 'react-hot-toast';
import { Code, Play, Trash2 } from 'lucide-react';

export default function EmbedTester() {
  const [embedCode, setEmbedCode] = useState('');
  const [bots, setBots] = useState([]);
  const [selectedBot, setSelectedBot] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const scriptContainerRef = useRef(null);

  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = async () => {
    try {
      const response = await botsAPI.getAll();
      setBots(response.data);
    } catch (error) {
      toast.error('Failed to load bots');
    }
  };

  const handleBotSelect = (bot) => {
    setSelectedBot(bot);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const code = `<script>
  window.chatbotConfig = {
    botId: '${bot.id}',
    apiUrl: '${apiUrl}'
  };
<\/script>
<script src="http://localhost:3000/widget.js"><\/script>`;
    setEmbedCode(code);
  };

  const runEmbedCode = () => {
    if (!embedCode.trim()) {
      toast.error('Please enter embed code first');
      return;
    }

    // Clear previous scripts
    if (scriptContainerRef.current) {
      scriptContainerRef.current.innerHTML = '';
    }

    // Create a temporary container to execute the code
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = embedCode;
    
    // Execute scripts
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.head.appendChild(newScript);
    });

    setIsRunning(true);
    toast.success('Widget loaded!');
  };

  const stopWidget = () => {
    // Reload the page to clear the widget (simplest way to remove it)
    window.location.reload();
  };

  const clearCode = () => {
    setEmbedCode('');
    setSelectedBot(null);
    setIsRunning(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Embed Widget Tester</h1>
        <p className="text-gray-600 mt-2">Test your chatbot widget embed code in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Code Editor */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Select Bot</h2>
            <div className="grid grid-cols-2 gap-3">
              {bots.map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => handleBotSelect(bot)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedBot?.id === bot.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {bot.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {bot.is_trained ? '✓ Trained' : 'Not trained'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Embed Code</h2>
              <button
                onClick={clearCode}
                className="text-gray-500 hover:text-gray-700"
                title="Clear"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <textarea
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              placeholder="Paste your embed code here or select a bot above..."
              className="w-full h-48 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg resize-none"
              spellCheck={false}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={runEmbedCode}
                disabled={!embedCode.trim() || isRunning}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Play size={18} />
                Run Widget
              </button>
              {isRunning && (
                <button
                  onClick={stopWidget}
                  className="btn-secondary flex-1"
                >
                  Stop / Reset
                </button>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>Select a bot from above or paste custom embed code</li>
              <li>Click "Run Widget" to load the chat widget</li>
              <li>The widget will appear in the bottom-right corner</li>
              <li>Test the chat functionality</li>
              <li>Click "Stop / Reset" to clear and try again</li>
            </ol>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Live Preview</h2>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg h-full min-h-[500px] p-8 relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Sample Website
              </h3>
              <p className="text-gray-600">
                This simulates a customer-facing website
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-3xl mb-2">🚀</div>
                <h4 className="font-semibold">Web Development</h4>
                <p className="text-sm text-gray-600">Custom websites</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-3xl mb-2">📱</div>
                <h4 className="font-semibold">Mobile Apps</h4>
                <p className="text-sm text-gray-600">iOS & Android</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-3xl mb-2">🤖</div>
                <h4 className="font-semibold">AI Solutions</h4>
                <p className="text-sm text-gray-600">Machine Learning</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-3xl mb-2">💼</div>
                <h4 className="font-semibold">Consulting</h4>
                <p className="text-sm text-gray-600">Business Strategy</p>
              </div>
            </div>

            {!isRunning && (
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">💬</div>
                <p>Select a bot and click "Run Widget" to see the chat widget</p>
              </div>
            )}

            <div ref={scriptContainerRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
