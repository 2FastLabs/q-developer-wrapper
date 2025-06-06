/**
 * Validates if the provided string is a properly formatted email address.
 * 
 * This function checks if an email:
 * - Contains a single @ symbol
 * - Has at least one character before the @ symbol
 * - Has a domain with at least one character followed by a dot
 * - Has a TLD with at least two characters
 * 
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  
  // Regular expression for basic email validation
  // This pattern checks for:
  // - One or more characters before the @ symbol
  // - The @ symbol
  // - One or more characters for the domain name
  // - A dot
  // - At least two characters for the TLD
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  
  return emailRegex.test(email);
}

/**
 * Extended email validator with detailed error reporting
 * 
 * @param email - The email address to validate
 * @returns An object with validation result and any error message
 */
export function validateEmailWithDetails(email: string): { 
  isValid: boolean; 
  errorMessage?: string 
} {
  if (!email) {
    return { 
      isValid: false, 
      errorMessage: 'Email cannot be empty' 
    };
  }

  if (!email.includes('@')) {
    return { 
      isValid: false, 
      errorMessage: 'Email must contain an @ symbol' 
    };
  }

  const [localPart, domainPart] = email.split('@');
  
  if (!localPart || localPart.trim() === '') {
    return { 
      isValid: false, 
      errorMessage: 'Email must have a username before the @ symbol' 
    };
  }

  if (!domainPart || !domainPart.includes('.')) {
    return { 
      isValid: false, 
      errorMessage: 'Email must have a valid domain with a dot' 
    };
  }

  const domainParts = domainPart.split('.');
  const tld = domainParts[domainParts.length - 1];
  
  if (!tld || tld.length < 2) {
    return { 
      isValid: false, 
      errorMessage: 'Email must have a TLD of at least 2 characters' 
    };
  }

  // Check for invalid characters or patterns
  if (/\s/.test(email)) {
    return { 
      isValid: false, 
      errorMessage: 'Email cannot contain whitespace' 
    };
  }

  return { isValid: true };
}
