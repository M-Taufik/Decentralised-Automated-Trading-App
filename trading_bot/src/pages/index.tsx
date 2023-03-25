import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useState, useEffect} from 'react'
import { Container, Navbar, Text, Button, Grid, Col, Modal, Card, Row, Dropdown, Image, Input,Switch, Spacer,useTheme, Table } from '@nextui-org/react';
import InfoCard from '../components/InfoCard';
import { FaWallet } from 'react-icons/fa'
import { useTheme as useNextTheme } from 'next-themes'
import { SunIcon } from './SunIcon';
import { MoonIcon } from './MoonIcon';
import { ethers } from 'ethers'
import { ALL } from 'dns';

import { useStore } from "@/store";
import StoreInitializer from "@/components/StoreInitializer";
import Link from 'next/link';
const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider();

const Home: NextPage = () => {
/* Navbar */
const [visible, setVisible] = React.useState(false)
const handler = () => setVisible(true)
const closeHandler = () => {
  setVisible(false)
  console.log("closed")
}

  /* Trade container */
  const [selectedFrom, setSelectedFrom] = React.useState(new Set(["ETH"]))
  const selectedFromValue = React.useMemo(
    () => Array.from(selectedFrom).join(", ").replaceAll("_", " "),
    [selectedFrom]
  )
  const [selectedTo, setSelectedTo] = React.useState(new Set(["USDT"]))
  const selectedToValue = React.useMemo(
    () => Array.from(selectedTo).join(", ").replaceAll("_", " "),
    [selectedTo]
  )

 // themes
 const { setTheme } = useNextTheme();
 const { isDark, type } = useTheme();

 const [currentAccount, setCurrentAccount] = useState()
 const [buttonText, setButtonText] = useState('Connect Wallet')
 const [buttonTextTrade, setButtonTextTrade] = useState('You have not connected')
//  const [accountBalance, setAccountBalance] = useState()
 const [provider, setProvidor] = useState()
 const [accountBalance, setAccountBalance] = useState<string>("0");

 const connectWallet = async () => {

  //check if wallet is installed
  if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0])
      setButtonText('Wallet Connected')
      setButtonTextTrade('Wallet Connected, You can start trading')
      setAccountBalance(accounts[0]);
      
  }
  else {
      // Show alert if Ethereum provider is not detected
      alert("Please install Metamask wallet");
  }

}

const getAccountBalance = async (account) => {
  const balance = await window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] });
  setAccountBalance(ethers.utils.formatEther(balance))
}


useStore.setState({ wallet: currentAccount, balance: accountBalance });
const [active, setActive] = useState(false)
return (
  <Container>

   
    <StoreInitializer wallet={useStore.getState().wallet} balance={useStore.getState().balance} />
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

    

    {/* Jumbotron */}

    <Grid.Container justify="center">
      <Grid xs={12} sm={6} alignItems="center" css={{marginRight: "200px"}}>
        <Col css={{"width": "100%"}}>
        <Card css={{justifyContent: "center", height:"500px", width: "120%", padding: "10px"}}>
        <Card.Header style={{"justifyContent":"center"}}>
        <Text weight={"bold"} size={40} b>Connect to Start Trading with AMM</Text>
        </Card.Header>
        <Card.Divider />
        <Card.Body css={{ py: "$10" }}>
        
        <Button 
            auto 
            flat 
            href="/trade" 
            bordered 
            size="lg" 
            color="gradient"
            onPress={connectWallet}
            onClick={() => setActive(!active)}
            > 
              <FaWallet/>
              &nbsp;{buttonText}
              {currentAccount && <div>
                  <h6>&nbsp;&nbsp;&nbsp;| Address:{currentAccount}</h6>
                </div>}
            </Button>
    
        </Card.Body>
        <Card.Divider />
        <Card.Footer>
          <Row justify="center">
          <Button
           disabled={!active}
            auto 
            flat 
            bordered 
            size="lg" 
            color="gradient"
            > <Link href="/trade">&nbsp;{buttonTextTrade}</Link>
              
            </Button>
          </Row>
        </Card.Footer>
      </Card> 
      </Col>
      </Grid>
    </Grid.Container>
  </Container>
)
}



export default Home