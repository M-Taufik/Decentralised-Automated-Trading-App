import os
import json
import requests
import pandas as pd
import time
import hmac
import hashlib
import base64
import websocket
from kucoin.client import Client

api_key = "63a4ae7e7a500e00015ac3d7" # 6390259662176200010ca6c2 - old
api_secret = "c8b22127-b95b-409b-ae11-11e430383a70" # db3752b8-5f44-40fd-9cea-fdaad9ac3539 - old
api_passphrase = "r_qQKWNcAToe7mUc" # owJ-x9F8NC79P4UQ76Zmx9Yp@Ug*NP-@ - old
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

    time_now = int(time.time() * 1000)
    str_to_sign = str(time_now) + 'POST' + '/api/v1/bullet-private'
    signature = base64.b64encode(hmac.new(api_secret.encode('utf-8'), str_to_sign.encode('utf-8'), hashlib.sha256).digest())
    passphrase = base64.b64encode(hmac.new(api_secret.encode('utf-8'), api_passphrase.encode('utf-8'), hashlib.sha256).digest())

    headers = {
        'KC-API-KEY': api_key,
        'KC-API-SIGN': signature,
        'KC-API-TIMESTAMP': str(time_now),
        'KC-API-PASSPHRASE': passphrase,
        'KC-API-KEY-VERSION': '2',
    }

    connection = requests.post(f"{url}/api/v1/bullet-private", headers=headers)
    print("connection:", connection)
    print(connection.json())
    print(connection.status_code)

    print("token: ", connection.json()['data']['token'])
    token = connection.json()['data']['token']
    print("endpoint: ", connection.json()['data']['instanceServers'][0]['endpoint'])
    endpoint = connection.json()['data']['instanceServers'][0]['endpoint']

    params = {
        "event": "unsubscribe", #subscribe/unsubscribe
        "channel": "book",
        "pair": "BTCUSD",
        "prec": "P0"
        }

    def on_open(ws):
        print('Opened Connection')
        ws.send(json.dumps(params))

    def on_close(ws):
        print('Closed Connection')

    def on_message(ws, message):
        print (message)

    def on_error(ws, err):
        print("Got a an error: ", err)

    
   # websockets --> connect
   # websocket --> WebSocketApp
    ws = websocket.WebSocketApp(f'{endpoint}?token={token}&[connectId={time_now}]',
                                    on_open = on_open, 
                                    on_close = on_close, 
                                    on_message = on_message,
                                    on_error=on_error)
    ws.run_forever(ping_interval=1000, ping_timeout=10)



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