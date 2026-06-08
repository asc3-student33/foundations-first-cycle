## 1. Pending Order Selection Flow

- [x] 1.1 Refactor `frontend/script.js` menu card actions to add selected item-size pairs into a frontend pending-order collection instead of immediately posting each click.
- [x] 1.2 Add helper functions in `frontend/script.js` to update pending-order state, including add/remove/clear behavior for selected entries.
- [x] 1.3 Add UI rendering logic that shows or hides the Place Your Order button based on whether the pending-order collection contains at least one entry.

## 2. Place Order Submission Behavior

- [x] 2.1 Implement Place Your Order click handling in `frontend/script.js` to submit current pending entries through existing `POST /api/orders` calls.
- [x] 2.2 Handle partial submission failures with user-visible feedback and preserve failed pending entries for retry.
- [x] 2.3 Keep existing order queue refresh behavior after successful placements by reusing `loadOrders()`.

## 3. Summary View And Navigation

- [x] 3.1 Add summary view markup/state handling in `frontend/index.html` and `frontend/script.js` for ordered item names and aggregated total price.
- [x] 3.2 Populate summary content from successful order responses to ensure item labels and total reflect backend-accepted orders.
- [x] 3.3 Add a Return to Menu action in summary view that restores the menu view and resets transient summary state.

## 4. Styling And Verification

- [x] 4.1 Add minimal styles in `frontend/style.css` for Place Your Order CTA visibility state and summary view layout.
- [x] 4.2 Manually verify gating behavior: button hidden with zero pending entries and shown when at least one entry exists.
- [x] 4.3 Manually verify summary flow: place from pending selections, see item list and total, then return to menu view.
