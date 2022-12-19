import os
import json
import requests
import pandas as pd
from kucoin.client import Client

api_key = "6390259662176200010ca6c2"
api_secret = "db3752b8-5f44-40fd-9cea-fdaad9ac3539"
api_passphrase = "owJ-x9F8NC79P4UQ76Zmx9Yp@Ug*NP-@"
client = Client(api_key, api_secret,api_passphrase)
url = 'https://api.kucoin.com'

def printit():
    # pull = client.get_ticker()  #contains all the information in dictionary format
    # print(type(pull["ticker"]))
    # firstData = pull["ticker"][0]
    # print(firstData)
    
    #pulling btc/usdt candle data of all 12 hour time frame
    btcUsdt = requests.get(url + '/api/v1/market/candles?type=12hour&symbol=BTC-USDT').json()
    print(type(btcUsdt))
    #print(bitcoin)
    all12hourBtcUsdtCandleData = btcUsdt['data']    #all12hourBtcUsdtCandleData here is a nested list
    dfAll12hourbtcUsdt = pd.DataFrame(all12hourBtcUsdtCandleData)
    dfAll12hourbtcUsdt.columns = ['time', 'open', 'close', 'high', 'low', 'volume', 'turnover']
    print(type(dfAll12hourbtcUsdt)) # dfAll12hourbtcUsdt is a datafram object
    print(dfAll12hourbtcUsdt)

    #how to check whether a candle data is green or red
    #green candle is when closing > opening
    #red candle is when closing < opening
    #In a candle data list there are 7 elements. Opening data is at position 1
    #closing will be position 2
    print(all12hourBtcUsdtCandleData[0])
    message = checkGreenOrRedCandle(all12hourBtcUsdtCandleData[6])
    print(message)

    coins_array = ['ETH-USDT','TON-USDT','XRP-USDT','SOL-USDT','DOGE-USDT','MATIC-USDT','BNB-USDT','ADA-USDT','SHIB-USDT','LINK-USDT']
    
    for coin in coins_array:
        coinCandleDataAll = requests.get(url + '/api/v1/market/candles?type=12hour&symbol={}'.format(coin)).json()
        coinCandleData = coinCandleDataAll['data']
        print(f"This coin is {coin}, opening is {coinCandleData[1][1]}, closing is: {coinCandleData[1][2]}, high is {coinCandleData[1][3]}, low is {coinCandleData[1][4]}")
        #print(coinCandleData[1])




def checkGreenOrRedCandle(takeInData):
    decimalList = []
    text = ""
    for i in takeInData:
        i = float(i)
        decimalList.append(i)
    
    if decimalList[1] > decimalList[2]:
        text = "redCandle"
    elif decimalList[1] < decimalList[2]:
        text = "greenCandle"
    else:
        text = "dojiCandle"


    print("altered List")
    print(decimalList)
    return text
        

printit()