export function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  export function validatePassword(password: string): boolean {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  }
  