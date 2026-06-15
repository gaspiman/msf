/* ============================================================================
   ARTSEN ZONDER GRENZEN — presentatie
   Kom in actie voor Artsen zonder Grenzen
   ----------------------------------------------------------------------------
   DIT BESTAND PAS JE AAN OM DE PRESENTATIE TE PERSONALISEREN.
   Alle teksten, het doneerlink/QR-adres en de landenselectie staan hieronder.
   ========================================================================== */

window.CONFIG = {
  /* --- Doneren / call-to-action -------------------------------------------
     Vervang actionUrl door de échte link van jouw actie op
     kominactie.artsenzondergrenzen.nl — de QR-code wordt automatisch
     opnieuw gegenereerd op basis van deze link. */
  actionUrl: "https://www.actiezondergrenzen.nl/fundraisers/neti",
  actionUrlLabel: "actiezondergrenzen.nl/fundraisers/neti",

  campaignName: "Artsen zonder Grenzen",
  campaignSub: "Kom in actie voor Artsen zonder Grenzen",
  credo: "Het recht op medische hulp — waar ook ter wereld, voor ieder mens.",

  /* Toon de doneer-call-to-action (QR + link). */
  showDonateCTA: true,

  /* Tempo van de automatische diavoorstelling (milliseconden). */
  defaultDuration: 9000,

  /* Bronvermelding (klein in beeld op de cijferdia). */
  sourceNote: "Cijfers: Artsen zonder Grenzen — Internationaal Activiteitenverslag 2023/2024",
};

/* ============================================================================
   LANDEN — markers op de wereldbol + de landen-dia's.
   lat/lng in graden. accent: 'red' (standaard) of 'aqua'.
   photo: bestandsnaam in assets/photos/ of null voor een grafische dia.
   ========================================================================== */
window.COUNTRIES = [
  {
    id: "sudan",
    name: "Soedan",
    region: "Noordoost-Afrika",
    lat: 15.5, lng: 30.5,
    kicker: "’s Werelds grootste ontheemdingscrisis",
    text: "Te midden van oorlog werken onze teams in 15 van de 18 deelstaten: zorg voor gewonden, en de strijd tegen cholera en ondervoeding.",
    stats: [
      { value: "1,1 mln", label: "consulten (2024)" },
      { value: "10.700", label: "geweldsslachtoffers behandeld" },
    ],
    photo: "field-6.jpg",
    accent: "red",
  },
  {
    id: "south-sudan",
    name: "Zuid-Soedan",
    region: "Oost-Afrika",
    lat: 7.0, lng: 30.2,
    kicker: "Veilig ter wereld komen",
    text: "In afgelegen gebieden begeleiden onze vroedvrouwen veilige bevallingen — vaak de enige medische zorg in de wijde omtrek.",
    stats: [
      { value: "3.773", label: "collega’s in het land" },
      { value: "24/7", label: "moeder- & kindzorg" },
    ],
    photo: "field-5.jpg",
    accent: "red",
  },
  {
    id: "drc",
    name: "DR Congo",
    region: "Centraal-Afrika",
    lat: -2.4, lng: 23.6,
    kicker: "Onze grootste operatie ter wereld",
    text: "Bij conflict en uitbraken van mazelen, cholera en malaria bieden teams hulp aan miljoenen mensen.",
    stats: [
      { value: "2,58 mln", label: "consulten (2023)" },
      { value: "#1", label: "grootste AzG-programma" },
    ],
    photo: "field-3.jpg",
    accent: "red",
  },
  {
    id: "nigeria",
    name: "Nigeria",
    region: "West-Afrika",
    lat: 11.3, lng: 8.2,
    kicker: "Strijd tegen ondervoeding",
    text: "In het noorden behandelen teams kinderen met ernstige ondervoeding met therapeutische voeding en intensieve zorg.",
    stats: [
      { value: "440.000", label: "kinderen behandeld" },
      { value: "Voedings­centra", label: "dag en nacht open" },
    ],
    photo: "field-4.jpg",
    accent: "red",
  },
  {
    id: "yemen",
    name: "Jemen",
    region: "Midden-Oosten",
    lat: 15.4, lng: 47.6,
    kicker: "Na jaren van oorlog",
    text: "Onze teams houden ziekenhuizen draaiende: spoedeisende zorg, veilige bevallingen en de aanpak van ondervoeding.",
    stats: [
      { value: "Spoedzorg", label: "die anders wegvalt" },
      { value: "Moeder & kind", label: "centraal in de zorg" },
    ],
    photo: "yemen.jpg",
    accent: "red",
  },
  {
    id: "gaza",
    name: "Gaza",
    region: "Midden-Oosten",
    lat: 31.4, lng: 34.37,
    kicker: "Zorg onder zware omstandigheden",
    text: "Onze teams ondersteunen ziekenhuizen en behandelen gewonden — met bijzondere aandacht voor moeders, pasgeborenen en kinderen.",
    stats: [
      { value: "Spoed & brandwonden", label: "zorg voor gewonden" },
      { value: "Moeder & kind", label: "onder hoge druk" },
    ],
    photo: "gaza.jpg",
    accent: "red",
  },
  {
    id: "ukraine",
    name: "Oekraïne",
    region: "Europa",
    lat: 49.0, lng: 31.5,
    kicker: "Oorlog dichtbij huis",
    text: "Sinds het uitbreken van de oorlog biedt Artsen zonder Grenzen chirurgie, medische evacuaties per trein en psychologische zorg.",
    stats: [
      { value: "Medische treinen", label: "voor gewonden" },
      { value: "Mentale zorg", label: "na geweld en verlies" },
    ],
    photo: "ukraine.jpg",
    accent: "red",
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    region: "Zuid-Azië",
    lat: 21.4, lng: 92.0,
    kicker: "Rohingya-vluchtelingen",
    text: "In Cox’s Bazar — ’s werelds grootste vluchtelingenkamp — voorzien onze teams bijna een miljoen mensen van basisgezondheidszorg.",
    stats: [
      { value: "± 1 mln", label: "mensen in het kamp" },
      { value: "Basiszorg", label: "voor wie niets heeft" },
    ],
    photo: "bangladesh.jpg",
    accent: "red",
  },
  {
    id: "haiti",
    name: "Haïti",
    region: "Caribisch gebied",
    lat: 18.6, lng: -72.3,
    kicker: "Hulp ondanks het geweld",
    text: "Te midden van gewapend geweld in Port-au-Prince bieden onze teams trauma- en spoedchirurgie aan gewonden.",
    stats: [
      { value: "Trauma", label: "& spoedchirurgie" },
      { value: "Open", label: "als anderen sluiten" },
    ],
    photo: "field-2.jpg",
    accent: "red",
  },
  {
    id: "mexico",
    name: "Mexico",
    region: "Latijns-Amerika",
    lat: 23.0, lng: -102.0,
    kicker: "Mensen op de vlucht",
    text: "Langs de migratieroute bieden teams medische en psychologische zorg — en veilige, kindvriendelijke ruimtes onderweg.",
    stats: [
      { value: "Zorg onderweg", label: "op de migratieroute" },
      { value: "Mentale steun", label: "voor kinderen" },
    ],
    photo: "field-1.jpg",
    accent: "red",
  },
  {
    id: "med-sea",
    name: "Middellandse Zee",
    region: "Search & Rescue",
    lat: 34.8, lng: 15.5,
    kicker: "Zonder grenzen — ook op zee",
    text: "Met reddingsschepen haalt Artsen zonder Grenzen drenkelingen uit zee en geeft hen medische zorg en menselijkheid.",
    stats: [
      { value: "12.675", label: "mensen gered sinds 2021" },
      { value: "Reddingsschip", label: "op volle zee" },
    ],
    photo: "mediterranean.jpg",
    accent: "red",
  },
];

