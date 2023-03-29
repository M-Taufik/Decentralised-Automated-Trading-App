# import datetime
# import requests
# import json
# import pandas as pd
# import time

# # KuCoin API URL
# url = 'https://api.kucoin.com'

# # Define the trading pair and timeframe
# symbol = 'ETH-USDT'
# timeframe = '5min'

# # Continuously pull data from the API
# while True:
#     # Get the current timestamp and the timestamp from one week ago
#     end_timestamp = int(time.time())
#     start_timestamp = end_timestamp - 7*24*60*60
    
#     # Build the API URL with the current timestamps
#     api_url = f'{url}/api/v1/market/candles?type={timeframe}&symbol={symbol}&startAt={start_timestamp}&endAt={end_timestamp}'
    
#     # Make the API request and parse the response
#     response = requests.get(api_url)
#     data = response.json()
    
#     # Convert the response data to a Pandas DataFrame
#     coinDataDF = pd.DataFrame(data['data'])
#     coinDataDF = coinDataDF.rename({0:"Time", 1:"Open", 2:"Close", 3:"High", 4:"Low", 5:"Amount", 6: "Volume"}, axis = 'columns')
    
#     # Convert the timestamp column to datetime objects
#     coinDataDF['Time'] = pd.to_datetime(coinDataDF['Time'], unit='s')
    
#     coinDataDF.set_index('Time', inplace=True)
    
#     # Print the DataFrame or do other processing with the data
#     print(coinDataDF)
    
#     # Delay the next API request by a few seconds
#     time.sleep(10)



# import datetime
# import requests
# import json
# import pandas as pd
# import time

# # KuCoin API URL
# url = 'https://api.kucoin.com'

# # Define the trading pair and timeframe
# symbol = 'ETH-USDT'
# timeframe = '5min'

# # Set the duration to retrieve data (in seconds)
# duration = 30 * 24 * 60 * 60 # 1 month

# # Set the number of data points to retrieve in each request
# limit = 1500

# # Calculate the number of requests needed to retrieve the desired duration
# num_requests = int(duration / (limit * 300)) + 1

# # Initialize an empty DataFrame to store the data
# coinDataDF = pd.DataFrame()
# start_time = time.time()

# while True:
#     # Continuously pull data from the API
#     for i in range(num_requests):
#         # Calculate the start and end timestamps for the current request
#         end_timestamp = int(time.time()) - i * limit * 300
#         start_timestamp = end_timestamp - limit * 300
        
#         # Build the API URL with the current timestamps
#         api_url = f'{url}/api/v1/market/candles?type={timeframe}&symbol={symbol}&startAt={start_timestamp}&endAt={end_timestamp}'
        
#         # Make the API request and parse the response
#         response = requests.get(api_url)
#         data = response.json()
        
#         # Convert the response data to a Pandas DataFrame
#         df = pd.DataFrame(data['data'])
#         df = df.rename({0:"Time", 1:"Open", 2:"Close", 3:"High", 4:"Low", 5:"Amount", 6: "Volume"}, axis = 'columns')
        
#         # Convert the timestamp column to datetime objects
#         df['Time'] = pd.to_datetime(df['Time'], unit='s')
        
#         df.set_index('Time', inplace=True)
        
#         # Concatenate the current DataFrame with the previous ones
#         coinDataDF = pd.concat([df, coinDataDF])
        
#         # Delay the next API request by a few seconds
#         time.sleep(10)
#     end_time = time.time()
#     elapsed_time = end_time - start_time
#     print(f"Elapsed time: {elapsed_time} seconds")    
#     # Sort the DataFrame by ascending timestamp
#     coinDataDF.sort_index(inplace=True)
#     # Print the DataFrame or do other processing with the data
#     print(coinDataDF)
    
#     # Delay the next API request by a few seconds
#     time.sleep(10)


# import datetime
# import requests
# import json
# import pandas as pd
# import time

# # KuCoin API URL
# url = 'https://api.kucoin.com'

# # Define the trading pair and timeframe
# symbol = 'ETH-USDT'
# timeframe = '5min'

# # Set the duration to retrieve data (in seconds)
# duration = 30 * 24 * 60 * 60 # 1 month

# # Set the number of data points to retrieve in each request
# limit = 1500

# # Calculate the number of requests needed to retrieve the desired duration
# num_requests = int(duration / (limit * 300)) + 1

