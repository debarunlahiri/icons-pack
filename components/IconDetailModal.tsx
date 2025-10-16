import React, { useState, useCallback } from 'react';
import { Icon, IconStyle, DownloadFormat } from '../types';
import { getIconUrl } from '../services/iconService';

interface IconDetailModalProps {
  icon: Icon | null;
  category: string;
  style: IconStyle;
  onClose: () => void;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const IconDetailModal: React.FC<IconDetailModalProps> = ({ icon, category, style, onClose }) => {
  const [downloadSize, setDownloadSize] = useState<number>(128);
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('svg');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownload = useCallback(async () => {
    if (!icon) return;
    setIsDownloading(true);

    try {
      const svgUrl = getIconUrl(category, icon.name, style);
      const response = await fetch(svgUrl);
      const svgText = await response.text();

      if (downloadFormat === 'svg') {
        const blob = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${icon.name}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else { // png
        const canvas = document.createElement('canvas');
        canvas.width = downloadSize;
        canvas.height = downloadSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not get canvas context");

        const img = new Image();
        const svgBlob = new Blob([svgText], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          ctx.drawImage(img, 0, 0, downloadSize, downloadSize);
          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `${icon.name}_${downloadSize}px.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        };
        img.onerror = () => {
            console.error("Image loading failed");
            URL.revokeObjectURL(url);
        }
        img.src = url;
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('An error occurred during download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [icon, category, style, downloadFormat, downloadSize]);

  if (!icon) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative transform transition-all duration-300 ease-in-out scale-95 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon/>
        </button>
        <div className="text-center">
          <div className="bg-slate-700/50 rounded-lg p-6 inline-block mb-6">
            <img
              src={getIconUrl(category, icon.name, style)}
              alt={icon.name}
              className="w-24 h-24 invert"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 break-words">{icon.name}</h2>
          <p className="text-slate-400 mb-6">Customize and download your icon.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Format</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDownloadFormat('svg')}
                className={`py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                  downloadFormat === 'svg' ? 'bg-sky-500 text-white' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                SVG
              </button>
              <button
                onClick={() => setDownloadFormat('png')}
                className={`py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                  downloadFormat === 'png' ? 'bg-sky-500 text-white' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                PNG
              </button>
            </div>
          </div>

          {downloadFormat === 'png' && (
            <div className="animate-fade-in">
              <label htmlFor="size-slider" className="block text-sm font-medium text-slate-300 mb-2">
                Size: <span className="font-bold text-sky-400">{downloadSize}px</span>
              </label>
              <input
                id="size-slider"
                type="range"
                min="16"
                max="512"
                step="16"
                value={downloadSize}
                onChange={(e) => setDownloadSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          )}

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                </>
            ) : (
                <>
                    <DownloadIcon />
                    Download
                </>
            )}
          </button>
        </div>
      </div>
       <style>{`
            .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
            @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default IconDetailModal;
