import { describe, expect, it } from 'vitest';
import { validateDEANumber } from './dea-algo';

describe('validateDEANumber', () => {
  it('returns false if deaNumber or lastName is missing', () => {
    expect(validateDEANumber('', 'Smith')).toBe(false);
    expect(validateDEANumber('AB1234567', '')).toBe(false);
    expect(validateDEANumber('', '')).toBe(false);
  });

  it('returns false if DEA number length is not 9', () => {
    expect(validateDEANumber('AB123456', 'Brown')).toBe(false);
    expect(validateDEANumber('AB12345678', 'Brown')).toBe(false);
  });

  it('returns false if first character is not A-H', () => {
    expect(validateDEANumber('ZB1234567', 'Brown')).toBe(false);
    expect(validateDEANumber('IB1234567', 'Brown')).toBe(false);
  });

  it('returns false if second character does not match last name initial', () => {
    expect(validateDEANumber('AB1234567', 'Clark')).toBe(false); // B ≠ C
    expect(validateDEANumber('AD1234567', 'Smith')).toBe(false); // D ≠ S
  });

  it('returns false if the last 7 characters are not all digits', () => {
    expect(validateDEANumber('AS12X4567', 'Smith')).toBe(false);
    expect(validateDEANumber('AS12345X7', 'Smith')).toBe(false);
  });

  it('returns false if algorithmic validation fails', () => {
    // Valid format, wrong check digit
    expect(validateDEANumber('AS1234567', 'Smith')).toBe(false);
  });

  it('returns true for a valid DEA number', () => {
    // Here's a valid DEA number:
    // A = valid letter
    // S = initial of last name
    // 1234563 = digits that pass the validation check
    // Calculation:
    // sum1 = 1 + 3 + 5 = 9
    // sum2 = (2 + 4 + 6) * 2 = 24
    // total = 33
    // last digit = 3, matches the last digit of DEA (3)
    expect(validateDEANumber('AS1234563', 'Smith')).toBe(true);
  });

  it('allows lowercase and formatted input', () => {
    expect(validateDEANumber('as-123-4563', 'smith')).toBe(true);
    expect(validateDEANumber(' aS1234563 ', '  smith  ')).toBe(true);
  });
});
