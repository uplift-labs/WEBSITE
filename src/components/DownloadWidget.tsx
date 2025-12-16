import React, { useState, useEffect } from 'react';
import { HeroData } from '@/lib/types';
import { DownloadIcon, AppleIcon, WindowsIcon, LinuxIcon } from './Icons';

interface DownloadWidgetProps {
  data: HeroData;
}

const DownloadWidget: React.FC<DownloadWidgetProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'windows'>('windows');
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isAvailable, setIsAvailable] = useState(false);

  const currentDownload = data.downloads[activeTab];
  const downloadUrl = 'https://avenindia.blob.core.windows.net/avenstorage/Uplift.exe';

  // Countdown timer to 10AM CET
  useEffect(() => {
    const getCETDate = () => {
      const now = new Date();
      // Get current date/time in CET/CEST timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      const parts = formatter.formatToParts(now);
      const cetDate = new Date(
        parseInt(parts.find(p => p.type === 'year')!.value),
        parseInt(parts.find(p => p.type === 'month')!.value) - 1,
        parseInt(parts.find(p => p.type === 'day')!.value),
        parseInt(parts.find(p => p.type === 'hour')!.value),
        parseInt(parts.find(p => p.type === 'minute')!.value),
        parseInt(parts.find(p => p.type === 'second')!.value)
      );
      
      return cetDate;
    };

    const getNext10PMCET = () => {
      const now = new Date();
      const cetNow = getCETDate();
      
      // Create target date for today at 10AM CET
      const targetCET = new Date(cetNow);
      targetCET.setHours(10, 0, 0, 0); // 10AM = 10:00
      
      // If it's already past 10PM today, set target to tomorrow
      if (cetNow >= targetCET) {
        targetCET.setDate(targetCET.getDate() + 1);
      }
      
      // Calculate the difference in milliseconds
      const cetDiff = targetCET.getTime() - cetNow.getTime();
      // Add the difference to current local time
      return new Date(now.getTime() + cetDiff);
    };
    
    const updateTimer = () => {
      const cetNow = getCETDate();
      const now = new Date();
      const target = getNext10PMCET();
      const difference = target.getTime() - now.getTime();

      // Check if current CET time is 10AM or later
      if (difference <= 0 || cetNow.getHours() >= 10) {
        setIsAvailable(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
      setIsAvailable(false);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadClick = () => {
    setShowModal(true);
  };

  const handleConfirmDownload = () => {
    setShowModal(false);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Uplift.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCancelDownload = () => {
    setShowModal(false);
  };

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <>
      <div className="mt-12 w-full max-w-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
        
        {/* OS Selection Tabs */}
        <div className="flex items-center space-x-6 mb-4 ml-1">

          <button
            onClick={() => setActiveTab('windows')}
            className={`flex items-center space-x-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 pb-2 border-b-2 ${
              activeTab === 'windows' 
                ? 'text-white border-primary' 
                : 'text-muted border-transparent hover:text-white'
            }`}
          >
            <WindowsIcon className="w-4 h-4" />
            <span>Windows</span>
          </button>

        </div>

        {/* Main Download Button Container */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {isAvailable ? (
            <button
              onClick={handleDownloadClick}
              className="group relative overflow-hidden bg-white text-black text-sm md:text-base py-4 px-8 rounded-sm w-full sm:w-auto min-w-[240px] flex items-center justify-center space-x-3 hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Download</span>
            </button>
          ) : (
            <div className="group relative overflow-hidden bg-white/10 border border-white/20 text-white text-sm md:text-base py-4 px-8 rounded-sm w-full sm:w-auto min-w-[240px] flex items-center justify-center space-x-3">
              <span className="font-mono text-sm md:text-base">
                {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
              </span>
            </div>
          )}

          <div className="flex flex-col justify-center">
              <span className="text-gray-300 text-sm font-mono">{currentDownload.version}</span>
              <span className="text-muted text-xs mt-0.5">SHA256 Signed</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={handleCancelDownload}
        >
          <div 
            className="bg-background border border-white/10 rounded-sm p-6 md:p-8 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCancelDownload}
              className="absolute top-4 right-4 text-muted hover:text-white transition-colors duration-300"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Primary indicator dot */}
            <div className="flex items-center mb-6">
              <span className="w-2 h-2 rounded-full bg-primary mr-3 shadow-[0_0_8px_rgba(255,85,0,0.6)]"></span>
              <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                MVP Version Notice
              </h3>
            </div>

            <p className="text-gray-300 text-sm md:text-base mb-8 leading-relaxed pl-5">
              This is an MVP version. Users might face some bugs. Please cooperate and show us support.
            </p>

            <div className="flex items-center space-x-3 pl-5">
              <button
                onClick={handleConfirmDownload}
                className="flex-1 bg-white text-black text-sm md:text-base py-3 px-6 rounded-sm font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Continue Download
              </button>
              <button
                onClick={handleCancelDownload}
                className="flex-1 bg-transparent border border-white/20 text-white text-sm md:text-base py-3 px-6 rounded-sm font-semibold hover:border-primary hover:text-primary transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DownloadWidget;