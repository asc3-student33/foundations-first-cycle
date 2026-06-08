## Context

BeanBotics currently allows ordering directly from each menu card and immediately posts a single item-size pair to the backend. The requested flow introduces a gated Place Your Order action and a post-submit summary view without backend contract changes. The change is frontend-heavy and must preserve existing API usage and in-memory order behavior.

## Goals / Non-Goals

**Goals:**
- Introduce a frontend pending-order selection state that can contain one or more selected menu entries.
- Show Place Your Order only when pending-order selection has at least one entry.
- Submit selected order entries through the existing POST /api/orders endpoint when Place Your Order is clicked.
- Show a summary view containing ordered item names and aggregated total price after placement.
- Provide a clear action to return from summary view to the menu view.

**Non-Goals:**
- Creating new backend routes or request/response schemas.
- Adding drink customizations, discounts, payment, or user profiles.
- Changing menu data format in backend/data/menu.json.

## Decisions

1. Use frontend-local pending order collection before placement.
Rationale: This supports conditional rendering of the Place Your Order button and enables summary generation after batch placement without backend changes.
Alternative considered: Immediate per-item submission only. Rejected because it cannot support "show button only when at least one order" requirement naturally.

2. Keep backend as source of truth per item submission.
Rationale: Existing POST /api/orders validates item and size. Reusing this endpoint avoids API expansion and preserves service-layer logic.
Alternative considered: Add batch order endpoint. Rejected as out of scope.

3. Implement summary as a frontend view state in the same page.
Rationale: A view-state toggle in the single-page architecture is simpler than introducing multi-page routing.
Alternative considered: New standalone summary HTML page. Rejected to avoid extra navigation complexity.

4. Compute summary total from placed-order responses.
Rationale: Backend response contains canonical item labels and total_price values, ensuring summary reflects accepted orders.
Alternative considered: Compute from client menu price data only. Rejected due to potential mismatch with backend validation.

## Risks / Trade-offs

- [Risk] Partial placement if one item submission fails during multi-item submit. -> Mitigation: surface clear error feedback and keep failed items in pending state for retry.
- [Risk] Additional frontend state complexity in a vanilla JS app. -> Mitigation: isolate state transitions into small helper functions.
- [Risk] UI confusion between pending selections and already placed queue entries. -> Mitigation: use explicit labels and separate summary section/view.

## Migration Plan

- Deploy as frontend-only code changes.
- No data migration required.
- Rollback by restoring previous frontend files if regressions are detected.

## Open Questions

- Should placement stop on first failed item or continue and summarize successful items only?
- Should summary show server-assigned order IDs in addition to item names and total?
