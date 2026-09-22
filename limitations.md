# Technical Limitations & Assumptions
# Dynamic Hotel Pricing Management System

## 1. Geographic & Property Specificity
- The underlying benchmark dataset originates from two properties in Portugal (a luxury resort in Algarve and an urban commercial hotel in Lisbon).
- While the learned seasonal, lead-time, and room-tier dynamics demonstrate high internal validity, deploying the system in other global markets (e.g., North America or Asia-Pacific) requires transfer learning or local recalibration.

## 2. Competitor Pricing Availability
- The public benchmark dataset does not contain real-time competitor rate feeds from web scrapers.
- In this implementation, competitor price indices are parameterized via market segment elasticity and customer distribution channel indices.

## 3. Cancellation Policy Assumption
- Because cancellation outcomes (`is_canceled`) occur strictly *after* price quotation, cancellation features were deliberately excluded during training to eliminate data leakage.

## 4. Static Inventory Constraints
- Live PMS inventory pacing is estimated via rolling weekly demand distributions and configurable occupancy levels rather than a live two-way database connection.
