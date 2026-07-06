const SITE_ORIGIN = 'https://bayareashows.org';
const SITE_NAME = 'Bay Area Shows';
const DEFAULT_DESCRIPTION = 'Find upcoming punk, indie, metal, experimental, and DIY concerts across San Francisco, Oakland, Berkeley, San Jose, and the Bay Area.';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/assets/MissingImage.png`;
const DEFAULT_IMAGE_ALT = 'Bay Area Shows flyer placeholder artwork';

const buildMetadata = ({ title, description = DEFAULT_DESCRIPTION, path = '/' }) => ({
  title,
  description,
  canonicalUrl: `${SITE_ORIGIN}${path}`,
  image: DEFAULT_IMAGE,
  imageAlt: DEFAULT_IMAGE_ALT,
});

const ROUTE_SEO_METADATA = {
  CalendarView: buildMetadata({
    title: `${SITE_NAME} | Concert Calendar`,
    path: '/',
  }),
  TextAndImagesView: buildMetadata({
    title: `${SITE_NAME} | Concert Flyers`,
    description: 'Browse upcoming Bay Area concert listings with show flyers, dates, venues, and links to event details.',
    path: '/#/TextAndImagesView',
  }),
  ShowsByVenueView: buildMetadata({
    title: `${SITE_NAME} | Shows by Venue`,
    description: 'Search upcoming Bay Area concerts by venue and jump from venue names to matching show listings.',
    path: '/#/ShowsByVenueView',
  }),
  MapView: buildMetadata({
    title: `${SITE_NAME} | Concert Map`,
    description: 'Explore upcoming Bay Area concerts on a venue map and browse listings for shows with known locations.',
    path: '/#/MapView',
  }),
  VenuesListView: buildMetadata({
    title: `${SITE_NAME} | Venue Directory`,
    description: 'Browse Bay Area venues tracked by Bay Area Shows across San Francisco, the East Bay, and nearby cities.',
    path: '/#/VenuesListView',
  }),
  About: buildMetadata({
    title: `${SITE_NAME} | About`,
    description: 'Learn how Bay Area Shows gathers local concert listings from venue and event sources around the Bay Area.',
    path: '/#/About',
  }),
};

const DEFAULT_METADATA = ROUTE_SEO_METADATA.CalendarView;

const findOrCreateMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  return element;
};

const setMetaContent = (selector, attributes, content) => {
  const element = findOrCreateMeta(selector, attributes);
  element.setAttribute('content', content);
};

const setCanonicalUrl = (href) => {
  let canonical = document.head.querySelector('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', href);
};

const applyPageMetadata = (route) => {
  const metadata = ROUTE_SEO_METADATA[route] || DEFAULT_METADATA;

  document.title = metadata.title;
  setCanonicalUrl(metadata.canonicalUrl);
  setMetaContent('meta[name="description"]', { name: 'description' }, metadata.description);
  setMetaContent('meta[property="og:site_name"]', { property: 'og:site_name' }, SITE_NAME);
  setMetaContent('meta[property="og:title"]', { property: 'og:title' }, metadata.title);
  setMetaContent('meta[property="og:description"]', { property: 'og:description' }, metadata.description);
  setMetaContent('meta[property="og:url"]', { property: 'og:url' }, metadata.canonicalUrl);
  setMetaContent('meta[property="og:type"]', { property: 'og:type' }, 'website');
  setMetaContent('meta[property="og:image"]', { property: 'og:image' }, metadata.image);
  setMetaContent('meta[property="og:image:alt"]', { property: 'og:image:alt' }, metadata.imageAlt);
  setMetaContent('meta[property="og:image:width"]', { property: 'og:image:width' }, '549');
  setMetaContent('meta[property="og:image:height"]', { property: 'og:image:height' }, '632');
  setMetaContent('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary');
  setMetaContent('meta[name="twitter:title"]', { name: 'twitter:title' }, metadata.title);
  setMetaContent('meta[name="twitter:description"]', { name: 'twitter:description' }, metadata.description);
  setMetaContent('meta[name="twitter:image"]', { name: 'twitter:image' }, metadata.image);
  setMetaContent('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt' }, metadata.imageAlt);
};

export { applyPageMetadata, ROUTE_SEO_METADATA };
