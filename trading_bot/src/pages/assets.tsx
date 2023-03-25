import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useState, useEffect} from 'react'
import { Container, Navbar, Text, Button, Grid, Col, Modal, Card, Row, Dropdown, Image, Input, Spacer, Switch, useTheme, Table } from '@nextui-org/react';
import InfoCard from '../components/InfoCard';
import { FaWallet } from 'react-icons/fa'
import { useTheme as useNextTheme } from 'next-themes'
import { SunIcon } from './SunIcon';
import { MoonIcon } from './MoonIcon';
import { ethers } from 'ethers'
import { useStore } from "@/store";
import StoreInitializer from "@/components/StoreInitializer";
import axios from 'axios';

const Assets: NextPage = () => {

  /* Navbar */
  const [visible, setVisible] = React.useState(false)
  const handler = () => setVisible(true)
  const closeHandler = () => {
    setVisible(false)
    console.log("closed")
  }

   // themes
   const { setTheme } = useNextTheme();
   const { isDark, type } = useTheme();

   
const getEthPrice = async () => {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
  return response.data.ethereum.usd;
};

const getUSDTPrice = async () => {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd');
  return response.data.tether.usd
}

const [ethPrice, setEthPrice] = useState(null);
const [usdtPrice, setUSDTPrice] = useState(null);

useEffect(() => {
  const fetchPrices = async () => {
    const ETHprice = await getEthPrice();
    const USDTprice = await getUSDTPrice();
    setEthPrice(ETHprice);
    setUSDTPrice(USDTprice);
  };

  const intervalId = setInterval(fetchPrices, 5000); // Fetch prices every 5 seconds

  return () => clearInterval(intervalId); // Clean up interval on unmount
}, []);

  /* Dynamic table headers */
  const columns = [
    {
      key: "coin",
      label: "COIN",
    },
    {
      key: "value",
      label: "VALUE",
    },
  ];
  /* const rows data example */
  const rows = [
    {
      key: "1",
      coin: "USDT",
      value: usdtPrice !== null ? `$${usdtPrice.toFixed(2)}` : "Loading..."
      // value: usdtPrice !== null ? `$${usdtPrice.toFixed(2)}` : "Loading..."
    },
    {
      key: "2",
      coin: "ETH",
      value: ethPrice !== null ? `$${ethPrice.toFixed(2)}` : "Loading..."
    },
  ];

  const [currentAccount, setCurrentAccount] = useState<string>("..");
  const [buttonText, setButtonText] = useState('Connect Wallet')
  const [accountBalance, setAccountBalance] = useState<string>("..");
  // const [provider, setProvidor] = useState()
  const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider();


  const connectWallet = async () => {

    //check if wallet is installed
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const currentAccount = `${accounts[0].substring(0, 6)}...${accounts[0].slice(-6)}`;
        setCurrentAccount(currentAccount)
        setButtonText('Wallet Connected')
        getAccountBalance(accounts[0]);
    }
    else {
        // Show alert if Ethereum provider is not detected
        alert("Please install Metamask wallet");
    }

}

const getAccountBalance = async (account: any) => {
    const balance = await window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] });
    setAccountBalance(ethers.utils.formatEther(balance)) 
}

useStore.setState({ wallet: currentAccount, balance: accountBalance });

  return (
    <Container>
       <StoreInitializer wallet={useStore.getState().wallet} balance={useStore.getState().balance} />
      {/* Navbar */}
      <Navbar isCompact variant={"static"}>
        <Navbar.Brand>
          <Text h3 b color="inherit">
            AMM
          </Text>
        </Navbar.Brand>
        <Navbar.Content hideIn="md">
          <Navbar.Link href="/trade">Trade</Navbar.Link>
          <Navbar.Link href="/assets">Assets</Navbar.Link>
          <Navbar.Link href="#">Statistics</Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Item>
          <React.Fragment>
            <Button 
            auto 
            flat 
            href="#" 
            bordered 
            color="gradient"
            onPress={connectWallet}
            > 
              <FaWallet/> &nbsp; {useStore.getState().balance}
              {currentAccount && <div>
                  <h6>&nbsp;&nbsp;&nbsp;| Address:{useStore.getState().wallet}</h6>
                </div>}
            </Button>     
            </React.Fragment>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>

      {/* Theme switch */}
      <div style={{float: 'right', margin: 'left', marginTop: '2em'}}>
        <Switch
          shadow color="primary"
          checked={isDark}
          iconOff={<SunIcon filled/>}
          iconOn={<MoonIcon filled/>}
          onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
        />
      </div>

      {/* 3 Displaying Product Cards */}
      <Grid.Container gap={2}>
        <Grid xs={12} sm={4}>
          <InfoCard
            label="Total "
            title="Balance"
            imageURL="https://logos-world.net/wp-content/uploads/2020/12/Ethereum-Emblem.png"
            Balance={useStore.getState().balance}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <InfoCard
            label="Total "
            title="Profit"
            imageURL="https://wallpapercave.com/wp/wp4477741.jpg"
            Balance="0.9"
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <InfoCard
            label="Total "
            title="Lose"
            imageURL="https://th.bing.com/th/id/OIP.5egbaGbp9RSj_U4hDFnC0AHaEo?pid=ImgDet&rs=1"
            Balance="0.10"
          />
        </Grid>
      </Grid.Container>
      <Table
        aria-label="Assets Table"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
      > 
        <Table.Header columns={columns}>
        {(column) => (
          <Table.Column key={column.key}>{column.label}</Table.Column>
        )}
      </Table.Header>
      <Table.Body items={rows}>
        {(item) => (
          <Table.Row key={item.key}>
            {(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>}
          </Table.Row>
        )}
      </Table.Body>
      </Table>
    </Container>
  )
}

export default Assets