# import pandas as pd
# import numpy as np
# import matplotlib.pyplot as plt

# # Load the data from a CSV file or any other source
# data = pd.read_csv('DataDB.csv')

# # Define the starting value
# start_value = 10000

# # Define the number of periods for the moving average and the standard deviation for the Bollinger Bands
# ma_period = 20
# bb_std = 2

# # Calculate the rolling mean and standard deviation for the moving average and Bollinger Bands
# data['MA'] = data['Close'].rolling(window=ma_period).mean()
# data['BB_upper'] = data['MA'] + bb_std * data['Close'].rolling(window=ma_period).std()
# data['BB_lower'] = data['MA'] - bb_std * data['Close'].rolling(window=ma_period).std()

# # Define the trading signals based on the Bollinger Bands and moving average
# data['long_signal'] = np.where(data['Close'] < data['BB_lower'], 1, 0)
# data['short_signal'] = np.where(data['Close'] > data['BB_upper'], -1, 0)
# data['signal'] = data['long_signal'] + data['short_signal']

# # Define the positions based on the trading signals
# data['position'] = data['signal'].shift(1)

# # Calculate the daily returns based on the positions
# data['daily_returns'] = data['position'] * data['Close'].pct_change()

# # Calculate the cumulative returns based on the daily returns and starting value
# data['cum_returns'] = (1 + data['daily_returns']).cumprod() * start_value

# # Calculate the maximum drawdown based on the cumulative returns
# data['drawdown'] = (data['cum_returns'].cummax() - data['cum_returns']) / data['cum_returns'].cummax()

# # Print the total profit or loss and the final value
# total_return = (data['cum_returns'].iloc[-1] - start_value) / start_value

# if total_return > 0:
#     print(f'Total profit: ${round(data["cum_returns"].iloc[-1] - start_value, 2)}')
# else:
#     print(f'Total loss: ${round(data["cum_returns"].iloc[-1] - start_value, 2)}')
# print(f'Final value: ${round(data["cum_returns"].iloc[-1], 2)}')

# # Plot the cumulative returns and the drawdown
# fig, ax1 = plt.subplots()
# ax1.plot(data.index, data['cum_returns'])
# ax2 = ax1.twinx()
# ax2.plot(data.index, data['drawdown'], 'r')
# plt.show()
import pandas as pd
import numpy as np
import time
from kucoin.client import Trade
from kucoin.client import Market
from kucoin.user import user
from requests import request
from statsmodels.tsa.arima.model import ARIMA
from sklearn.preprocessing import MinMaxScaler
import requests
from keras.models import Sequential
from keras.layers import Dense, LSTM, Dropout
from keras.regularizers import L1L2

# Replace with your sandbox API key, API secret, and API passphrase
# the api values below are of the sandbox
api_key = "642127e1bb57cd00010251c2"
api_secret = "35141d61-e579-43cc-9c4f-e70bad05ab28"
api_passphrase = "Mt22041998!!_"

# # Define the symbol and order parameters
symbol = 'ETH-USDT'

# Load the data from a CSV file or any other source
data = pd.read_csv('DataDB.csv')

# Define the starting value
start_value = 1000

# Define the number of periods for the moving average and the standard deviation for the Bollinger Bands
ma_period = 10
bb_std = 2
order_signal = ""

# Define the take profit and stop loss levels
take_profit = 0.05
stop_loss = 0.03

upcoming_signal = ""
upcoming_price = ""

# Define the forecasting model and parameters
model_type_1 = 'ARIMA'
model_type_2 = 'LSTM'  # 'ARIMA' or 'LSTM'
forecast_period = 30  # number of periods to forecast
history_period = 365  # number of periods to use for training the model

# Define the scaler for preprocessing the data for the LSTM model
scaler = MinMaxScaler(feature_range=(0, 1))

