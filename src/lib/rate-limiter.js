// Simple in-memory rate limiter
// In production, use Redis for distributed systems
const loginAttempts = new Map();
const lockedAccounts = new Map();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(email) {
  const now = Date.now();
  
  // Check if account is locked
  if (lockedAccounts.has(email)) {
    const lockTime = lockedAccounts.get(email);
    if (now - lockTime < LOCKOUT_DURATION) {
      const remainingTime = Math.ceil((LOCKOUT_DURATION - (now - lockTime)) / 1000);
      return {
        allowed: false,
        reason: 'ACCOUNT_LOCKED',
        remainingTime,
      };
    } else {
      // Unlock account
      lockedAccounts.delete(email);
      loginAttempts.delete(email);
    }
  }

  // Check attempt count
  if (loginAttempts.has(email)) {
    const attempts = loginAttempts.get(email);
    const oldestAttempt = attempts[0];
    
    // Clear old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < ATTEMPT_WINDOW);
    
    if (validAttempts.length >= MAX_ATTEMPTS) {
      // Lock account
      lockedAccounts.set(email, now);
      loginAttempts.delete(email);
      return {
        allowed: false,
        reason: 'TOO_MANY_ATTEMPTS',
        remainingTime: Math.ceil(LOCKOUT_DURATION / 1000),
      };
    }
    
    loginAttempts.set(email, validAttempts);
  }

  return { allowed: true };
}

export function recordFailedAttempt(email) {
  const now = Date.now();
  if (loginAttempts.has(email)) {
    const attempts = loginAttempts.get(email);
    attempts.push(now);
    loginAttempts.set(email, attempts);
  } else {
    loginAttempts.set(email, [now]);
  }
}

export function clearAttempts(email) {
  loginAttempts.delete(email);
  lockedAccounts.delete(email);
}
