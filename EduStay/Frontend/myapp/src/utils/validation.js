// Validation utility functions
export const validateProperty = (property) => {
  const errors = {};

  // Title validation
  if (!property.title?.trim()) {
    errors.title = 'Title is required';
  } else if (property.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  // Location validation
  if (!property.location?.trim()) {
    errors.location = 'Location is required';
  } else if (property.location.length < 5) {
    errors.location = 'Please enter a complete address';
  }

  // Rent validation
  if (!property.rent) {
    errors.rent = 'Rent is required';
  } else if (property.rent < 1000) {
    errors.rent = 'Rent must be at least ₹1,000';
  } else if (property.rent > 100000) {
    errors.rent = 'Rent cannot exceed ₹1,00,000';
  }

  // Description validation
  if (!property.description?.trim()) {
    errors.description = 'Description is required';
  } else if (property.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  return errors;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validatePincode = (pincode) => {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
};

export const validateSearch = (location, minPrice, maxPrice) => {
  const errors = {};

  // Location validation
  if (!location?.trim()) {
    errors.location = 'Please enter a location to search';
  } else if (location.trim().length < 2) {
    errors.location = 'Location must be at least 2 characters';
  }

  // Price validation
  if (minPrice && minPrice < 0) {
    errors.minPrice = 'Minimum price cannot be negative';
  }
  
  if (maxPrice && maxPrice < 0) {
    errors.maxPrice = 'Maximum price cannot be negative';
  }
  
  if (minPrice && maxPrice && parseInt(minPrice) > parseInt(maxPrice)) {
    errors.priceRange = 'Minimum price cannot be greater than maximum price';
  }

  return errors;
};