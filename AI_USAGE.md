# AI Usage Log

| Date & Time              | Tool                | Task / What was generated or modified                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Model                                             |
| ------------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 2026-06-26 11:57 (UTC+2) | Cursor Chat (Agent) | Analyzed all screens of the "Suncani Hvar – Booking" Figma file (ChooseAccommodation, ChooseDates, ChooseRoom, Cart, Extras/Payment, Confirmation, Summary) and produced a mapped list of shadcn/ui components to install for the booking flow.                                                                                                                                                                                                                                        | Claude Opus 4.8                                   |
| 2026-06-27 22:30 (UTC+2) | Cursor Chat (Agent) | Implemented Shadcn-based Accommodation Picker: added dialog/tabs/skeleton primitives, booking API layer (properties + units), TanStack Query hooks, reusable booking components (HotelOptionCard, HotelList, AccommodationDialog, AccommodationTabs), Playfair Display font, and wired home page to live API data.                                                                                                                                                                     | Claude Opus 4.8                                   |
| 2026-06-27 22:42 (UTC+2) | Cursor Chat (Agent) | Set up global design tokens in `app/globals.css` (colors: ink, ink-muted, line, surface, surface-hover, alert; typography: micro, mini, caption, title; tracking-label) and refactored ~20 booking components to replace hardcoded hex values and arbitrary Tailwind classes with semantic token utilities.                                                                                                                                                                            | Claude Opus 4.8 for planning / Auto for execution |
| 2026-06-27 22:50 (UTC+2) | Cursor Chat (Agent) | Scaffolded URL-driven booking routes: root `/` redirects to `/book/dates`; added `app/book/layout.tsx` shell plus placeholder pages for dates (AccommodationPicker), rooms, payment, and confirmation.                                                                                                                                                                                                                                                                                 | Claude Opus 4.8 for planning / Auto for execution |
| 2026-06-27 23:35 (UTC+2) | Cursor Chat (Agent) | Implemented nuqs URL-driven booking state: installed `nuqs`, wired `NuqsAdapter` in `components/providers.tsx`, added `lib/booking/search-params.ts` with typed parsers (`property`, `checkin`, `nights`, `adults`, `children`, `rooms`) and `useBookingParams` hook, migrated hotel selection in `AccommodationPicker` from local `useState` to the `property` URL param.                                                                                                             | Claude Opus 4.8 for planning / Auto for execution |
| 2026-06-27 23:55 (UTC+2) | Cursor Chat (Agent) | Implemented price calendar flow from Figma: added `CalendarDay`/`CalendarResponse` types, `getCalendar()` API + `useCalendar()` hook, `PriceCalendar` (shadcn range calendar with per-day prices/availability), `CalendarLegend`, `CalendarConfirmBar`, `/book/calendar` route with `CalendarPicker` (desktop two-month + legend + CONFIRM; mobile tabs + scroll + bottom bar), hotel click navigates to calendar, CONFIRM advances to `/book/rooms` with `checkin` + `nights` in URL. | Claude Opus 4.8 for planning / Auto for execution |
| 2026-06-28 00:40 (UTC+2) | Cursor Chat (Agent) | Implemented room selection (desktop + mobile) from Figma: reusable `Stepper`, `RoomCard` (desktop rate rows + LOAD MORE, mobile from-price SELECT), `RoomSearchSummary` (mobile EDIT bar), `RoomPicker` full-page orchestrator; added `POST /availability` API layer (`getAvailability`, `useAvailability`), `formatBoardType`/`formatEuro` helpers, and wired `/book/rooms` to persist room+rate selection and navigate to payment.                                                   | Claude Opus 4.8 for planning / Auto for execution |
| 2026-06-28 01:00 (UTC+2) | Cursor Chat (Agent) | Implemented Figma Cart drawer for multi-room selection: extended `RoomSelection` URL model to `{unitId, rateId, adults, children}`, added `OccupancyStepper`, `CartRoomCard`, `CartDrawer` (shadcn Sheet with blurred backdrop), wired `RoomPicker` so SELECT appends to cart and opens drawer, per-room remove/occupancy steppers, ADD MORE ROOMS, grand total, CONTINUE to payment, and VIEW CART affordance.                                                                        | Claude Opus 4.8 for planning / Auto for execution |
| 2026-06-28 01:15 (UTC+2) | Cursor Chat (Agent) | Implemented mobile Cart/Small view from Figma: full-screen `CartMobile` with dark close header, property/dates bar, `CartRatePicker` (CHOOSE RATE radio cards), SELECTED ROOM(S) section, ADD MORE ROOMS link, sticky CONTINUE bar; desktop keeps side `CartDrawer`; `RoomPicker` routes by breakpoint with pending-unit rate selection on mobile.                                                                                                                                     | Claude Opus 4.8 for planning / Auto for execution |
| 2026-06-28 17:05 (UTC+2) | Cursor Chat (Agent) | Implemented Payment Checkout page from Figma: installed `react-hook-form`, `@hookform/resolvers`, `zod`; added `payment-schema.ts` (card mask, future expiry, 3-digit CVV), `createBooking()` POST to `/api/booking/bookings`, `useReservation` hook + `reservation-utils`, payment UI components (`payment-form`, `payment-field`, `order-summary`, `accepted-cards`), wired `/book/payment`, fixed cart→payment URL param preservation.                                              | Claude Opus 4.8 for planning / Auto for execution |
| 2026-06-28 23:33 (UTC+2) | Cursor Chat (Agent) | Fixed Fallow health findings: deleted 12 unused shadcn UI files, trimmed dead exports in dialog/card/sheet/search-params, removed unused deps (`lucide-react`, `embla-carousel-react`), deduplicated RoomPicker via `useReservation`, extracted PaymentForm/CalendarPicker/RoomPicker sub-components and shared hooks (`useBookingRouteGuard`, `useMediaQuery`, `useCalendarAvailability`, `usePaymentSubmit`), added `formatNightsLabel` util; health score improved 59 C → 78 B.     | Claude Opus 4.8 for planning / Auto for execution |
| 2026-06-29 11:41 (UTC+2) | Cursor Chat (Agent) | Refactored `Stepper` layout so connectors render as sibling items between steps (using a `contents` wrapper), removed debug text/comments, and constrained separator spacing/width to prevent overflow across adjacent step containers.                                                                                                                                                                                                                                                | Codex 5.3                                         |
| 2026-06-29 12:10 (UTC+2) | Cursor Chat (Agent) | Expanded payment `OrderSummary` to match Figma reservation summary: per-room cards with room name, rate, board type, adults/children, room price, and per-room total; sidebar scrollable room list with grand total; mobile footer expands to show full breakdown; wired `cartLines` through `payment-form` and sticky header.                                                                                                                                                         | Claude Opus 4.8 for planning / Auto for execution |
| 2026-06-29 13:15 (UTC+2) | Cursor Chat (Agent) | Implemented Figma booking confirmation page (desktop + mobile): added success design tokens, `ConfirmationProvider` scoped to `(checkout)` route group for payment/confirmation, in-memory snapshot on payment submit with clean `/book/confirmation` URL, responsive `ConfirmationSuccess` UI with guest/reservation details and GO BACK TO HOMEPAGE, enhanced `Stepper` with completed-step checkmarks.                                                                              | Claude Opus 4.8 for planning / Auto for execution |
| 2026-06-29 14:00 (UTC+2) | Cursor Chat (Agent) | Applied code-review fixes: composite `unitId:rateId` rate lookup key, `excludeDisabled` on price calendar, breakpoint-gated calendar fetches, sessionStorage guard against duplicate payment submission, `formatPhoneForSubmit` to avoid double +385 prefix, `usePropertySelection` in accommodation picker with downstream param clearing, removed duplicate hotel card click handler, stepper markup cleanup.                                                                        | Claude Opus 4.8 for planning / Auto for execution |
| 2026-06-29 17:28 (UTC+2) | Cursor Chat (Agent) | Added desktop-only full-screen background video to the home/accommodation page: created `background-video.tsx` (muted/loop/playsInline/autoPlay `<video>` with WebM+MP4 sources, JPG poster from Vercel Blob, gated behind `useMediaQuery("(min-width: 768px)")` so mobile never mounts/downloads it) and mounted it as the first child of `AccommodationPicker`'s root container.                                                                                                     | Claude Opus 4.8 for planning / Auto for execution |

