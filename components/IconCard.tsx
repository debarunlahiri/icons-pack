import React from 'react';
import { getIconUrl } from '../services/iconService';
import { Icon, IconStyle } from '../types';

interface IconCardProps {
  icon: Icon;
  category: string;
  style: IconStyle;
  onSelect: (icon: Icon) => void;
}

const IconCard: React.FC<IconCardProps> = ({ icon, category, style, onSelect }) => {
  const iconUrl = getIconUrl(category, icon.name, style);

  return (
    <div
      onClick={() => onSelect(icon)}
      className="flex flex-col items-center justify-center p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-sky-500/20 hover:ring-2 hover:ring-sky-500 transition-all duration-200 aspect-square group"
    >
      <img
        src={iconUrl}
        alt={icon.name}
        className="w-12 h-12 mb-2 invert"
        width="48"
        height="48"
        loading="lazy"
      />
      <p className="text-center text-xs text-slate-400 group-hover:text-sky-300 break-all">{icon.name}</p>
    </div>
  );
};

export default IconCard;
