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

## Coastal Observatory refresh · 24 October 2026

The existing workflow and Instrument Sans remain. Themely supplied a coastal theme direction; the Awesome DESIGN Linear study informed hierarchy, surface separation and restrained accents, adapted to Tideprint's own light panels and teal brand. UI UX Designer's redesign guidance informed focus, readable controls and retention of existing workflows. The Anatomy paper press is now reusable on the workspace and method page; its reduced-motion and keyboard controls remain functional.

- Navigation: ocean #123b42, text #c2d5d6, selected #24565c with a pale #a6d9cc indicator.
- Canvas #f3f6f5, panels #ffffff, borders #d8e3e1. Primary action #075e67 on white.
- Home: actual NOAA archive, original-only source action, interactive retained-record illustration. Deliberately altered records remain clearly identified when opened from older saved receipts.
- Phone: two-column labelled navigation, stacked illustration, readable input sizes, larger touch targets and text in the inspector, forms, receipts and method.
- No demo, prototype or hackathon positioning appears in normal product screens. Technical limitations and provenance remain visible.

12ui's hosted improve pass was attempted but requires account sign-in; no generated candidate was produced or claimed. This refresh uses the other requested design references directly. Final visual comparison at desktop and phone widths remains a release gate after authorized Vercel deployment; the user's connected browser cannot access the workspace's localhost server. Automated component tests do not establish visual fidelity.
