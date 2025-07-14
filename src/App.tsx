import React, { useState, useEffect } from 'react';
import { Mouse, Keyboard, RotateCcw, Activity } from 'lucide-react';

interface ActivityData {
  leftClicks: number;
  rightClicks: number;
  totalKeys: number;
  keyPresses: { [key: string]: number };
}

function App() {
  const [activityData, setActivityData] = useState<ActivityData>({
    leftClicks: 0,
    rightClicks: 0,
    totalKeys: 0,
    keyPresses: {}
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('activityTracker');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setActivityData(parsed);
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever activityData changes
  useEffect(() => {
    localStorage.setItem('activityTracker', JSON.stringify(activityData));
  }, [activityData]);

  // Mouse click handler
  useEffect(() => {
    const handleMouseClick = (event: MouseEvent) => {
      setActivityData(prev => ({
        ...prev,
        leftClicks: event.button === 0 ? prev.leftClicks + 1 : prev.leftClicks,
        rightClicks: event.button === 2 ? prev.rightClicks + 1 : prev.rightClicks
      }));
    };

    // Prevent context menu on right click to better track right clicks
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    document.addEventListener('mousedown', handleMouseClick);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('mousedown', handleMouseClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
      
      setActivityData(prev => ({
        ...prev,
        totalKeys: prev.totalKeys + 1,
        keyPresses: {
          ...prev.keyPresses,
          [key]: (prev.keyPresses[key] || 0) + 1
        }
      }));
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const resetAllData = () => {
    const emptyData: ActivityData = {
      leftClicks: 0,
      rightClicks: 0,
      totalKeys: 0,
      keyPresses: {}
    };
    setActivityData(emptyData);
    localStorage.removeItem('activityTracker');
  };

  const sortedKeyPresses = Object.entries(activityData.keyPresses)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Activity Tracker</h1>
          </div>
          <p className="text-white/80 text-lg backdrop-blur-sm">Monitor your mouse clicks and keyboard activity in real-time</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Mouse Tracking */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/20 backdrop-blur-sm">
                <Mouse className="h-6 w-6 text-blue-300" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Mouse Clicks</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30 hover:bg-blue-500/30 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 font-medium">Left Clicks</span>
                  <span className="text-3xl font-bold text-blue-100 drop-shadow-md">{activityData.leftClicks}</span>
                </div>
              </div>
              
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30 hover:bg-green-500/30 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-green-200 font-medium">Right Clicks</span>
                  <span className="text-3xl font-bold text-green-100 drop-shadow-md">{activityData.rightClicks}</span>
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 font-medium">Total Clicks</span>
                  <span className="text-3xl font-bold text-white drop-shadow-md">
                    {activityData.leftClicks + activityData.rightClicks}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Tracking */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/20 backdrop-blur-sm">
                <Keyboard className="h-6 w-6 text-green-300" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Keyboard Activity</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30 hover:bg-green-500/30 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-green-200 font-medium">Total Key Presses</span>
                  <span className="text-3xl font-bold text-green-100 drop-shadow-md">{activityData.totalKeys}</span>
                </div>
              </div>
              
              <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30 hover:bg-purple-500/30 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 font-medium">Unique Keys</span>
                  <span className="text-3xl font-bold text-purple-100 drop-shadow-md">
                    {Object.keys(activityData.keyPresses).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Most Used Keys */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-6 hover:bg-white/15 transition-all duration-300 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
            Most Used Keys
          </h3>
          {sortedKeyPresses.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {sortedKeyPresses.map(([key, count], index) => (
                <div key={key} className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20 hover:from-white/30 hover:to-white/20 transition-all duration-200 transform hover:scale-105">
                  <div className="text-sm font-medium text-white/90 mb-1">
                    {key.length > 8 ? key.substring(0, 8) + '...' : key}
                  </div>
                  <div className={`text-lg font-bold drop-shadow-md ${
                    index === 0 ? 'text-yellow-300' : 
                    index === 1 ? 'text-gray-300' : 
                    index === 2 ? 'text-orange-300' : 'text-white'
                  }`}>
                    {count}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-white/60 text-lg mb-2">Start typing to see your most used keys!</div>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto"></div>
            </div>
          )}
        </div>

        {/* Reset Button */}
        <div className="text-center mb-6">
          <button
            onClick={resetAllData}
            className="inline-flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 border border-red-400/30 hover:border-red-400/50 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <RotateCcw className="h-5 w-5" />
            Reset All Data
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-amber-500/10 backdrop-blur-md border border-amber-400/30 rounded-xl p-4">
          <h4 className="font-medium text-amber-200 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            How to use:
          </h4>
          <ul className="text-sm text-amber-100/80 space-y-1">
            <li>• Click anywhere on the page to track mouse clicks</li>
            <li>• Right-click anywhere to track right clicks (context menu is disabled)</li>
            <li>• Type any key to track keyboard activity</li>
            <li>• Your data is automatically saved and will persist between sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;