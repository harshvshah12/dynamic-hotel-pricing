"""
Unit Tests for Data Preprocessing and Feature Engineering
"""
import pytest
import numpy as np
import pandas as pd
from ml.preprocessing.preprocessor import (
    clean_and_engineer_features,
    get_season,
    get_lead_time_category,
    ALL_FEATURE_COLUMNS,
    NUMERIC_FEATURES,
    CATEGORICAL_FEATURES
)

def test_get_season():
    assert get_season(1) == 'Winter'
    assert get_season(7) == 'Summer'
    assert get_season(4) == 'Spring'
    assert get_season(10) == 'Autumn'

def test_get_lead_time_category():
    assert get_lead_time_category(1) == 'Last-Minute'
    assert get_lead_time_category(10) == 'Short'
    assert get_lead_time_category(45) == 'Medium'
    assert get_lead_time_category(120) == 'Long'

def test_clean_and_engineer_features():
    raw_sample = pd.DataFrame([{
        'hotel': 'City Hotel',
        'is_canceled': 0,
        'lead_time': 25,
        'arrival_date_year': 2017,
        'arrival_date_month': 'August',
        'arrival_date_week_number': 32,
        'arrival_date_day_of_month': 10,
        'stays_in_weekend_nights': 2,
        'stays_in_week_nights': 3,
        'adults': 2,
        'children': 1,
        'babies': 0,
        'meal': 'BB',
        'country': 'PRT',
        'market_segment': 'Online TA',
        'distribution_channel': 'TA/TO',
        'is_repeated_guest': 0,
        'previous_cancellations': 0,
        'previous_bookings_not_canceled': 0,
        'reserved_room_type': 'D',
        'assigned_room_type': 'D',
        'booking_changes': 0,
        'deposit_type': 'No Deposit',
        'days_in_waiting_list': 0,
        'customer_type': 'Transient',
        'adr': 125.50,
        'required_car_parking_spaces': 1,
        'total_of_special_requests': 2
    }])

    df_cleaned = clean_and_engineer_features(raw_sample, is_training=True)

    # Validate engineered columns
    assert 'sin_month' in df_cleaned.columns
    assert 'cos_month' in df_cleaned.columns
    assert 'sin_week' in df_cleaned.columns
    assert 'cos_week' in df_cleaned.columns
    assert 'total_stay_nights' in df_cleaned.columns
    assert 'total_guests' in df_cleaned.columns
    assert 'is_weekend_stay' in df_cleaned.columns
    assert 'season' in df_cleaned.columns
    assert 'lead_time_category' in df_cleaned.columns

    assert df_cleaned['total_guests'].iloc[0] == 3
    assert df_cleaned['total_stay_nights'].iloc[0] == 5
    assert df_cleaned['is_weekend_stay'].iloc[0] == 1
    assert df_cleaned['season'].iloc[0] == 'Summer'
    assert df_cleaned['lead_time_category'].iloc[0] == 'Medium'