while True:
    # Calculate the rolling mean and standard deviation for the moving average and Bollinger Bands
    data['MA'] = data['Close'].rolling(window=ma_period).mean()
    data['BB_upper'] = data['MA'] + bb_std * data['Close'].rolling(window=ma_period).std()
    data['BB_lower'] = data['MA'] - bb_std * data['Close'].rolling(window=ma_period).std()

    # Define the trading signals based on the Bollinger Bands and moving average
    data['long_signal'] = np.where(data['Close'] < data['BB_lower'], 1, 0)
    data['short_signal'] = np.where(data['Close'] > data['BB_upper'], -1, 0)
    data['signal'] = data['long_signal'] + data['short_signal']

    # Define the positions based on the trading signals
    data['position'] = data['signal'].shift(1)

    # Define the buy and sell signals based on the positions
    data['buy_signal'] = np.where(data['position'] == 1, 1, 0)
    data['sell_signal'] = np.where(data['position'] == -1, -1, 0)

    # Filter rows with upcoming buy or sell signal
    last_signal = data['signal'].iloc[-1]
    if last_signal == 1:
        upcoming_signal = 'buy'
        upcoming_price = data['BB_lower'].iloc[-1]
    elif last_signal == -1:
        upcoming_signal = 'sell'
        upcoming_price = data['BB_upper'].iloc[-1]
    else:
        upcoming_signal = None
        upcoming_price = None

    # Filter rows with buy or sell signal
    buy_data = data[(data['buy_signal'] == 1)]
    sell_data = data[(data['sell_signal'] == -1)]
  
    # Calculate the daily returns based on the positions
    data['daily_returns'] = data['position'] * data['Close'].pct_change()

    # Define the exit signals based on take profit and stop loss levels
    take_profit_signal = (data['Close'].pct_change() > take_profit).astype(int)
    stop_loss_signal = (data['Close'].pct_change() < -stop_loss).astype(int)

    # Apply the buy and sell signals to the position
    data['position'] = np.where(data['buy_signal'] == 1, 1, np.where(data['sell_signal'] == -1, 0, data['position'].shift(1)))
    data['position'] = np.where(take_profit_signal == 1, 0, np.where(stop_loss_signal == 1, 0, data['position']))


    # Define the buy and sell prices based on the signals
    data['buy_price'] = np.where(data['buy_signal'] == 1, data['Close'], np.nan)
    data['sell_price'] = np.where(data['sell_signal'] == -1, data['Close'], np.nan)
  
    # Calculate the daily returns based on the updated positions
    data['daily_returns'] = data['position'] * data['Close'].pct_change()

    # Calculate the cumulative returns based on the daily returns and starting value
    data['cum_returns'] = (1 + data['daily_returns']).cumprod() * start_value

    # Calculate the maximum drawdown based on the cumulative returns
    data['drawdown'] = (data['cum_returns'].cummax() - data['cum_returns']) / data['cum_returns'].cummax()

    exit_signal = take_profit_signal - stop_loss_signal

    # Calculate the exit positions based on the exit signals
    data['exit_position'] = exit_signal.shift(1)

    # Combine the exit positions with the current positions
    data['position'] = data['position'] + data['exit_position']

    # Fill the NaN values with 0
    data['position'].fillna(0, inplace=True)

    # Calculate the daily returns based on the positions
    data['daily_returns'] = data['position'] * data['Close'].pct_change()

    # Calculate the cumulative returns
    data['cumulative_returns'] = (1 + data['daily_returns']).cumprod() * start_value

    # Print the total profit or loss and the final value
    total_return = (data['cum_returns'].iloc[-1] - start_value) / start_value

    if total_return > 0:
        print(f'Total profit: ${round(data["cum_returns"].iloc[-1] - start_value, 2)}')
        
    else:
        print(f'Total loss: ${round(data["cum_returns"].iloc[-1] - start_value, 2)}')
    print(f'Final value: ${round(data["cum_returns"].iloc[-1], 2)}')

    # Get the current market price
    # Define the API endpoint for getting the latest ticker data for ETH/USDT
    url = 'https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=ETH-USDT'
    # Make the API request and get the response
    response = requests.get(url).json()
    # Extract the latest trading price from the response
    latest_price = response['data']['price']
    print('ETH PRICE: (LATEST)', latest_price)
    current_price = float(latest_price)

    # Define the historical data for training the forecasting model
    history_data = data['Close'][-history_period:].values

    if model_type_2 == 'LSTM':
            # Preprocess the data for the LSTM model
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(history_data.reshape(-1, 1))
        x_train = []
        y_train = []
        for i in range(history_period - forecast_period - 1):
            x_train.append(scaled_data[i:i + forecast_period, 0])
            y_train.append(scaled_data[i + forecast_period, 0])
        x_train = np.array(x_train)
        y_train = np.array(y_train)
        x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

        # Define the LSTM model
        model = Sequential()
        model.add(LSTM(50, return_sequences=True, input_shape=(x_train.shape[1], 1)))
        model.add(Dropout(0.2))
        model.add(LSTM(50, return_sequences=False))
        model.add(Dropout(0.2))
        model.add(Dense(25, kernel_regularizer=L1L2(l1=0.01, l2=0.01)))
        model.add(Dense(1))
        model.compile(optimizer='adam', loss='mean_squared_error')

        # Train the forecasting model
        model.fit(x_train, y_train, batch_size=32, epochs=100, validation_split=0.2)

        # Preprocess the test data for prediction
        inputs = data['Close'][-forecast_period - history_period:].values
        inputs = inputs.reshape(-1, 1)
        inputs = scaler.transform(inputs)
        X_test = []
        for i in range(forecast_period, inputs.shape[0]):
            X_test.append(inputs[i - forecast_period:i, 0])
        X_test = np.array(X_test)
        X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

        # Make predictions using the trained model
        forecast_LSTM = model.predict(X_test)
        forecast_LSTM = scaler.inverse_transform(forecast_LSTM)

        # Evaluate the forecast accuracy
        actual_values = data['Close'][-forecast_period:].values
        mse = np.mean((forecast_LSTM - actual_values)**2)
        mae = np.mean(np.abs(forecast_LSTM - actual_values))
        rmse = np.sqrt(mse)
        print("LSTM forecast accuracy - MSE: {:.2f}, MAE: {:.2f}, RMSE: {:.2f}".format(mse, mae, rmse))
    
    if model_type_1 == 'ARIMA': 
        model = ARIMA(history_data, order=(1, 1, 1))
        model_fit = model.fit()
        forecast_ARIMA = model_fit.forecast(forecast_period)
        print("ARIMA", forecast_ARIMA)  
        

    # Get the current date and time
    now = time.strftime('%Y-%m-%d %H:%M:%S')

    if len(forecast_LSTM) > 0 or len(forecast_ARIMA) > 0:
        # # Choose the most recent forecast between LSTM and ARIMA
        # if len(forecast_LSTM) > len(forecast_ARIMA):
        #     forecast = forecast_LSTM
        # else:
        #     forecast = forecast_ARIMA
        forecast = (forecast_LSTM[-1] + forecast_ARIMA[-1]) / 2
        print("Average forecast", forecast)

        # Check if the current price is above or below the forecasted price
        if upcoming_signal is not None:
            if current_price > forecast[-1] and upcoming_signal == 'sell':
                order_signal = "SELL"
                print("Signal:", order_signal)
            elif current_price < forecast[-1] and upcoming_signal == 'buy':
                order_signal = "BUY"
                print("Signal:", order_signal)
        else:
            print("No upcoming signal")
            if current_price > forecast[-1]:
                order_signal = "SELL"
                print("Signal:", order_signal)
            elif current_price < forecast[-1]:
                order_signal = "BUY"
                print("Signal:", order_signal)
            
        print(f"Forecasted ARIMA price: {forecast_ARIMA[-1]}")
        print(f"Forecasted LSTM price: {forecast_LSTM[-1]}")
        print(f"Average forecast price: {forecast[-1]}")
        print(f"Upcoming signal: {upcoming_signal} at {upcoming_price}")
    else:
        print("Error: No forecast data available.")
    # Print the current date and time, current price, and forecasted price
    print(f"Current date and time: {now}")
    print(f"Current price: {current_price}")
    # print(f"Forecasted price: {forecast[0][0]}")

    # Define the order size based on the account balance
    # client = Trade(api_key, api_secret, api_passphrase)
    # client = Trade(api_key, api_secret, api_passphrase)
    # balance = requests.get(url + '/api/v1/accounts').json()
    # account_balance = (balance.get('USDT'))
    # order_size=""

    person = user.UserData(key = api_key, secret = api_secret, passphrase = api_passphrase)
    all_accounts = person.get_account_list()
    all_accounts = pd.DataFrame.from_dict(all_accounts)
    
    print("account", all_accounts)
        # Get the account details for the first account in the list
    account_id = all_accounts.at[0, 'id']
    account = person.get_account(account_id)
    print("Account details:")
    balance = float(account['available'])

    
    print(f"USDT balance: {balance}")
    if balance is not None:
        order_size = balance / data['Close'].iloc[-1]
        print(f"Order size: {order_size}")
    else:
        print("Failed to retrieve account balance.")


    # # Place the order
    # if order_signal == 'BUY':
    #     response=client.create_market_order('BUY', symbol, size=order_size)
    #     while True:
    #         try:
    #             check = client.get_order_details(orderId=response['orderId'])
    #             print(check)
    #         except Exception as e:
    #             print(f'Error while checking order status: {e}')
                
    #         if check['isActive'] == True:
    #             print ('Order placed at {}'.format(pd.Timestamp.now()))
    #             break
                
    #         else:
    #             print('Order was canceled {}'.format(pd.Timestamp.now()))
    #             break
    # elif order_signal == 'SELL':
    #     response=client.create_market_order('SELL', symbol, size=order_size)
    #     while True:
    #         try:
    #             check = client.get_order_details(orderId=response['orderId'])
    #             print(check)
    #         except Exception as e:
    #             print(f'Error while checking order status: {e}')
                
    #         if check['isActive'] == True:
    #             print ('Order placed at {}'.format(pd.Timestamp.now()))
    #             break
                
    #         else:
    #             print('Order was canceled {}'.format(pd.Timestamp.now()))
    #             break

    time.sleep(60)




