## ADDED Requirements

### Requirement: Pending order view shows selected items before confirmation
The system SHALL render a pending-order list on the menu page that contains items the customer has added and items awaiting confirmation.

#### Scenario: Empty pending list state
- **WHEN** the customer has not added any items
- **THEN** the pending-order list shows an empty-state message

#### Scenario: Pending list includes added entries
- **WHEN** the customer adds one or more menu items
- **THEN** the pending-order list shows those entries with item label and price

### Requirement: Place Your Order action state is gated by pending data
The system SHALL keep the Place Your Order action visible and gate activation based on pending data.

#### Scenario: Button disabled with no pending data
- **WHEN** there are no newly added items and no awaiting-confirmation items
- **THEN** the Place Your Order action is visible but disabled

#### Scenario: Button enabled when pending exists
- **WHEN** there is at least one newly added item or awaiting-confirmation item
- **THEN** the Place Your Order action is enabled

### Requirement: Place Your Order submits newly added items and reopens review for awaiting items
The system SHALL submit newly added pending items, and SHALL reopen summary review when only awaiting-confirmation items remain.

#### Scenario: Submission sends selected items
- **WHEN** the customer clicks Place Your Order with one or more newly added items
- **THEN** the system sends order requests for the selected item and size values using the existing order endpoint

#### Scenario: Review pending items without duplicate submission
- **WHEN** the customer clicks Place Your Order with no newly added items and one or more awaiting-confirmation items
- **THEN** the system returns to the summary review state instead of sending duplicate order requests
