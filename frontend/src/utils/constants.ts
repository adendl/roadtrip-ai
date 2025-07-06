// Interest types available for trip planning
export const INTEREST_TYPES = [
  'adventure',
  'food', 
  'culture',
  'sightseeing',
  'nature',
  'history',
  'art',
  'music',
  'sports',
  'relaxation',
  'shopping',
  'nightlife'
] as const;

export type InterestType = typeof INTEREST_TYPES[number];

// Helper function to format interest names for display
export const formatInterestName = (interest: string): string => {
  return interest.charAt(0).toUpperCase() + interest.slice(1);
}; 