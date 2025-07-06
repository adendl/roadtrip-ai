/**
 * Utility function to generate a Google search URL for a place of interest
 * @param placeName - The name of the place to search for
 * @param location - Optional location context to improve search results
 * @returns A Google search URL
 */
export const generateGoogleSearchUrl = (placeName: string, location?: string): string => {
  // Encode the place name for URL
  const encodedPlaceName = encodeURIComponent(placeName);
  
  // If location is provided, include it in the search for better results
  const searchQuery = location 
    ? `${placeName} ${location}`
    : placeName;
  
  const encodedSearchQuery = encodeURIComponent(searchQuery);
  
  return `https://www.google.com/search?q=${encodedSearchQuery}`;
};

/**
 * Opens a Google search for a place of interest in a new tab
 * @param placeName - The name of the place to search for
 * @param location - Optional location context
 */
export const openGoogleSearch = (placeName: string, location?: string): void => {
  const url = generateGoogleSearchUrl(placeName, location);
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Utility function to generate a Booking.com search URL for accommodation
 * @param destination - The destination name to search for accommodation
 * @returns A Booking.com search URL
 */
export const generateBookingSearchUrl = (destination: string): string => {
  // Encode the destination for URL
  const encodedDestination = encodeURIComponent(destination);
  
  // Booking.com search URL format
  return `https://www.booking.com/search.html?ss=${encodedDestination}`;
};

/**
 * Opens a Booking.com search for accommodation in a new tab
 * @param destination - The destination name to search for accommodation
 */
export const openBookingSearch = (destination: string): void => {
  const url = generateBookingSearchUrl(destination);
  window.open(url, '_blank', 'noopener,noreferrer');
}; 