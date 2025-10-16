import React, { useState, useEffect, useMemo } from 'react';
import { getCategories, getIconsByCategory } from './services/iconService';
import { Icon, IconStyle, iconStyleNames } from './types';
import { useDebounce } from './hooks/useDebounce';
import IconCard from './components/IconCard';
import IconDetailModal from './components/IconDetailModal';

const INITIAL_ICONS_COUNT = 100;
const LOAD_MORE_ICONS_COUNT = 50;

const App: React.FC = () => {
  const [categories] = useState<string[]>(getCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || '');
  const [icons, setIcons] = useState<Icon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>(IconStyle.Filled);
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [visibleIconsCount, setVisibleIconsCount] = useState(INITIAL_ICONS_COUNT);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!selectedCategory) return;
    const iconNames = getIconsByCategory(selectedCategory);
    setIcons(iconNames.map(name => ({ name })));
  }, [selectedCategory]);

  const filteredIcons = useMemo(() => {
    if (!debouncedSearchTerm) return icons;
    return icons.filter(icon =>
      icon.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [icons, debouncedSearchTerm]);

  // Reset visible icons and scroll to top when category or search term changes.
  useEffect(() => {
    setVisibleIconsCount(INITIAL_ICONS_COUNT);
    window.scrollTo(0, 0);
  }, [selectedCategory, debouncedSearchTerm]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      // Load more icons when the user is 400px from the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 400 &&
        visibleIconsCount < filteredIcons.length
      ) {
        setVisibleIconsCount(prevCount => prevCount + LOAD_MORE_ICONS_COUNT);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleIconsCount, filteredIcons.length]);

  const iconsToShow = useMemo(() => {
    return filteredIcons.slice(0, visibleIconsCount);
  }, [filteredIcons, visibleIconsCount]);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-40 p-4 border-b border-slate-700">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zM1 15a1 1 0 100 2h18a1 1 0 100-2H1z" />
            </svg>
            <h1 className="text-xl font-bold text-white">Material Icon Explorer</h1>
          </div>
          <div className="flex-grow w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
              aria-label="Search icons"
            />
          </div>
          <div className="w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition appearance-none"
              aria-label="Select icon category"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto max-w-7xl p-4">
        <div className="mb-6 flex flex-wrap justify-center gap-2">
            {Object.values(IconStyle).map((styleKey) => (
                <button
                    key={styleKey}
                    onClick={() => setSelectedStyle(styleKey)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        selectedStyle === styleKey
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                >
                    {iconStyleNames[styleKey]}
                </button>
            ))}
        </div>
        
        <p className="text-sm text-slate-400 mb-4 text-center" aria-live="polite">
          Showing {iconsToShow.length} of {filteredIcons.length} icons
        </p>

        {iconsToShow.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                {iconsToShow.map(icon => (
                    <IconCard
                        key={icon.name}
                        icon={icon}
                        category={selectedCategory}
                        style={selectedStyle}
                        onSelect={setSelectedIcon}
                    />
                ))}
            </div>
        ) : (
            <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-slate-300">No icons found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search term or selecting another category.</p>
            </div>
        )}
      </main>

      <IconDetailModal
        icon={selectedIcon}
        category={selectedCategory}
        style={selectedStyle}
        onClose={() => setSelectedIcon(null)}
      />
    </div>
  );
};

export default App;
