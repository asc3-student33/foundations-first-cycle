## ADDED Requirements

### Requirement: Summary view is shown after successful placement
The system SHALL display an order summary view after the customer places orders through the Place Your Order action.

#### Scenario: Summary appears after placement
- **WHEN** one or more selected orders are successfully placed
- **THEN** the system displays a summary view for the just-placed orders

### Requirement: Summary view shows ordered items and total price
The system SHALL show ordered item labels and the total price for the placed orders in the summary view.

#### Scenario: Summary content includes items and total
- **WHEN** the summary view is displayed
- **THEN** it lists each placed item and shows the combined total price for those items

### Requirement: Summary view provides navigation back to menu
The system SHALL provide a clear action in the summary view that returns the customer to the menu page/view.

#### Scenario: Return to menu from summary
- **WHEN** the customer selects the summary view return action
- **THEN** the system navigates back to the menu view

### Requirement: Summary confirmation controls when orders are marked placed
The system SHALL provide a Confirm action in the summary view and SHALL mark submitted orders as placed only after confirmation.

#### Scenario: Orders remain pending before confirmation
- **WHEN** orders have been submitted and the customer has not clicked Confirm
- **THEN** those orders remain in pending state for summary review

#### Scenario: Confirm marks submitted orders as placed
- **WHEN** the customer clicks Confirm in summary view
- **THEN** the reviewed submitted orders are marked as placed in the frontend flow

### Requirement: Previous Orders list includes only confirmed placed orders
The system SHALL show a separate Previous Orders list below the Place Your Order action and SHALL include only confirmed placed orders.

#### Scenario: Exclude unconfirmed pending orders
- **WHEN** an order has been submitted but not confirmed from summary
- **THEN** it is not shown in the Previous Orders list

#### Scenario: Show confirmed orders as history
- **WHEN** orders are confirmed from summary and available in order history
- **THEN** the Previous Orders list displays those orders as previously placed entries
