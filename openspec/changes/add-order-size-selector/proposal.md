## Why

Customers can currently place an order without explicitly choosing a drink size in the order form, which makes pricing feedback unclear at selection time. Adding a size selector now improves ordering clarity and aligns the frontend flow with size-based pricing already present in menu data and order payloads.

## What Changes

- Add a size selector to the order form with `small`, `medium`, and `large` options.
- Update the order form price display to reflect the currently selected size and selected drink.
- Ensure the selected size is included in the order submission payload sent to existing `POST /api/orders`.
- Keep scope limited to size selection and price display only.
- Explicitly exclude drink customizations, menu schema changes, backend endpoint additions, and unrelated UI redesign.

## Capabilities

### New Capabilities
- `order-size-selection`: Let customers choose size in the order form, see size-driven pricing, and submit orders with the chosen size.

### Modified Capabilities
- None.

## Impact

- Frontend files: `frontend/index.html`, `frontend/script.js`, and potentially `frontend/style.css` for minimal selector/display styling.
- API usage: Existing endpoints only (`GET /api/menu`, `POST /api/orders`), no contract expansion beyond using existing size field.
- Backend: No new endpoints; existing order validation/creation path is reused.
- Dependencies and infrastructure: No new libraries, services, or storage changes.
