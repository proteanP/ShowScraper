import { buildEventJsonLd, buildEventsJsonLdGraph } from './structuredData';

const validEvent = {
  title: 'Some Band / Another Band',
  date: '2026-08-14',
  url: 'https://example.com/events/some-band',
  img: 'https://example.com/flyer.jpg',
  source: {
    commonName: 'Example Venue',
    website: 'https://example.com/',
  },
};

describe('structured data helpers', () => {
  test('builds conservative Event JSON-LD from trusted event fields', () => {
    expect(buildEventJsonLd(validEvent)).toEqual({
      '@type': 'Event',
      '@id': 'https://example.com/events/some-band#event',
      name: 'Some Band / Another Band',
      startDate: '2026-08-14',
      url: 'https://example.com/events/some-band',
      location: {
        '@type': 'Place',
        name: 'Example Venue',
      },
      image: 'https://example.com/flyer.jpg',
    });
  });

  test('omits optional event fields when scraper data is absent or unsupported', () => {
    const jsonLd = buildEventJsonLd({
      ...validEvent,
      img: '',
      price: '$20',
      rating: 5,
      performers: ['Fake Artist'],
      source: {
        ...validEvent.source,
        address: '123 Example St',
      },
    });

    expect(jsonLd).not.toHaveProperty('image');
    expect(jsonLd).not.toHaveProperty('offers');
    expect(jsonLd).not.toHaveProperty('aggregateRating');
    expect(jsonLd).not.toHaveProperty('performer');
    expect(jsonLd.location).not.toHaveProperty('address');
  });

  test('returns null when required event fields are missing or unsafe', () => {
    expect(buildEventJsonLd({ ...validEvent, title: '' })).toBeNull();
    expect(buildEventJsonLd({ ...validEvent, date: '08-14' })).toBeNull();
    expect(buildEventJsonLd({ ...validEvent, url: 'javascript:alert(1)' })).toBeNull();
    expect(buildEventJsonLd({ ...validEvent, source: {} })).toBeNull();
  });

  test('builds deterministic page graph and skips invalid records', () => {
    const graph = buildEventsJsonLdGraph(
      {
        '08-15': [{ ...validEvent, title: 'Second Event', url: 'https://example.com/second' }],
        '08-14': [validEvent, { title: '', date: '2026-08-14', url: 'https://example.com/bad' }],
      },
      'https://bayareashows.org/#/TextAndImagesView'
    );

    expect(graph).toEqual({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Event',
          '@id': 'https://example.com/events/some-band#event',
          name: 'Some Band / Another Band',
          startDate: '2026-08-14',
          url: 'https://example.com/events/some-band',
          location: {
            '@type': 'Place',
            name: 'Example Venue',
          },
          image: 'https://example.com/flyer.jpg',
          mainEntityOfPage: 'https://bayareashows.org/#/TextAndImagesView',
        },
        {
          '@type': 'Event',
          '@id': 'https://example.com/second#event',
          name: 'Second Event',
          startDate: '2026-08-14',
          url: 'https://example.com/second',
          location: {
            '@type': 'Place',
            name: 'Example Venue',
          },
          image: 'https://example.com/flyer.jpg',
          mainEntityOfPage: 'https://bayareashows.org/#/TextAndImagesView',
        },
      ],
    });
  });

  test('returns null for pages without valid event records', () => {
    expect(buildEventsJsonLdGraph({ '08-14': [{ title: '', date: '2026-08-14' }] })).toBeNull();
  });
});
