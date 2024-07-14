import pandas as pd
import random

# Step 1: Read CSV file into pandas DataFrame
df = pd.read_csv('banknifty.csv')

# Step 2: Data cleaning (remove extra columns, rename columns)
df = df.drop(columns=['index', 'open', 'close', 'low'])
df = df.rename(columns={'high': 'price'})

# Convert 'time' column to string if it's not already
df['time'] = df['time'].astype(str)

# Filter rows where 'time' ends with '0' or '5' (multiples of 5 minutes)
df = df[df['time'].str[-1:].isin(['0', '5'])]

# Convert 'date' column to datetime format
df['date'] = pd.to_datetime(df['date'], format='%Y%m%d')

# Adjust date by increasing year by 8, decreasing month by 2, and decreasing day by 17
df['date'] = df['date'] + pd.DateOffset(years=8, months=-2, days=-17)

# Convert 'date' column back to string format '%Y-%m-%d'
df['date'] = df['date'].dt.strftime('%Y-%m-%d')

# Convert 'price' column to float and add 46000 + random float between 0.00 and 0.99
df['price'] = df['price'].astype(float) + 46000 + df['time'].apply(lambda x: random.uniform(0.00, 0.99))

# Round 'price' column to 2 decimal places
df['price'] = df['price'].round(2)

# Get the last 7 days' data
latest_week_dates = df['date'].unique()[-7:]
latest_week_data = df[df['date'].isin(latest_week_dates)]

# Reverse the prices in the latest week
reversed_prices = latest_week_data['price'].values[::-1]

# Update the prices in the DataFrame
df.loc[latest_week_data.index, 'price'] = reversed_prices

# Step 3: Convert DataFrame to JSON
json_data = df.to_json(orient='records')

# Step 4: Save JSON to a file (optional)
with open('stock_data.json', 'w') as f:
    f.write(json_data)

print('Conversion completed. JSON file saved.')
