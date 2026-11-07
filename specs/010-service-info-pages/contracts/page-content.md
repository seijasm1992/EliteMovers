# Contract: Contenido de las 5 páginas

Borrador del texto visible, en inglés. Cada afirmación lleva su fuente entre corchetes; las fuentes no se publican. Abreviaturas:

- **INC-x**: `src/data/includedServices.ts`, ítem `x` ("What's Included" del home)
- **FAQ-x**: `src/data/faqContent.ts`, id `x`
- **GUA-x**: `src/data/guarantee.ts`, tarjeta `x`
- **STP-n**: `src/data/steps.ts`, paso `n`
- **ABT**: `src/data/aboutUs.ts` ("hand off the whole move as one job, instead of juggling movers, packers, and logistics separately")

Frases sin corchete son transiciones sin datos del negocio. Al implementar se puede pulir la redacción sin agregar afirmaciones nuevas.

---

## Packing Services — `/packing-services/`

**Meta description**: Hourly packing help in Miami-Dade and Broward, usually scheduled a day or two before your move, with boxes and packing materials available.

**Hero**: Add packing to your move and our crew will box up your home before the truck arrives [FAQ-combined-services, FAQ-packing-minimum]. Packing is usually scheduled one to two days ahead [FAQ-packing-minimum], and boxes and packing materials come with the service [FAQ-packing-materials].

**Steps — "How We Pack Your Home"**

1. **Tell us what needs packing.** When you request your quote, share your packing needs along with the room count and move date, so we can plan the job. [STP-01]
2. **We pack a day or two ahead.** Packing is usually scheduled one to two days before your move, billed by the hour with a three-hour minimum. [FAQ-packing-minimum]
3. **Boxed up and ready to load.** On move day, furniture is wrapped with moving blankets and industrial wrap, included at no extra cost. [FAQ-packing-materials]

**Closing**: Add packing to your quote →

---

## Installation — `/installation/`

**Meta description**: Our crew takes apart standard furniture, puts it back together at your new home, and can mount your TV on the wall as an add-on to the same booking.

**Hero**: Bed frames, desks, and sectionals don't always fit through a doorway in one piece. Our crew takes standard furniture apart when needed and reassembles it at your new place [INC-furniture]. Wall-mounting your TV can be added as an installation add-on [INC-furniture].

**Steps — "How We Take Furniture Apart and Put It Back Together"**

1. **We take it apart.** The crew disassembles bed frames, headboards, tables, desks, standard shelves, and sofas when needed, and takes down your TV if it's moving with you. [INC-furniture]
2. **It moves with everything else.** Disassembled pieces are wrapped and loaded with the rest of your things, on the same booking. [GUA-protection, FAQ-combined-services]
3. **We put it back together.** At your new place, the crew reassembles your furniture and, if you added it, mounts your TV on the wall. [INC-furniture, FAQ-combined-services]

**Closing**: Include assembly or TV mounting in your quote →

---

## High-Value Items — `/high-value-items/`

**Meta description**: How our background-checked crew handles artwork, safes, and gym equipment: a walkthrough before loading, wrapping, and floor and door protection.

**Hero**: Artwork, a safe, gym equipment: some items need more planning than others [FAQ-fragile-items]. They get the same protection we use on every move, handled by a background-checked crew that reviews the job before anything is loaded [GUA-protection, GUA-crew, STP-02].

**Steps — "How We Handle High-Value Items"**

1. **Tell us about them up front.** List safes, artwork, gym equipment, and other unusual items when you request your quote, so we can assign the right crew and equipment. [FAQ-fragile-items]
2. **A walkthrough before loading.** Your background-checked crew arrives early, checks access points, and plans the loading order before anything moves. [GUA-crew, STP-02]
3. **Wrapped, with the path protected.** Furniture is wrapped, and floors, door jambs, and corners are covered before the first piece leaves the room. [GUA-protection, INC-protection]

**Closing**: List your high-value items in your quote →

**No mencionar**: cajas a medida, embalaje especial, seguro adicional o "full value", valoración de artículos, pianos. No prometer transportar objetos irreemplazables: el FAQ recomienda que el cliente los lleve [FAQ-restricted-items].

---

## Furniture Protection — `/furniture-protection/`

**Meta description**: We wrap your furniture and protect floors, door jambs, corners, hallways, and elevators before loading. Moving blankets and wrap are included on every job.

**Hero**: Protecting your furniture starts before anything leaves the room. We wrap furniture and protect floors, doors, and high-traffic areas before loading begins, to help prevent scratches and dents [GUA-protection, INC-protection]. Moving blankets and industrial wrap are included on every job [FAQ-packing-materials].

**Steps — "How We Protect Your Home and Furniture"**

1. **The path comes first.** Before loading, the crew lays floor runners and covers door jambs and corners. Hallways and elevators get protection too when required. [INC-protection]
2. **Every piece gets wrapped.** Furniture is wrapped in moving blankets and industrial wrap before it's carried out. [GUA-protection, FAQ-packing-materials]
3. **Placed where you want it.** The crew loads, transports, and places each piece in the room you choose at your new home. [STP-03]

**Closing**: Get a quote with protection included →  *(la protección está incluida en la tarifa por hora [INC intro])*

---

## Move Coordination — `/move-coordination/`

**Meta description**: One booking for packing, assembly, and TV mounting, plus a confirmation, reminders, and move-day updates. Here's how we keep your Miami move on track.

**Hero**: Instead of juggling movers, packers, and installers separately, you can add packing, furniture assembly, and TV mounting to one booking [ABT, FAQ-combined-services]. From there, we keep you posted from booking to completion [INC-updates].

**Steps — "How We Coordinate Your Move"**

1. **One booking, confirmed.** Combine the services you need in a single booking. You get a booking confirmation and reminders before move day. [FAQ-combined-services, INC-updates]
2. **A crew that shows up with a plan.** The crew arrives 10 to 15 minutes early, checks access points, and plans the loading order. [STP-02, FAQ-arrival-time]
3. **Updates until the last box.** We send move-day and completion updates to the contact on file, and you can track the crew and truck when the service is available. [INC-updates, INC-tracking]

**Closing**: Plan your move with a quote →

---

## Revisión de unicidad (FR-008)

- Las 5 frases del encabezado, los 15 pasos y las 5 líneas de cierre son distintas.
- Furniture Protection y High-Value Items comparten medidas, pero con enfoque distinto: la primera describe la protección en toda mudanza (camino, envoltura y colocación); la segunda cómo se planifican los artículos de valor (aviso al cotizar, revisión previa).
- Packing e Installation mencionan "same booking" con palabras y en pasos distintos; Move Coordination es la única que lo usa como tema central.

**Ajustes en la implementación (T020)**: Se cambiaron el título de pasos y la línea de cierre de Installation porque solo cambiaban el nombre respecto de High-Value Items ("How We Handle X") y Packing ("Add X to your quote"). Se acortaron las meta descriptions de High-Value Items y Furniture Protection a menos de 160 caracteres. Sin afirmaciones nuevas.
