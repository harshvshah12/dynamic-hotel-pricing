# Datasets Documentation: Dynamic Hotel Pricing Management System

## 1. Primary Benchmark Dataset

| Metadata Field | Value / Details |
| :--- | :--- |
| **Dataset Name** | Hotel Booking Demand Dataset (Antonio, de Almeida, and Nunes) |
| **Source / Platform** | *Data in Brief* (Elsevier, Vol. 22, 2019, pp. 41–49) & TidyTuesday / Kaggle / UCI Archive |
| **Direct Source URL** | https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2020/2020-02-11/hotels.csv |
| **Original DOI** | https://doi.org/10.1016/j.dib.2018.11.126 |
| **Date Accessed** | August 25, 2026 |
| **License / Usage** | Creative Commons Attribution 4.0 International (CC BY 4.0) |
| **Total Records** | 119,390 observations |
| **Total Features** | 32 operational attributes |
| **Target Variable** | dr (Average Daily Rate in Euros per occupied room per night) |
| **Properties Represented**| **H1**: Resort Hotel (Algarve, Portugal - 40,060 observations)<br>**H2**: City Hotel (Lisbon, Portugal - 79,330 observations) |
| **Temporal Range** | July 1, 2015 to August 31, 2017 |

---

## 2. Rationale for Dataset Selection
1. **Academic Benchmark Quality**: This dataset is the universally recognized gold standard in hospitality revenue management, pricing elasticity studies, and demand forecasting literature.
2. **Multi-Property Coverage**: Contains both a coastal leisure resort hotel (highly seasonal, high weekend variation) and an urban business city hotel (steady corporate demand, midweek peaks), allowing models to learn distinct pricing regimes.
3. **Rich Feature Dimensionality**: Captures granular booking horizon (lead time up to 737 days), customer types, distribution channels, room categories, meal plans, parking requests, and special requests.
4. **Real Financial Transactions**: The dr target is derived directly from PMS accounting systems ($\text{ADR} = \frac{\text{Room Revenue}}{\text{Occupied Rooms}}$), representing genuine executed transactions.

---

## 3. Comprehensive Feature Dictionary

