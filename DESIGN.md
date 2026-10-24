# Tideprint design system

A precise, light coastal-data workbench. The 12ui marine collection reference informed the navigation/list/inspector hierarchy; no reference assets or layouts are copied. Typography and data get the attention, with a restrained sea-teal action colour. No decorative map or invented live metrics.

- Font: self-hosted Instrument Sans, with system fallback. Tabular values use a monospace stack.
- Ink #18363e, secondary #52686e, action #075e67, background #f3f7f7, panel #ffffff, border #dce5e6. Warning #885200 on #fff4dc; success #14664a on #e7f5ed. Selection uses #d5edf0.
- Spacing: 4/8/12/16/24/32/48/64. Controls have a 44 px minimum touch target; panel radii 16–24 px. Primary page headings 36–56 px, section headings 20–24 px, body 15–17 px.
- Desktop: quiet 216 px navigation rail, generous content region, wide actual time-series chart, master/detail review queue. Phone: horizontal labelled navigation, stacked chart/list/inspector, no hidden critical actions.
- Flow: start with the offer and real archived NOAA record; import choices expose limits and datum before committing. A loading action names the operation. Error messages preserve existing work. Every flagged reading requires an explicit keep/exclude decision and reason. Seal explains immutability and the self-declared reviewer label.
- Receipt status separates local integrity, pending calendar proof and verified Bitcoin header. No green 'blockchain verified' label on an unconfirmed or failed proof.
- Accessible focus ring, reduced motion, labelled inputs, chart/table alternatives, status announcements, actual disabled states. No icon-only primary navigation.
- Anatomy Figure: a 40–80-part physical paper press on the Method page. Its moving clamp illustrates freezing a review record; it does not simulate a blockchain transaction.

Design and usability remain hypotheses until observed with intended users. Functional browser checks do not establish human usability.
