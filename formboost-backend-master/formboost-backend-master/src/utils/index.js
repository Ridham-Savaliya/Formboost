export function generateOTP() {
  const OTP = Math.floor(100000 + Math.random() * 900000);
  return OTP;
}

export const isEmptyObject = (obj) => {
  if (obj == null) return true;
  if (typeof obj !== 'object' || Array.isArray(obj)) return false;
  return Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
};
