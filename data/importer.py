import pandas as pd
import sqlite3

# This line looks inside your 'data' folder for the 'training.csv' file
print("Step 1: Reading the Higgs data...")
df = pd.read_csv('data/training.csv')

# Selecting just a few columns to keep our first database simple
cols = ['EventId', 'DER_mass_vis', 'DER_pt_h', 'Label']
df_small = df[cols]

# Creating the SQL Database
print("Step 2: Building your SQL database...")
conn = sqlite3.connect('physics_data.db')
df_small.to_sql('events', conn, if_exists='replace', index=False)

print("Success! You now have a professional SQL database named physics_data.db")
conn.close()