// All page copy in both languages. Wording follows miramare.ro (EN: ?lang=en, RO: default site), shortened.
const facts = (area, beds, guests, [a, b, c]) => [[area, a], [beds, b], [guests, c]]

export const COPY = {
  en: {
    book: 'Book now',
    bookUrl: 'https://miramare.rooms-wizard.com/en',
    restaurantUrl: 'https://miramare.ro/restaurante/?lang=en',
    nav: { apartments: 'Apartments', beach: 'Beach and pools', restaurant: 'Restaurant', contact: 'Contact' },
    home: 'Miramare Residence, home',
    switchTo: 'Switch to Romanian',
    menu: 'Open menu',
    close: 'Close menu',
    hero: {
      title: 'Your favorite holiday destination',
      text: 'The comfort of a modern apartment in Mamaia Nord, between the Black Sea and Lake Siutghiol.',
      more: 'See the apartments',
      hint: 'Scroll to step inside',
    },
    // three passes of copy while the camera moves living room → doorway → bedroom
    stages: [
      { title: 'Apartments and a penthouse', text: 'Three types of apartments and a penthouse, made for family holidays, trips with friends or business travel.' },
      { title: 'Family Suite', facts: facts('100 m²', '2', '6', ['area', 'bedrooms', 'guests']), text: 'Extra space and comfort in two bedrooms, a generous living room and a balcony over the sea, the lake or the city.' },
      { title: 'Penthouse Sky Suite', facts: facts('190 m²', '2', '6', ['area', 'bedrooms', 'guests']), text: 'The centerpiece of Miramare: a spectacular terrace over Lake Siutghiol. For two, the 90 m² Senior Suite.' },
    ],
    beach: {
      title: 'A private beach and two pools',
      text: 'Sunbeds and umbrellas kept for Miramare guests only, a heated pool next to your apartment and a saltwater pool by the sea.',
      amenities: ['Private beach, 200 m away', 'Heated pool by your apartment', 'Saltwater pool at Sarago Terrace', 'Sarago Bistro Pub', '24 h front desk', 'Guarded parking'],
    },
  },
  ro: {
    book: 'Rezervă acum',
    bookUrl: 'https://miramare.rooms-wizard.com/ro',
    restaurantUrl: 'https://miramare.ro/restaurante/',
    nav: { apartments: 'Apartamente', beach: 'Plajă și piscine', restaurant: 'Restaurant', contact: 'Contact' },
    home: 'Miramare Residence, acasă',
    switchTo: 'Schimbă în engleză',
    menu: 'Deschide meniul',
    close: 'Închide meniul',
    hero: {
      title: 'Destinația ta de vacanță',
      text: 'Confortul unui apartament modern în Mamaia Nord, între Marea Neagră și lacul Siutghiol.',
      more: 'Vezi apartamentele',
      hint: 'Derulează ca să intri',
    },
    stages: [
      { title: 'Apartamente și penthouse', text: 'Trei tipuri de apartamente și un penthouse, create pentru vacanțe în familie, cu prietenii sau pentru călătorii de business.' },
      { title: 'Family Suite', facts: facts('100 m²', '2', '6', ['suprafață', 'dormitoare', 'persoane']), text: 'Spațiu și confort în două dormitoare, un living generos și balcon cu vedere spre mare, lac sau oraș.' },
      { title: 'Penthouse Sky Suite', facts: facts('190 m²', '2', '6', ['suprafață', 'dormitoare', 'persoane']), text: 'Răsfață-te în 190 mp de confort, cu o terasă superbă spre lacul Siutghiol. Pentru doi, Senior Suite de 90 mp.' },
    ],
    beach: {
      title: 'Plajă privată și două piscine',
      text: 'Șezlonguri și umbrele rezervate exclusiv clienților Miramare, o piscină încălzită lângă apartamentul tău și una cu apă sărată lângă mare.',
      amenities: ['Plajă privată, la 200 m', 'Piscină încălzită lângă apartament', 'Piscină cu apă sărată la Terasa Sarago', 'Sarago Bistro Pub', 'Recepție 24 h', 'Parcare păzită'],
    },
  },
}
