export function validatePhoneNumber(countryCode: string, phone: string): { valid: boolean; normalized: string; error?: string } {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  
  if (countryCode === "+91") {
    if (cleanPhone.length !== 10) {
      return { valid: false, normalized: "", error: "Indian mobile number must be exactly 10 digits" };
    }
    if (!/^[6-9]/.test(cleanPhone)) {
      return { valid: false, normalized: "", error: "Indian mobile number must start with 6, 7, 8, or 9" };
    }
  } else {
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      return { valid: false, normalized: "", error: "Please enter a valid phone number (7-15 digits)" };
    }
  }

  return { valid: true, normalized: `${countryCode}${cleanPhone}` };
}

export function maskPhoneNumber(fullPhone: string): string {
  if (fullPhone.length < 8) return fullPhone;
  const prefix = fullPhone.slice(0, 3);
  const suffix = fullPhone.slice(-2);
  const maskedLength = fullPhone.length - 5;
  const stars = "•".repeat(Math.max(4, maskedLength));
  return `${prefix} ${stars} ${suffix}`;
}