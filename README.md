# Artsen zonder Grenzen — Kom in actie (presentatie)

Een visuele, automatisch doorlopende presentatie voor een **Kom in actie**-inzameling
voor **Artsen zonder Grenzen**. Gemaakt om op een **tablet** te tonen: grote, leesbare
tekst, een **3D-roterende wereldbol** met uitgelichte landen, en een doneer-oproep met QR-code.

De presentatie werkt **volledig offline** — alle code, lettertypes, de wereldkaart en
de foto's zitten in deze map. Internet is niet nodig om hem te tonen.

---

## Tonen

1. Open **`index.html`** in een moderne browser (Chrome, Edge of Safari).
2. Druk op **`F`** (of `F11`) voor volledig scherm.
3. De presentatie start vanzelf en **herhaalt zich oneindig**.

### Op een tablet (kiosk)
- **iPad:** open `index.html` in Safari → deel → *Zet op beginscherm*, of gebruik
  **Begeleide toegang** (Instellingen → Toegankelijkheid) om hem vast te zetten.
- **Android:** open in Chrome → menu → *Toevoegen aan startscherm* en start fullscreen.
- Zet **automatisch vergrendelen / schermbeveiliging uit** zodat het scherm aan blijft.
- Gebruik **liggend** (landscape) voor het mooiste beeld; staand werkt ook.

### Bediening
| Actie | Effect |
|------|--------|
| *vanzelf* | dia's wisselen automatisch en herhalen in een lus |
| **tik / klik** | pauzeren — nog een tik = hervatten |
| **→ / ←** | volgende / vorige dia |
| **spatie** | pauzeren / hervatten |
| **Enter / F** | volledig scherm aan/uit |

### Preview van één dia
Voeg `?slide=N&still=1` toe aan het adres om bij dia *N* te starten en stil te zetten,
bijvoorbeeld `index.html?slide=6&still=1`.

---

## Personaliseren

Alle teksten, de doneerlink en de landen staan in **`assets/js/config.js`**.

- **Doneerlink + QR-code:** pas `actionUrl` en `actionUrlLabel` aan. De **QR-code wordt
  automatisch opnieuw gegenereerd** op basis van `actionUrl`.
- **Teksten:** `campaignSub`, `credo`, bronvermelding, enz.
- **Landen op de wereldbol:** de lijst `COUNTRIES` (naam, regio, `lat`/`lng`, tekst,
  cijfers, foto). Een marker verschijnt automatisch op de bol; zet `photo` op een
  bestandsnaam in `assets/photos/` of op `null` voor een tekst-only dia.
- **Cijfers / thema's / principes:** `STATS`, `THEMES`, `PRINCIPLES`.
- **Tempo:** `defaultDuration` (ms) of per dia in `app.js` (`DUR`).

### Foto's
Vervang of voeg foto's toe in **`assets/photos/`** en verwijs ernaar via `photo:` in
`COUNTRIES`. De meegeleverde merkfoto's zijn `field-1.jpg` … `field-6.jpg`.

---

## Mappenstructuur
```
index.html                  start hier
assets/
  css/styles.css            vormgeving (merk + opmaak)
  css/fonts.css             ingesloten lettertype (Inter, offline)
  js/config.js              ← HIER pas je teksten/landen/doneerlink aan
  js/app.js                 diavoorstelling-motor (autoplay-lus)
  js/globe.js               roterende wereldbol (2D-canvas, werkt zonder WebGL)
  js/qrcode.min.js          QR-generator (lokaal)
  data/world-land.js        wereldkaart (landmassa, ingesloten)
  photos/                   foto's en logo's
```

## Bronnen
Cijfers en context: Artsen zonder Grenzen / Médecins Sans Frontières —
Internationaal Activiteitenverslag 2023/2024 (msf.org, artsenzondergrenzen.nl).
Foto's en logo's: aangeleverd merkmateriaal van Artsen zonder Grenzen.
