import i18next from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { t } from './translation';

vi.mock('i18next', () => ({
  default: {
    t: vi.fn(),
  },
}));

describe('translate (t)', () => {
  const mockTranslate = i18next.t as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls i18next.t with correct namespace and key', () => {
    mockTranslate.mockReturnValue('Translated Text');

    const result = t('lumifi', 'welcome.message');

    expect(mockTranslate).toHaveBeenCalledWith('welcome.message', {
      ns: 'lumifi',
    });

    expect(result).toBe('Translated Text');
  });

  it('passes interpolation values to i18next.t', () => {
    mockTranslate.mockReturnValue('Welcome, John!');

    const result = t('lumifi', 'greeting.message', { name: 'John' });

    expect(mockTranslate).toHaveBeenCalledWith('greeting.message', {
      ns: 'lumifi',
      name: 'John',
    });

    expect(result).toBe('Welcome, John!');
  });
});
