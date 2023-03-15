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
      value: "S$1.00"
    },
    {
      key: "2",
      coin: "ETH",
      value: "S$1,263.00"
    },
  ];

  const [currentAccount, setCurrentAccount] = useState(null)
  const [buttonText, setButtonText] = useState('Connect Wallet')
  const [accountBalance, setAccountBalance] = useState()
  const [provider, setProvidor] = useState()
  

  const connectWallet = async () => {

    //check if wallet is installed
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentAccount(accounts[0])
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
    setAccountBalance(balance) 
}

  return (
    <Container>
      {/* Navbar */}
      <Navbar isCompact variant={"static"}>
        <Navbar.Brand>
          <Text h3 b color="inherit">
            AMM
          </Text>
        </Navbar.Brand>
        <Navbar.Content hideIn="md">
          <Navbar.Link href="/">Trade</Navbar.Link>
          <Navbar.Link href="#">Assets</Navbar.Link>
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
              <FaWallet/>
              &nbsp;{buttonText}
              {currentAccount && <div>
                  <h6>&nbsp;&nbsp;&nbsp;| Address:{currentAccount}</h6>
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
            Balance="2"
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