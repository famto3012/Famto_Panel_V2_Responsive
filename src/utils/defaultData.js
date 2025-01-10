const itemTypes = [
  { label: "Documents & Parcels", value: "Documents & Parcels" },
  { label: "Food & Groceries", value: "Food & Groceries" },
  { label: "Clothing & Laundry", value: "Clothing & Laundry" },
  { label: "Medical Supplies", value: "Medical Supplies" },
  { label: "Personal Items", value: "Personal Items" },
  { label: "Gifts & Flowers", value: "Gifts & Flowers" },
  { label: "Electronics", value: "Electronics" },
  { label: "Household Items", value: "Household Items" },
  { label: "Books & Stationery", value: "Books & Stationery" },
  { label: "Online Orders", value: "Online Orders" },
  { label: "Pet Supplies", value: "Pet Supplies" },
  { label: "Automotive Parts", value: "Automotive Parts" },
  { label: "Others", value: "Others" },
];

const unitOptions = [
  { value: "gm", label: "gm" },
  { value: "kg", label: "kg" },
  { value: "ltr", label: "ltr" },
  { value: "m", label: "m" },
  { value: "cm", label: "cm" },
];

const orderStatusOption = [
  { value: "all", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "On-going", label: "On-going" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

const paymentModeOption = [
  { value: "all", label: "All" },
  { value: "Cash-on-delivery", label: "Pay on delivery" },
  { value: "Online-payment", label: "Online payment" },
  { value: "Famto-cash", label: "Famto cash" },
];

const deliveryModeOption = [
  { value: "all", label: "All" },
  { value: "Home Delivery", label: "Home Delivery" },
  { value: "Take Away", label: "Take Away" },
  { value: "Pick and Drop", label: "Pick and Drop" },
  { value: "Custom Order", label: "Custom Order" },
];

const serviceableOptions = [
  { value: "all", label: "All" },
  { value: "true", label: "Open" },
  { value: "false", label: "Closed" },
];

const userTypeOptions = [
  { value: "customer", label: "Customer" },
  { value: "agent", label: "Agent" },
  { value: "merchant", label: "Merchant" },
];

const userTypeForPushNotificationOptions = [
  { value: "customer", label: "Customer" },
  { value: "driver", label: "Agent" },
  { value: "merchant", label: "Merchant" },
];

const agentStatusOptions = [
  { value: "all", label: "All" },
  { value: "Free", label: "Free" },
  { value: "Busy", label: "Busy" },
  { value: "Inactive", label: "Inactive" },
];

const agentDeliveryManagementStatusOptions = [
  { value: "Free", label: "Free" },
  { value: "Busy", label: "Busy" },
  { value: "Inactive", label: "Inactive" },
];

const agentVehicleOptions = [
  { value: "all", label: "All" },
  { value: "Bike", label: "Bike" },
  { value: "Scooter", label: "Scooter" },
];

const accountLogsOptions = [
  { value: "Agent", label: "Agent" },
  { value: "Merchant", label: "Merchant" },
  { value: "Customer", label: "Customer" },
];

const payoutPaymentStatus = [
  { value: "all", label: "All" },
  { value: "true", label: "Paid" },
  { value: "false", label: "Un-paid" },
];

const vehicleTypeOptions = [
  { value: "Bike", label: "Bike" },
  { value: "Scooter", label: "Scooter" },
];

const agentTagOptions = [
  { value: "Normal", label: "Normal" },
  { value: "Fish & Meat", label: "Fish & Meat" },
];

const taskStatusOptions = [
  { value: "Unassigned", label: "Unassigned Tasks" },
  { value: "Assigned", label: "Assigned Tasks" },
  { value: "Completed", label: "Completed Tasks" },
];

const promoCodeModeOptions = [
  { value: "Public", label: "Public" },
  { value: "Hidden", label: "Hidden" },
];

const paymentOptions = [
  { value: "Online-payment", label: "Online payment" },
  { value: "Cash-on-delivery", label: "Pay on delivery" },
];

const addNotificationSettingsOption = [
  { label: "New Order created", value: "newOrderCreated" },
  { label: "Order accepted", value: "orderAccepted" },
  { label: "Order rejected", value: "orderRejected" },
  { label: "Subscription plan end", value: "subscriptionPlanEnd" },
  {
    label: "Agent Order Accepted (For customer)",
    value: "agentOrderAccepted",
  },
  { label: "Agent Order Rejected (For Admin)", value: "agentOrderRejected" }, // TODO: Check if added notification
  { label: "Sponsorship plan expired", value: "sponsorshipPlanExpired" },
  {
    label: "Agent reached delivery Location",
    value: "reachedDeliveryLocation",
  },
  {
    label: "Agent reached pickup Location",
    value: "reachedPickupLocation",
  },
  {
    label: "Agent not reached pickup Location",
    value: "agentNotReachedPickupLocation",
  },
  {
    label: "Agent not reached delivery Location",
    value: "agentNotReachedDeliveryLocation",
  },
  {
    label: "Agent started delivery",
    value: "agentDeliveryStarted",
  },
  {
    label: "New order (Agent)",
    value: "newOrder",
  },
  {
    label: "Scheduled order created",
    value: "scheduledOrderCreated",
  },
  {
    label: "Order ready (Agent)",
    value: "orderReadyAgent",
  },
  {
    label: "Order ready (Customer)",
    value: "orderReadyCustomer",
  },
  {
    label: "Order completed",
    value: "orderCompleted",
  },
  {
    label: "Cancel custom Order By Agent",
    value: "cancelCustomOrderByAgent",
  },
];

export {
  itemTypes,
  unitOptions,
  orderStatusOption,
  paymentModeOption,
  deliveryModeOption,
  serviceableOptions,
  agentStatusOptions,
  agentVehicleOptions,
  accountLogsOptions,
  payoutPaymentStatus,
  userTypeOptions,
  userTypeForPushNotificationOptions,
  vehicleTypeOptions,
  agentTagOptions,
  taskStatusOptions,
  promoCodeModeOptions,
  paymentOptions,
  agentDeliveryManagementStatusOptions,
  addNotificationSettingsOption,
};
