import { iconData } from './icon-data';

const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/google/material-design-icons@master/src';

/**
 * Gets a sorted list of all icon categories from the local data store.
 * @returns An array of category names.
 */
export const getCategories = (): string[] => {
  return Object.keys(iconData).sort();
};

/**
 * Gets a sorted list of icon names for a given category from the local data store.
 * @param category The category to fetch icons for.
 * @returns An array of icon names.
 */
export const getIconsByCategory = (category: string): string[] => {
  if (!category || !iconData[category]) return [];
  return iconData[category];
};

/**
 * Constructs the CDN URL for a specific icon SVG.
 * @param category The icon's category.
 * @param iconName The icon's name.
 * @param style The icon's style (e.g., 'materialicons').
 * @returns The full URL to the icon SVG.
 */
export const getIconUrl = (category: string, iconName: string, style: string): string => {
  return `${CDN_BASE_URL}/${category}/${iconName}/${style}/24px.svg`;
};
