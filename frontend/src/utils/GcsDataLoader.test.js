import { indybayVenueName } from './GcsDataLoader';

describe('indybayVenueName', () => {
  it('returns the trimmed location', () => {
    expect(indybayVenueName('  Station 40, Oakland ')).toBe('Station 40, Oakland');
  });

  it('strips a trailing "or Zoom" suffix', () => {
    expect(indybayVenueName('Omni Commons or Zoom link below')).toBe('Omni Commons');
    expect(indybayVenueName('Omni Commons or via Zoom')).toBe('Omni Commons');
  });

  it('skips non-places', () => {
    ['', undefined, 'Zoom', 'Online', 'RSVP for Details', 'Email us for address', 'Please email for location']
      .forEach(l => expect(indybayVenueName(l)).toBeNull());
  });
});
