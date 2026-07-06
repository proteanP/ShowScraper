import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import EventStructuredData from './EventStructuredData';

const validEvent = {
  title: 'Some Band / Another Band',
  date: '2026-08-14',
  url: 'https://example.com/events/some-band',
  img: 'https://example.com/flyer.jpg',
  source: {
    commonName: 'Example Venue',
  },
};

describe('EventStructuredData', () => {
  let container;
  let root;

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  });

  beforeEach(() => {
    document.head.querySelector('link[rel="canonical"]')?.remove();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    document.head.querySelector('link[rel="canonical"]')?.remove();
  });

  test('renders parseable JSON-LD script content as React children', () => {
    const canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://bayareashows.org/#/TextAndImagesView');
    document.head.appendChild(canonical);

    act(() => {
      root.render(<EventStructuredData eventsByDate={{ '08-14': [validEvent] }} />);
    });

    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).not.toBeNull();
    expect(JSON.parse(script.textContent)).toEqual({
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
      ],
    });
  });
});
