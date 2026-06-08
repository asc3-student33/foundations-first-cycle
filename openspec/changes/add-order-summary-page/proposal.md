## Why

Customers currently place individual drink orders directly from menu cards and only see results in the queue list. There is no clear checkpoint that summarizes what will be placed, and no dedicated action that becomes available once at least one item is selected for ordering.

## What Changes

- Add a Place Your Order button that is shown only when there is at least one selected order item.
- Add a pre-submit order flow where clicking Place Your Order submits the selected items.
- Add an order summary page/view after placement that shows ordered item names and total price.
- Add a return action on the summary view to navigate back to the menu page.
- Keep existing backend endpoints; implement this as frontend behavior using existing API routes.

## Capabilities

### New Capabilities
- `place-order-gating`: Controls when the Place Your Order action is visible and enabled based on whether at least one item is queued for placement.
- `order-summary-view`: Displays post-placement summary details (items and total price) and supports navigation back to the menu.

### Modified Capabilities
- None.

## Impact

- Frontend files: `frontend/index.html`, `frontend/script.js`, `frontend/style.css`.
- API usage: Existing `POST /api/orders` and `GET /api/orders` flows reused; no new endpoints.
- State management: Adds frontend-local pending selection/summary state.
- No dependency or infrastructure changes.