## Refleksija o korištenju AI-ja

Prije svakog koraka postojao je plan; agent mode je odabran za implementaciju, a kontekst dizajna preuzet iz Figme.

### Alati

Koristio sam **Cursor**, većinom uz **Opus 4.8** za planiranje i **Auto mode** za implementaciju.

### 2–3 prompta na koje sam najponosniji

#### 1. Confirmation page (desktop + mobile)

```
/architect

Implement this design from Figma.
https://www.figma.com/design/VSIbLTPTWchu6UOfLCKkrN/Suncani-Hvar---Booking?node-id=2-9150&m=dev

After payment is done, clear url state, show 'back to homepage' button that will lead to homepage with no state.

Implement this design from Figma for mobile view
https://www.figma.com/design/VSIbLTPTWchu6UOfLCKkrN/Suncani-Hvar---Booking?node-id=2-13999&m=dev
```

#### 2. Code review protiv inicijalnog plana

```
/code-review review codebase. This was initial plan @.cursor/plans/url-driven_booking_flow_684cfeff.plan.md .
```

Funkcionirali su dobro jer su imali **skillse** s jasnom namjenom, pa nije bilo potrebno puno objašnjavati. Svaki prompt bi prvo napravio plan, koji bi se pregledao, i tek bi onda krenula implementacija.

### Primjer „AI je pogriješio"

- **Problem:** Screenshot _Order Summary_ — AI je zaboravio koristiti **shadcn** kao postojeći design sustav i umjesto toga pisao prilagođene UI komponente.
- **Kako sam uočio:** Usporedbom s Figma dizajnom i postojećim komponentama u projektu.
- **Kako sam popravio:** Ručno usmjerio AI na postojeće shadcn komponente i ponovio implementaciju.

### Ovo namjerno nisam radio uz AI

**Routing sustav i folder struktura** — postavio sam ih ručno kako bi AI lakše pratio arhitekturu umjesto da je sam izmišljao.

### Kratka refleksija

Zbog AI-ja i povezanosti s Figmom bilo je lakše dovesti dizajn u kod, umjesto da sam ga ručno pisao. Mana je naravno vrijeme potrošeno na code-review i praćenje je li AI nešto zaboravio ili krivo implementirao.