| Feature Name | Type | Description | Included in ML? | Rationale / Transformation |
| :--- | :--- | :--- | :--- | :--- |
| hotel | Categorical | Resort Hotel (H1) or City Hotel (H2) | **Yes** | Primary property category; One-Hot Encoded |
| is_canceled | Binary | Whether the booking was canceled | **No** | **LEAKAGE AUDIT**: Excluded. Unknown at time of rate quotation |
| lead_time | Integer | Number of days between booking date and arrival date | **Yes** | Key demand elasticity signal; Scaled + Binned |
| rrival_date_year | Integer | Year of arrival (2015, 2016, 2017) | **Yes** | Macroeconomic trend factor |
| rrival_date_month | Categorical | Month of arrival (January to December) | **Yes** | Cyclical encoded (sin_month, cos_month) |
| rrival_date_week_number | Integer | Week number of arrival (1-53) | **Yes** | High-resolution seasonality |
| rrival_date_day_of_month | Integer | Day of arrival (1-31) | **Yes** | Month cycle position |
| stays_in_weekend_nights | Integer | Number of weekend nights (Sat/Sun) | **Yes** | Weekend premium feature |
| stays_in_week_nights | Integer | Number of weekday nights (Mon-Fri) | **Yes** | Duration of stay component |
| dults | Integer | Number of adult occupants | **Yes** | Occupancy demand / capacity |
| children | Float | Number of children | **Yes** | Family segment indicator |
| abies | Integer | Number of babies | **Yes** | Family demand indicator |
| meal | Categorical | Undefined/SC (Self Catering), BB (Bed & Breakfast), HB (Half Board), FB (Full Board) | **Yes** | Value-add package tier; One-Hot Encoded |
| country | Categorical | Origin country code (ISO 3166) | **Yes** | Top origin countries encoded, rare grouped into 'Other' |
| market_segment | Categorical | Direct, Corporate, Online TA, Offline TA/TO, Aviation, Groups, Complementary | **Yes** | Price sensitivity segment; One-Hot Encoded |
| distribution_channel | Categorical | Direct, Corporate, TA/TO, GDS | **Yes** | Intermediary commission factor |
| is_repeated_guest | Binary | 1 if past guest, 0 otherwise | **Yes** | Loyalty indicator |
| previous_cancellations | Integer | Number of previous bookings canceled by guest | **Yes** | Historical customer reliability |
| previous_bookings_not_canceled | Integer | Number of past completed bookings | **Yes** | Loyalty booking count |
| eserved_room_type | Categorical | Code of room type reserved (A to P) | **Yes** | Room tier category; One-Hot Encoded |
| ssigned_room_type | Categorical | Code of room type assigned at check-in | **No** | **LEAKAGE AUDIT**: Excluded. Determined at check-in |
| ooking_changes | Integer | Number of amendments made before check-in | **Yes** | Set to 0 for new quote simulations |
| deposit_type | Categorical | No Deposit, Non Refund, Refundable | **Yes** | Commitment tier |
| gent | Categorical | ID of travel agency | **Yes** | Handled via has_agent binary flag |
| company | Categorical | ID of corporate booking entity | **Yes** | Handled via is_corporate binary flag |
| days_in_waiting_list | Integer | Days reservation was in waiting queue | **Yes** | Excess demand pressure indicator |
| customer_type | Categorical | Transient, Contract, Transient-Party, Group | **Yes** | Contractual rate vs retail market rate |
| dr | Float | **TARGET**: Average Daily Rate (EUR/night) | **Target** | Filtered:  < \text{adr} \le 1000$ |
| equired_car_parking_spaces | Integer | Number of parking spots requested | **Yes** | Direct/road traveler signal |
| 	otal_of_special_requests | Integer | High floor, twin bed, crib, etc. | **Yes** | High-touch customer willingness-to-pay |
| eservation_status | Categorical | Check-Out, Canceled, No-Show | **No** | **LEAKAGE AUDIT**: Excluded. Determined post-departure |
| eservation_status_date | Date | Date when last status was updated | **No** | **LEAKAGE AUDIT**: Excluded. Post-booking timestamp |

---

## 4. Data Quality Observations & Cleaning Strategy

1. **Target Outliers & Erroneous Values**:
   - Negative rate observed: dr = -6.38 (accounting correction/refund). Filtered out ( > 0$).
   - Zero rate observed: dr = 0.0 (complimentary rooms, loyalty reward redemptions, staff stays). Filtered out for pricing regression ( \ge 10.0$).
   - Extreme outlier observed: dr = 5400.0 (single anomalous entry representing typo or multi-room group error). Clipped/filtered at  \le 800.0$.
2. **Zero Guest Anomalies**:
   - 180 records contain dults = 0, children = 0, babies = 0. These invalid records are dropped.
3. **Missing Value Imputation**:
   - children: 4 missing entries $\rightarrow$ Imputed with mode ($).
   - country: 488 missing entries $\rightarrow$ Imputed with 'PRT' (Portugal modal origin) or 'Unknown'.
   - gent / company: Converted into binary indicators has_agent and is_company_booking.

---

## 5. Strict Data Leakage Audit

`
+------------------------------------------------------------+
¦                    DATA LEAKAGE AUDIT                     ¦
+------------------------------------------------------------¦
¦ Post-Booking Feature       ¦ Decision & Enforcement        ¦
+----------------------------+-------------------------------¦
¦ is_canceled                ¦ EXCLUDED from training set    ¦
¦ reservation_status         ¦ EXCLUDED from training set    ¦
¦ reservation_status_date    ¦ EXCLUDED from training set    ¦
¦ assigned_room_type         ¦ EXCLUDED (use reserved_room)  ¦
¦ days_in_waiting_list       ¦ Retained (known at quote)     ¦
¦ booking_changes            ¦ Initialized to 0 at quote     ¦
+------------------------------------------------------------+
`

All preprocessing transformers (StandardScaler, OneHotEncoder) are fit strictly on the \%$ training split. Test set data (\%$) and cross-validation validation folds are strictly transformed without data snooping.