# def Execute_Trade(signal):

#         # Replace with your sandbox API key, API secret, and API passphrase
#         # the api values below are of the sandbox
#     api_key = "63a4ae7e7a500e00015ac3d7"
#     api_secret = "c8b22127-b95b-409b-ae11-11e430383a70"
#     api_passphrase = "r_qQKWNcAToe7mUc"

#     # Initialize the KuCoin market and trade clients with sandbox URL
#     # m_client = Market(url='https://api-sandbox.kucoin.com')
#     client = Trade(api_key, api_secret, api_passphrase)

#     # # Define the symbol and order parameters
#     symbol = 'ETH-USDT'
#     # side = signal
#     # price = 55000
#     # size = 0.001

#     # # Create a limit order
#     # order = {
#     #     'side': side,
#     #     'symbol': symbol,
#     #     'price': price,
#     #     'size': size,
#     #     'type': 'limit'
#     # }
#     m_client = Market(url='https://api.kucoin.com')


#         # Get the latest market price for the trading pair
#     market_price =  m_client.get_ticker('ETH-USDT')

#     # Set the size of the order in USDT (or the quote currency of the trading pair)
#     order_size = 5

#     # Calculate the quantity of the order based on the market price and the order size
#     quantity = order_size / float(market_price['price'])

#     # Place the market order
#     response=client.create_market_order(symbol=symbol, side=signal, size=order_size)

#     # # Place the order
#     # response = client.create_order(order)

#     # Print the order response
#     print(response)
#     while True:
#         try:
#             check = client.get_order_details(orderId=response['orderId'])
#             print(check)
#         except Exception as e:
#             print(f'Error while checking order status: {e}')
            
#         if check['isActive'] == True:
#             print ('Order placed at {}'.format(pd.Timestamp.now()))
#             break
            
#         else:
#             print('Order was canceled {}'.format(pd.Timestamp.now()))
#             break