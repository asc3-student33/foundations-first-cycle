## ADDED Requirements

### Requirement: Customers can choose drink size before ordering
The system SHALL provide a size selector in each menu item's ordering controls with options for `small`, `medium`, and `large`.

#### Scenario: Selector options are presented consistently
- **WHEN** the menu is rendered for a drink item
- **THEN** the order controls show `small`, `medium`, and `large` size options

#### Scenario: Unavailable sizes cannot be submitted
- **WHEN** a drink item does not support one or more of the canonical sizes
- **THEN** unsupported size options are not selectable for that item

### Requirement: Displayed order price reflects selected size
The system SHALL display the price for the currently selected size of a drink item before the order is placed.

#### Scenario: Price updates on size change
- **WHEN** a customer changes the selected size for a drink item
- **THEN** the displayed price updates to the price mapped to that size for the same item

#### Scenario: Initial price matches initial size
- **WHEN** ordering controls first render for a drink item
- **THEN** the displayed price matches the initially selected valid size option

### Requirement: Submitted orders include the selected size
The system SHALL send the currently selected size with the order request payload using the existing order endpoint.

#### Scenario: Payload contains selected size
- **WHEN** a customer places an order for a drink item
- **THEN** the request body to `POST /api/orders` includes `item_id` and the selected `size`

#### Scenario: Submission uses item-local selection
- **WHEN** customers select different sizes on different drink items and place orders
- **THEN** each order request includes the size selected for the specific item being ordered
