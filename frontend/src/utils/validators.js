export function isRequired(value) {
  return (
    value !== null &&
    value !== undefined &&
    String(value).trim() !== ""
  );
}

export function isValidEmail(email) {
  if (!isRequired(email)) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );
}

export function isStrongPassword(password) {
  if (!isRequired(password)) {
    return false;
  }

  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

export function passwordsMatch(
  password,
  confirmPassword
) {
  return (
    isRequired(password) &&
    password === confirmPassword
  );
}

export function isValidUrl(value) {
  if (!isRequired(value)) {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

export function validateUrl(value) {
  if (!isRequired(value)) {
    return "Website URL is required.";
  }

  if (!isValidUrl(value)) {
    return "Please enter a valid website URL.";
  }

  return "";
}

export function validateEmail(email) {
  if (!isRequired(email)) {
    return "Email address is required.";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address.";
  }

  return "";
}

export function validatePassword(password) {
  if (!isRequired(password)) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must contain at least 8 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/\d/.test(password)) {
    return "Password must contain at least one number.";
  }

  return "";
}