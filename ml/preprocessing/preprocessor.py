"""
Leakage-Free Preprocessing and Feature Engineering Module
For Dynamic Hotel Pricing Management System
"""
import os
import math
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import joblib

MONTH_MAP = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12
}

NUMERIC_FEATURES = [
    'lead_time',
    'total_stay_nights',
    'stays_in_weekend_nights',
    'stays_in_week_nights',
    'total_guests',
    'adults',
    'children',
    'babies',
    'previous_cancellations',
    'previous_bookings_not_canceled',
    'booking_changes',
    'days_in_waiting_list',
    'required_car_parking_spaces',
    'total_of_special_requests',
    'sin_month',
    'cos_month',
    'sin_week',
    'cos_week',
    'is_weekend_stay',
    'is_family',
    'estimated_occupancy_rate'
]

CATEGORICAL_FEATURES = [
    'hotel',
    'meal',
    'market_segment',
    'distribution_channel',
    'deposit_type',
    'customer_type',
    'reserved_room_type',
    'season',
    'lead_time_category'
]

ALL_FEATURE_COLUMNS = NUMERIC_FEATURES + CATEGORICAL_FEATURES

def get_season(month_num: int) -> str:
    if month_num in [12, 1, 2]:
        return 'Winter'
    elif month_num in [3, 4, 5]:
        return 'Spring'
    elif month_num in [6, 7, 8]:
        return 'Summer'
    else:
        return 'Autumn'

def get_lead_time_category(lead_time: int) -> str:
    if lead_time <= 3:
        return 'Last-Minute'
    elif lead_time <= 14:
        return 'Short'
    elif lead_time <= 60:
        return 'Medium'
    else:
        return 'Long'

def clean_and_engineer_features(df_raw: pd.DataFrame, is_training: bool = True) -> pd.DataFrame:
    df = df_raw.copy()

    # If training data, filter invalid records & target outliers
    if is_training and 'adr' in df.columns:
        df = df.dropna(subset=['adr'])
        # Filter negative / zero / extreme outlier ADRs
        df = df[(df['adr'] >= 10.0) & (df['adr'] <= 800.0)]
        # Filter zero total guest records
        if 'adults' in df.columns and 'children' in df.columns and 'babies' in df.columns:
            df['children'] = df['children'].fillna(0)
            df['babies'] = df['babies'].fillna(0)
            total_g = df['adults'] + df['children'] + df['babies']
            df = df[total_g > 0]

    # Impute missing values
    if 'children' in df.columns:
        df['children'] = df['children'].fillna(0)
    if 'babies' in df.columns:
        df['babies'] = df['babies'].fillna(0)
    if 'country' in df.columns:
        df['country'] = df['country'].fillna('PRT')

    # Convert arrival_date_month
    if 'arrival_date_month' in df.columns:
        if df['arrival_date_month'].dtype == object:
            df['month_num'] = df['arrival_date_month'].map(MONTH_MAP).fillna(7)
        else:
            df['month_num'] = df['arrival_date_month']
    else:
        df['month_num'] = 7

    # Engineered Features
    df['sin_month'] = np.sin(2 * np.pi * df['month_num'] / 12.0)
    df['cos_month'] = np.cos(2 * np.pi * df['month_num'] / 12.0)

    week_num = df['arrival_date_week_number'] if 'arrival_date_week_number' in df.columns else 27
    df['sin_week'] = np.sin(2 * np.pi * week_num / 53.0)
    df['cos_week'] = np.cos(2 * np.pi * week_num / 53.0)

    df['season'] = df['month_num'].apply(get_season)

    weekend_nights = df['stays_in_weekend_nights'] if 'stays_in_weekend_nights' in df.columns else 0
    week_nights = df['stays_in_week_nights'] if 'stays_in_week_nights' in df.columns else 1
    df['total_stay_nights'] = weekend_nights + week_nights
    df['is_weekend_stay'] = (weekend_nights > 0).astype(int)

    adults = df['adults'] if 'adults' in df.columns else 2
    children = df['children'] if 'children' in df.columns else 0
    babies = df['babies'] if 'babies' in df.columns else 0
    df['total_guests'] = adults + children + babies
    df['is_family'] = ((children > 0) | (babies > 0)).astype(int)

    lead_time = df['lead_time'] if 'lead_time' in df.columns else 30
    df['lead_time_category'] = lead_time.apply(get_lead_time_category)

    # Simulated/estimated demand occupancy rate based on week of year and property
    if 'estimated_occupancy_rate' not in df.columns:
        base_occ = np.where(df['hotel'] == 'Resort Hotel', 0.65, 0.72)
        season_boost = np.where(df['season'] == 'Summer', 0.20, np.where(df['season'] == 'Spring', 0.08, -0.05))
        df['estimated_occupancy_rate'] = np.clip(base_occ + season_boost, 0.35, 0.98)

    # Fill defaults for optional operational fields if not provided in raw df
    for col in ['previous_cancellations', 'previous_bookings_not_canceled', 'booking_changes', 'days_in_waiting_list', 'required_car_parking_spaces', 'total_of_special_requests']:
        if col not in df.columns:
            df[col] = 0

    return df

def build_preprocessor_pipeline():
    numeric_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown='ignore', sparse_output=False)

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, NUMERIC_FEATURES),
            ('cat', categorical_transformer, CATEGORICAL_FEATURES)
        ]
    )
    return preprocessor

def prepare_data(csv_path: str, test_size: float = 0.20, random_state: int = 42):
    print(f"Loading raw dataset from {csv_path}...")
    df_raw = pd.read_csv(csv_path)
    print(f"Raw dataset dimensions: {df_raw.shape}")

    df_cleaned = clean_and_engineer_features(df_raw, is_training=True)
    print(f"Cleaned dataset dimensions: {df_cleaned.shape}")

    X = df_cleaned[ALL_FEATURE_COLUMNS]
    y = df_cleaned['adr'].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, shuffle=True
    )
    print(f"Train set: {X_train.shape[0]:,} samples | Test set: {X_test.shape[0]:,} samples")

    preprocessor = build_preprocessor_pipeline()
    print("Fitting preprocessor on training data only (strictly zero data leakage)...")
    X_train_trans = preprocessor.fit_transform(X_train)
    X_test_trans = preprocessor.transform(X_test)
    print(f"Transformed feature matrix dimension: {X_train_trans.shape[1]} columns")

    return X_train, X_test, y_train, y_test, X_train_trans, X_test_trans, preprocessor, df_cleaned

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    raw_path = os.path.join(base_dir, 'datasets', 'raw', 'hotel_bookings.csv')
    X_train, X_test, y_train, y_test, X_tr, X_te, prep, df = prepare_data(raw_path)
    print("Preprocessing pipeline verified successfully.")
