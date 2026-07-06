import React, { useMemo } from 'react';
import { DEFAULT_CANONICAL_URL, buildEventsJsonLdGraph } from '../../utils/structuredData';

const currentCanonicalUrl = () => {
  if (typeof document === 'undefined') return DEFAULT_CANONICAL_URL;
  return document.head.querySelector('link[rel="canonical"]')?.href || DEFAULT_CANONICAL_URL;
};

const EventStructuredData = ({ eventsByDate }) => {
  const jsonLd = useMemo(
    () => buildEventsJsonLdGraph(eventsByDate, currentCanonicalUrl()),
    [eventsByDate]
  );

  if (!jsonLd) return null;

  return (
    <script type='application/ld+json'>
      {JSON.stringify(jsonLd, null, 2)}
    </script>
  );
};

export default EventStructuredData;
