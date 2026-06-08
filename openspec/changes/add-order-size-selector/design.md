## Context

BeanBotics currently renders one order button per menu item and always submits orders with `size: "medium"` from the frontend. Menu data already contains a `sizes` map with per-size pricing, and the backend `POST /api/orders` endpoint already accepts size values used by current order creation logic.

The requested change is frontend-focused: add a size selector to ordering controls, show the selected size price in the UI, and submit the chosen size. The change must avoid new backend endpoints, menu schema updates, and unrelated UI redesign.

## Goals / Non-Goals

**Goals:**
- Let customers choose `small`, `medium`, or `large` before placing an order.
- Display a size-dependent price in the ordering controls so users see the exact charge before submission.
- Send the selected size in the existing order payload to `POST /api/orders`.
- Keep implementation limited to minimal HTML/CSS/JS changes in the current frontend architecture.

**Non-Goals:**
- Drink customizations (milk, flavors, extra shots, modifiers).
- Backend API changes, new routes, or data model expansion.
- Menu content/schema updates in `backend/data/menu.json`.
- Broader UX redesign beyond the size selector and price display.

## Decisions

1. Use per-menu-card order controls as the "order form".
Rationale: The current UI is card-based with an order action on each item. Adding a selector adjacent to that action minimizes layout disruption and matches existing flow.
Alternative considered: A separate global order form. Rejected because it introduces additional state synchronization between selected item and form fields.

2. Derive selector options from fixed canonical sizes (`small`, `medium`, `large`) and disable unavailable sizes per item.
Rationale: Requirement calls for these three sizes, while menu items may not provide all size prices. Showing all three and disabling unsupported ones keeps UX consistent while preventing invalid orders.
Alternative considered: Render only sizes present in `item.sizes`. Rejected because option count/order would vary per item and weaken explicit size model.

3. Compute displayed price from selected size for each item.
Rationale: Price transparency requires immediate feedback tied to selector state. Keeping this logic client-side avoids extra API calls.
Alternative considered: Keep "From $X" text and only apply size on submit. Rejected because it does not satisfy selected-size-driven price display.

4. Update `placeOrder` to accept size argument and include it in payload.
Rationale: This is the minimal code change needed to satisfy submission behavior while preserving existing API usage.
Alternative considered: Store global selected size state. Rejected because selections are item-specific and a global state risks cross-item mismatches.

## Risks / Trade-offs

- [Risk] Some menu items may not include one or more canonical sizes. -> Mitigation: Disable unavailable size options and default the selector to first available option per item.
- [Risk] Inline event handlers become more complex when passing both item ID and selected size. -> Mitigation: Use data attributes and local event listeners or helper functions to keep parameter passing explicit.
- [Risk] Minor CSS adjustments may affect card height consistency. -> Mitigation: Use compact selector/price container styles and verify responsive rendering.

## Migration Plan

- Deploy frontend changes only; no backend migration required.
- Rollback by restoring previous frontend files if regressions appear.

## Open Questions

- Should unavailable sizes be hidden or visible-but-disabled? Current design chooses visible-but-disabled for consistency and clarity.
