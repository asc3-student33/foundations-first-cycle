## 1. Menu Card Size Controls

- [x] 1.1 Update menu card rendering in `frontend/script.js` to include size selector controls for `small`, `medium`, and `large` per item.
- [x] 1.2 Implement per-item default size selection to the first available supported size and mark unsupported sizes as disabled.
- [x] 1.3 Add a size-driven price display element in each menu card order controls.

## 2. Ordering Behavior

- [x] 2.1 Refactor `placeOrder` in `frontend/script.js` to accept a selected size argument instead of hardcoded `medium`.
- [x] 2.2 Wire order button handlers to read the item-local selected size and pass it in the `POST /api/orders` payload.
- [x] 2.3 Keep existing order queue refresh/error handling behavior unchanged after successful/failed submission.

## 3. UI Polish And Verification

- [x] 3.1 Apply minimal styling updates in `frontend/style.css` so selector, size price, and order button remain readable on desktop and mobile card layouts.
- [x] 3.2 Manually verify scenarios: size options visible, unavailable options not selectable, displayed price changes with size selection.
- [x] 3.3 Manually verify submission payload behavior by placing orders from different cards with different sizes and confirming resulting order totals/status flow remain correct.
