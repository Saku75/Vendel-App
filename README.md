# Vendel-App

Vendel Familie Hjemmeside - [V2.Vendel.dk](https://v2.vendel.dk)

- [Projekt Beskrivelse](.project/Vendel-Project.pdf)

## Funktionalitet

- [x] Hente Ønskelister
- [x] Oprette Ønskelister
- [x] Redigere Ønskelister
- [x] Slette Ønskelister
- [x] Hente Ønsker
- [x] Oprette Ønsker
- [x] Redigere Ønsker
- [x] Slette Ønsker
- [ ] Opret Brugere
- [ ] Login med Brugere
- [ ] Nulstil Adgangskoder
- [ ] Admin Bruger Kontrol
- [ ] Admin Bruger Godkendelse
- [ ] Reservering af Ønsker

## Hvorfor er projektet ikke færdigt?

Jeg blev nød til at skære ned på mit projekt da tiden løb fra mig.
Jeg endte med at bruge alt for lang tid på [Routeren](.old/router.ts) og det gik udover mit login system.
Man kan se mange af resterne fra det originale projekt i [.old](.old) mappen. (f.eks [Routeren](.old/router.ts) som jeg endte med at droppe)

## Hvad blev lavet færdigt?

- En API som kan hente, oprette, slette og redigere ønsker og ønskelister
- En frontend som tillader brugeren at bruge at hente, oprette, slette og redigere ønsker og ønskelister gennem APIen
- Starten på et validerings komponent som skal kunne bruges universelt
- Et MariaDB komponent som kan bruges i sammenhæng hvor der skal snakkes med en MariaDB database

## Er jeg selv tilfreds?

Det korte svar er nej, jeg satte mig for at lave et helt andet system end hvad jeg er endt med.
Der er meget er projektet som ikke er særlig optimatiseret og helt klart kan blive refactored til at være mindre kompliceret og hurtigere.
Der er en god del af komponenterne der godt kunne lavet smartere så de kan brugere mere generelt og hvad en bredere funktionalitet.

Dog vil jeg så stadig sige at jeg har opnået basis funktionaliteten af siden og at den "fungere" med det der nu er.
