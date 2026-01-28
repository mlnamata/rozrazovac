# Team Sorter - Next.js 14 Application

Aplikace pro dynamické rozdělování osob do týmů v reálném čase. 

## Instalace a Spuštění

```bash
# Instalace závislostí
npm install

# Spuštění development serveru
npm run dev

# Produkční build
npm run build
npm start
```

Aplikace bude dostupná na `http://localhost:3000`.

## Hlavní Komponenty

### User View (`/`)
- Automatické vygenerování `userId` a uložení v cookies
- Polling každé 3 sekundy
- Tři stavy:
  - **SETUP** (Připravujeme hru. Čekejte...)
  - **ACTIVE** (Zobrazení přiřazeného obrázku + symbol + live statistiky)
  - **ENDED** (Kolo skončilo. Najděte si parťáky...)
- Responsive design pro **NEOMEZENÝ** počet týmů (scroll pro více týmů)

### Admin Panel (`/admin`)
- Přihlášení heslem: `jentozkousej`
- Setup: Vkládání linků na obrázky (jeden na řádek)
- Live View: Statistiky počtu osob v každém týmu
- Tlačítka:
  - **Spustit kolo** - Aktivuje hru
  - **Ukončit kolo** - Zastaví hru
  - **Nové kolo / Reset** - Resetuje vše

## API Endpoints

### GET `/api/game`
Vrátí aktuální stav hry (status, teams).

### POST `/api/game`
Akce: `setTeams`, `startRound`, `endRound`, `resetGame`

### GET `/api/user/[userId]`
Vrátí data pro uživatele (status, teamId, teamUrl, teamLabel, teamStats).

### GET `/api/stats`
Vrátí statistiky všech týmů.

### GET/POST `/api/user-id`
Správa cookie-based user ID.

## Algoritmus Distribuce

Systém automaticky přiděluje nové uživatele do týmu s nejmenším počtem členů (Balanced Distribution).

## Technologické Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** In-memory (globální proměnné)
- **Cookies:** Next.js `cookies()` API
- **Polling:** Client-side (3 sekundy)

## Struktura Projektu

```
/app
  /api
    /game/route.ts              # Game state management
    /stats/route.ts             # Team statistics
    /user-id/route.ts           # User identification
    /user/[userId]/route.ts     # User data
  /admin
    /page.tsx                   # Admin login
    /dashboard/page.tsx         # Admin dashboard
    /layout.tsx
  /page.tsx                      # User view (home)
/lib
  /gameState.ts                 # Game state logic
```

## Funkce

✅ **NEOMEZENÝ počet hráčů** - škálovatelný systém
✅ **Dynamické týmy** - libovolný počet týmů podle obrázků
✅ **Automatické přiřazování** - Balanced Distribution algoritmus
✅ **Real-time synchronizace** - polling každé 3 sekundy
✅ **Admin panel** - s ochranou heslem
✅ **Cookie-based identifikace** - perzistence mezi sessions
✅ **Čeština v UI** - všechny texty v češtině
✅ **Mobile-first design** - Tailwind CSS s responsive gridem
✅ **TypeScript type safety** - kompletní typizace