# # Initialize an empty DataFrame to store the data
# coinDataDF = pd.DataFrame()
# start_time = time.time()

# while True:
#     # Continuously pull data from the API
#     for i in range(num_requests):
#         # Calculate the start and end timestamps for the current request
#         end_timestamp = int(time.time()) - i * limit * 300
#         start_timestamp = end_timestamp - limit * 300
        
#         # Build the API URL with the current timestamps
#         api_url = f'{url}/api/v1/market/candles?type={timeframe}&symbol={symbol}&startAt={start_timestamp}&endAt={end_timestamp}'
        
#         # Make the API request and parse the response
#         response = requests.get(api_url)
#         data = response.json()
        
#         # Convert the response data to a Pandas DataFrame
#         df = pd.DataFrame(data['data'])
#         df = df.rename({0:"Time", 1:"Open", 2:"Close", 3:"High", 4:"Low", 5:"Amount", 6: "Volume"}, axis = 'columns')
        
#         # Convert the timestamp column to datetime objects
#         df['Time'] = pd.to_datetime(df['Time'], unit='s')
        
#         df.set_index('Time', inplace=True)
        
#         # Check for duplicates before appending new rows to the DataFrame
#         duplicates = df.index.isin(coinDataDF.index)
#         df = df[~duplicates]
        
#         # Append the current DataFrame to the previous one
#         coinDataDF = pd.concat([df, coinDataDF])
        
#         # Delay the next API request by a few seconds
#         time.sleep(10)
#     end_time = time.time()
#     elapsed_time = end_time - start_time
#     print(f"Elapsed time: {elapsed_time} seconds")    
#     # Sort the DataFrame by ascending timestamp
#     coinDataDF.sort_index(inplace=True)
#     # Print the DataFrame or do other processing with the data
#     print(coinDataDF)
    
#     # Delay the next API request by a few seconds
#     time.sleep(10)
import requests
import json
import pandas as pd
import time

# KuCoin API URL
url = 'https://api.kucoin.com'

# Define the trading pair and timeframe
symbol = 'ETH-USDT'
timeframe = '5min'

# Set the duration to retrieve data (in seconds)
duration = 30 * 24 * 60 * 60 # 1 month

# Set the number of data points to retrieve in each request
limit = 1500

# Calculate the number of requests needed to retrieve the desired duration
num_requests = int(duration / (limit * 300)) + 1

# Initialize an empty DataFrame to store the data
coinDataDF = pd.DataFrame()
start_time = time.time()

while True:
    # Continuously pull data from the API
    for i in range(num_requests):
        # Calculate the start and end timestamps for the current request
        end_timestamp = int(time.time()) - i * limit * 300
        start_timestamp = end_timestamp - limit * 300
        
        # Build the API URL with the current timestamps
        api_url = f'{url}/api/v1/market/candles?type={timeframe}&symbol={symbol}&startAt={start_timestamp}&endAt={end_timestamp}'
        
        # Make the API request and parse the response
        response = requests.get(api_url)
        data = response.json()
        
        # Check if 'data' key exists in the response
        if 'data' not in data:
            continue
        
        # Convert the response data to a Pandas DataFrame
        df = pd.DataFrame(data['data'])
        df = df.rename({0:"Time", 1:"Open", 2:"Close", 3:"High", 4:"Low", 5:"Amount", 6: "Volume"}, axis = 'columns')
        
        # Convert the timestamp column to datetime objects
        df['Time'] = pd.to_datetime(df['Time'], unit='s')
        
        df.set_index('Time', inplace=True)
        
        # Check for duplicates before appending new rows to the DataFrame
        duplicates = df.index.isin(coinDataDF.index)
        df = df[~duplicates]
        
        # Append the current DataFrame to the previous one
        coinDataDF = pd.concat([df, coinDataDF])
        
        # Delay the next API request by a few seconds
        time.sleep(10)
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"Elapsed time: {elapsed_time} seconds")    
    # Sort the DataFrame by ascending timestamp
    coinDataDF.sort_index(inplace=True)
    # Print the DataFrame or do other processing with the data
    print(coinDataDF)
    
    # Save the DataFrame to a CSV file named "DataDB.csv"
    coinDataDF.to_csv('DataDB.csv')
    
    # Delay the next API request by a few seconds
    time.sleep(10)