/* ============================================================================
   WAT WE DOEN — iconenrooster (themadia).
   ========================================================================== */
window.THEMES = [
  { icon: "war",        title: "Oorlog & rampen",      text: "Snel ter plaatse bij conflict en natuurrampen" },
  { icon: "mother",     title: "Moeder & kind",        text: "Veilige bevallingen en zorg voor pasgeborenen" },
  { icon: "nutrition",  title: "Ondervoeding",         text: "Therapeutische voeding voor kinderen" },
  { icon: "vaccine",    title: "Vaccinaties",          text: "Grote campagnes tegen mazelen, cholera en meer" },
  { icon: "surgery",    title: "Chirurgie & trauma",   text: "Levensreddende operaties, ook in oorlogsgebied" },
  { icon: "mind",       title: "Geestelijke zorg",     text: "Psychologische hulp na geweld en verlies" },
  { icon: "epidemic",   title: "Epidemieën",           text: "Bestrijding van cholera, mazelen en ebola" },
  { icon: "water",      title: "Water & sanitatie",    text: "Schoon water voorkomt ziekte en redt levens" },
];

/* ============================================================================
   CIJFERS — wereldwijde impact (cijferdia). Tellen op vanaf 0.
   ========================================================================== */
window.STATS = [
  { value: 70,     prefix: "",   suffix: "+",  label: "landen waar we werken" },
  { value: 337000, prefix: "",   suffix: "",   label: "bevallingen begeleid (2023)" },
  { value: 125900, prefix: "",   suffix: "",   label: "chirurgische ingrepen (2023)" },
  { value: 660000, prefix: "± ", suffix: "",   label: "kinderen behandeld voor ondervoeding" },
  { value: 67000,  prefix: "",   suffix: "",   label: "collega’s wereldwijd" },
  { value: 98,     prefix: "",   suffix: "%",  label: "inkomsten uit particuliere giften" },
];

/* ============================================================================
   DRIE PRINCIPES (over-ons dia).
   ========================================================================== */
window.PRINCIPLES = [
  { icon: "independent", title: "Onafhankelijk", text: "Ruim 98% van onze inkomsten komt van particuliere donateurs." },
  { icon: "neutral",     title: "Neutraal",      text: "Wij kiezen geen partij in een conflict." },
  { icon: "impartial",   title: "Onpartijdig",   text: "Hulp op basis van medische nood — voor iedereen." },
];
