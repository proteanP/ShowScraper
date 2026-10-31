import moment from 'moment';
import _ from 'underscore';
import $ from 'jquery';

const NON_PLACES = ['zoom', 'online', 'rsvp for details'];
const NON_PLACE_PREFIXES = ['email ', 'please email '];
const ZOOM_SUFFIX = /\s+or\s+(via\s+)?zoom\b.*$/i;

// Keep in sync with venue_name_for in Dagu/scripts/bay-area-shows/detect_missing_venues.py
export function indybayVenueName(location) {
  const place = (location || '').trim().replace(ZOOM_SUFFIX, '').trim();
  const lowered = place.toLowerCase();
  if (!place || NON_PLACES.includes(lowered) || NON_PLACE_PREFIXES.some(p => lowered.startsWith(p))) return null;
  return place;
}

export default class GcsGcsDataLoader {
  static async loadVenueData() {
    const data = await $.getJSON("https://storage.googleapis.com/show-scraper-data/sources.json", { _: new Date().getTime()})
    return data
  }

  static async loadEventData(venues) {
    const fetchEventsPromises = venues.map(venue => {
      const url = `https://storage.googleapis.com/show-scraper-data/${venue.name}.json`;
      return $.ajax({
        cache: false,
        url: url,
        dataType: "json",
      }).then(events => ({ venue, events })); // Pair each venue with its events
    });
  
    const results = [];
  
    const pairedData = await Promise.all(fetchEventsPromises);
  
    pairedData.forEach(({ venue, events }) => {
      events.forEach(event => {
        let modifiedVenue = null;
        if (venue.name === "TheList" || venue.name === "ManuallyAdded") {
          const data = JSON.parse(event.title);
          const commonName = venue.commonName;
          modifiedVenue = { ...venue, commonName: `${data.venue} (via ${commonName})` };
          event.title = data.artists;
        } else if (venue.name === "Indybay") {
          const place = indybayVenueName(event.location);
          if (place) modifiedVenue = { ...venue, commonName: `${place} (via ${venue.commonName})` };
        }
  
        let newEvent = {
          ...event,
          source: modifiedVenue || venue
        };
        results.push(newEvent);
      });
    });

    return _.groupBy(results, (event) => {
      let date = moment(event.date, 'YYYY-MM-DD')

      // Intentionally omitting year here.
      // Some scraped data does not have accurate year numbers,
      // which can cause issues around December / January time,
      // since january events might show up for the PREVIOUS year
      return date.format('MM-DD')
    })
  }

}
