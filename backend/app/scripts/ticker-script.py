import os
import pandas as pd
from typing import List
from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine, select
from app.database.models import SupportedTicker

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("Please set DATABASE_URL in your .env file")

engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    """Initializes the database and creates tables if they don't exist."""
    print("Initializing database and creating tables...")
    SQLModel.metadata.create_all(engine)
    print("Done.")

def get_russell_1000_holdings() -> List[dict]:
    """
    Reads the list of holdings from a local CSV file.
    Assumes the first row is a header and the first two columns are 'Symbol' and 'Name'.
    """
    print("Reading holdings from local CSV file...")
    try:
        file_name = "stocks.csv"
        
        # Use pandas to read the CSV. It automatically detects the header row.
        df = pd.read_csv(file_name)
        df = df.iloc[:-1]

        # Check if the required columns exist
        if "Symbol" in df.columns and "Name" in df.columns:
            # Select only the columns we need
            holdings_df = df[['Symbol', 'Name']]
            
            # Rename columns to match our database model
            holdings_df = holdings_df.rename(columns={'Symbol': 'ticker', 'Name': 'name'})
            
            # Convert the DataFrame to a list of dictionaries
            holdings = holdings_df.to_dict(orient='records')
            
            print(f"Successfully read {len(holdings)} tickers from CSV.")
            return holdings
        else:
            print("Error: Could not find 'Symbol' and 'Name' columns in the CSV file.")
            return []

    except FileNotFoundError:
        print(f"Error: '{file_name}' not found. Please place it in the same directory.")
        return []
    except Exception as e:
        print(f"An error occurred while reading the CSV file: {e}")
        return []

def run_population():
    """
    Gets data and populates the database table.
    """
    holdings = get_russell_1000_holdings()
    if not holdings:
        print("No holdings found to populate. Aborting.")
        return

    index_to_update = "Russell 1000"
    new_tickers_to_add = [
        SupportedTicker(
            ticker=h['ticker'],
            name=h['name'],
            index_name=index_to_update
        )
        for h in holdings
    ]

    with Session(engine) as session:
        # Clear out old data for this index to avoid duplicates
        print(f"Clearing old tickers for index: {index_to_update}...")
        statement = select(SupportedTicker).where(SupportedTicker.index_name == index_to_update)
        results = session.exec(statement).all()
        for old_ticker in results:
            session.delete(old_ticker)
        session.commit()
        print("Old tickers cleared.")

        # Add the new data
        print(f"Adding {len(new_tickers_to_add)} new tickers to the database...")
        session.add_all(new_tickers_to_add)
        session.commit()
        print("Database population complete!")

if __name__ == "__main__":
    create_db_and_tables()
    run_population()