import { hasError, isFormValid, Validators } from './FormUtils';

describe('FormUtils tests', () => {
  const errors = {
    error1: true,
    error2: true,
  };
  it('hasErrors test', () => {
    expect(hasError(errors, 'error1')).toBe(true);
    expect(hasError(errors, 'error3')).toBe(false);
  });

  it('isFormValid', () => {
    expect(isFormValid(errors)).toBe(false);
    expect(isFormValid({})).toBe(true);
  });
});

describe('Validators tests', () => {
  it('isNotEmpty', () => {
    expect(Validators.isNotEmpty('')).toBe(false);
    expect(Validators.isNotEmpty('Test')).toBe(true);
    expect(Validators.isNotEmpty(' ')).toBe(false);
  });

  it('max', () => {
    expect(Validators.max('Test', 4)).toBe(false);
    expect(Validators.max('TestTest', 4)).toBe(true);
  });

  it('min', () => {
    expect(Validators.min('', 3)).toBe(false);
    expect(Validators.min('123', 3)).toBe(true);
  });

  it('allowedCharacters', () => {
    expect(Validators.allowedCharacters('Ceci est un test 1')).toBe(true);
    expect(Validators.allowedCharacters('Ceci est un em@il')).toBe(true);
    expect(Validators.allowedCharacters('Ceci est un em@il.com')).toBe(true);
    expect(Validators.allowedCharacters('Ceci#est_un em@il.com')).toBe(true);
    expect(Validators.allowedCharacters('Ceci*st_un em@il.com')).toBe(true);
    expect(Validators.allowedCharacters('([Ceci)%*st_un em@il.com')).toBe(true);
  });

  it('dateIsPassed', () => {
    expect(Validators.dateIsPassed(new Date(1900, 1, 1))).toBe(true);
    const now = new Date();
    now.setTime(now.getTime() + 100);
    expect(Validators.dateIsPassed(now)).toBe(false);
  });
});
