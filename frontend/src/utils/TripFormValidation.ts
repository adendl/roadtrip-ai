interface Trip {
  id: number;
  from: string;
  to: string;
  roundtrip: boolean;
  days: number;
  interests: string[];
  distanceKm: number;
  createdAt: string;
}

export const validateTripForm = (trip: Trip): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!trip.from || trip.from.trim() === '') {
    errors.push('From field is required.');
  } else if (trip.from.length > 20) {
    errors.push('From field must not exceed 20 characters.');
  }

  if (!trip.to || trip.to.trim() === '') {
    errors.push('To field is required.');
  } else if (trip.to.length > 20) {
    errors.push('To field must not exceed 20 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};