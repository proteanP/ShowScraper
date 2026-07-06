const SITE_ORIGIN = 'https://bayareashows.org';
const DEFAULT_CANONICAL_URL = `${SITE_ORIGIN}/`;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const textOrNull = (value) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const absoluteHttpUrlOrNull = (value) => {
  const candidate = textOrNull(value);
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.href;
  } catch {
    return null;
  }
};

const isoDateOrNull = (value) => {
  const candidate = textOrNull(value);
  if (!candidate || !ISO_DATE_RE.test(candidate)) return null;

  const parsed = new Date(`${candidate}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : candidate;
};

const buildEventJsonLd = (event) => {
  const name = textOrNull(event?.title);
  const startDate = isoDateOrNull(event?.date);
  const url = absoluteHttpUrlOrNull(event?.url);
  const venueName = textOrNull(event?.source?.commonName);

  if (!name || !startDate || !url || !venueName) return null;

  const jsonLd = {
    '@type': 'Event',
    '@id': `${url}#event`,
    name,
    startDate,
    url,
    location: {
      '@type': 'Place',
      name: venueName,
    },
  };

  const endDate = isoDateOrNull(event?.endDate || event?.end_date);
  if (endDate) jsonLd.endDate = endDate;

  const image = absoluteHttpUrlOrNull(event?.img);
  if (image) jsonLd.image = image;

  return jsonLd;
};

const flattenEventsByDate = (eventsByDate = {}) => (
  Object.keys(eventsByDate)
    .sort()
    .flatMap((dateKey) => eventsByDate[dateKey] || [])
);

const buildEventsJsonLdGraph = (eventsByDate = {}, canonicalUrl = DEFAULT_CANONICAL_URL) => {
  const pageUrl = absoluteHttpUrlOrNull(canonicalUrl) || DEFAULT_CANONICAL_URL;
  const events = flattenEventsByDate(eventsByDate)
    .map(buildEventJsonLd)
    .filter(Boolean);

  if (events.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@graph': events.map((event) => ({
      ...event,
      mainEntityOfPage: pageUrl,
    })),
  };
};

export {
  DEFAULT_CANONICAL_URL,
  buildEventJsonLd,
  buildEventsJsonLdGraph,
};
