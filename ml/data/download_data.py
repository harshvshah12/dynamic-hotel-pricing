import os
import urllib.request
import pandas as pd

DATASET_URL = "https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2020/2020-02-11/hotels.csv"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TARGET_PATH = os.path.join(BASE_DIR, "datasets", "raw", "hotel_bookings.csv")

def download_dataset():
    os.makedirs(os.path.dirname(TARGET_PATH), exist_ok=True)
    if os.path.exists(TARGET_PATH) and os.path.getsize(TARGET_PATH) > 1000000:
        print(f"Dataset already exists at {TARGET_PATH} ({os.path.getsize(TARGET_PATH):,} bytes).")
    else:
        print(f"Downloading canonical dataset from {DATASET_URL}...")
        req = urllib.request.Request(DATASET_URL, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as resp, open(TARGET_PATH, "wb") as out_f:
            out_f.write(resp.read())
        print(f"Downloaded successfully to {TARGET_PATH}")

    df = pd.read_csv(TARGET_PATH)
    print(f"Dataset Shape: {df.shape[0]:,} rows x {df.shape[1]} columns")
    print(f"Columns: {list(df.columns)}")
    print(f"ADR stats: min={df['adr'].min()}, max={df['adr'].max()}, mean={df['adr'].mean():.2f}")
    return df

if __name__ == "__main__":
    download_dataset()
