import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useState, useEffect} from 'react'
import { Loading,Container, Navbar, Text, Button, Grid, Col, Modal, Card, Row, Dropdown, Image, Input, Spacer, Switch, useTheme } from '@nextui-org/react';
import InfoCard from '../components/InfoCard';
import { FaWallet } from 'react-icons/fa'
import { useTheme as useNextTheme } from 'next-themes'
import { SunIcon } from './SunIcon';
import { MoonIcon } from './MoonIcon';
import { ethers } from 'ethers'
import { ALL } from 'dns';
import { useStore } from "@/store";
import StoreInitializer from "@/components/StoreInitializer";
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Trade: NextPage = () => {

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


  const [currentAccount, setCurrentAccount] = useState<string>("..");
  const [buttonText, setButtonText] = useState('Wallet Connected')
  // const [accountBalance, setAccountBalance] = useState()
  // const [provider, setProvidor] = useState()
  const [TradeBTN, setTradeBTN] = useState('Execute Trade')
  const [accountBalance, setAccountBalance] = useState<string>("..");
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

// useEffect(() => {
//   const fetchBalance = async () => {
//     const address = '0x123...'; // Replace with the address you want to get the balance of
//     const balance = await provider.getBalance(address); // Or use provider.getBalance(address, tokenAddress) for ERC-20 tokens
//     setBalance(ethers.utils.formatEther(balance));
//   };

//   const intervalId = setInterval(fetchBalance, 5000); // Fetch balance every 5 seconds

//   return () => clearInterval(intervalId); // Clean up interval on unmount
// }, []);


const getAccountBalance = async (account: any) => {
    const balance = await window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] });
    setAccountBalance(ethers.utils.formatEther(balance)) 
}

useStore.setState({ wallet: currentAccount, balance: accountBalance });

const [inputValue, setInputValue] = useState('');
const inputTrade = { "firstpair": Array.from(selectedFrom)[0], "secondpair":Array.from(selectedTo)[0], "input": inputValue }

console.log(inputTrade)


const [outputFront, setOutputFront] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const router = useRouter();
const [loading, setLoading] = useState(false)


const handleSubmit = async (event) => {
  event.preventDefault();

  //if use fetch
  // try {
    
  //   // Call the server-side function with the input value
  //   const response = await fetch('/api/script', {
  //     method: 'POST',
  //     body: JSON.stringify({ inputTrade }),
  //   })

  //   const data = await response.json()

  //   // Do something with the response
  //   console.log(data)
    
  // } catch (error) {
  //   console.error(error);
  // }
  // setIsLoading(true);
  setLoading(true)
  try {
    const response = await axios.post('http://localhost:3001/run-python-script', {
      inputTrade: inputTrade
    });
    const outputFront = response.data.output;
    console.log("frontend" + outputFront);
    // setIsLoading(false); // set loading to false if an error occurs
    setLoading(false)
    setOutputFront(outputFront);
    toast.success(outputFront +" " + ' waiting for algorithm to excute buy signal', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 6000
    });
   
  } catch (error) {
    console.error(error);
    // 
    setLoading(false)
    toast.error('Error occurred!', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 6000
    });
    
  }
};

const handleChange = (event) => {
  setInputValue(event.target.value)
}


  return (
    <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height: '100vh' }}>
      {loading  ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <Loading color="primary" />
        <span style={{ marginLeft: '10px'}} color="primary">Loading</span>
      </div>
      ) : (
    <Container >
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
            onClick={connectWallet}
            > 
              <FaWallet/> &nbsp; {useStore.getState().balance}
              &nbsp;
              {currentAccount && <div>
                  <h6>&nbsp;&nbsp;&nbsp;| Address:{useStore.getState().wallet}</h6>
                </div>}
            </Button> 
            {/* modal on wallet button */}
      {/*      <Modal 
            width='1000px'
            closeButton
            preventClose
            aria-labelledby='modal-title'
            open={visible}
            onClose={closeHandler}
            >
              <Modal.Header>
                <Text id="modal-title" size={18}>
                  Connect a Wallet
                </Text>
              </Modal.Header>
              <Modal.Body>
              <Container gap={0}>
                <Row gap={1}>
                  <Col>
                    <Card css={{ $$cardColor: 'white' }}>
                      <Card.Body>
                        <Text h6 size={15} color="black" css={{ m: 0 }}>
                          Recommended
                        </Text>
                        &nbsp;
                        <Text color={"black"}>MetaMask</Text>
                        <Text color={"black"}>Rainbow</Text>
                        &nbsp;
                        <Text h6 size={15} color="black" css={{ m: 0 }}>
                          Others
                        </Text>
                        &nbsp;
                        <Text color={"black"}>WalletConnect</Text>
                        <Text color={"black"}>imToken</Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card css={{ $$cardColor: 'white' }}>
                      <Card.Body>
                        <Text h6 size={15} color="black" css={{ m: 0 }}>
                          What is a Wallet?
                        </Text>&nbsp;
                        <Text h6 size={15} color="black" css={{ m: 0 }}>
                          A home for your digital assets
                        </Text>
                        <Text h6 size={15} color="grey" css={{ m: 0 }}>
                          Used to send, receive, store, and disaply digital assets like NFTs.
                        </Text>
                        &nbsp;
                        <Text h6 size={15} color="black" css={{ m: 0 }}>
                        A new way to log in
                        </Text>
                        <Text h6 size={15} color="grey" css={{ m: 0 }}>
                        Instead of creating new accounts and passwords on every website, just connect your wallet.  
                        </Text>
                        &nbsp;
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
              </Modal.Body>
  </Modal> */}
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

      

      {/* Jumbotron */}
      {/* {loading ? <div>Loading...</div> : null} */}
      <form onSubmit={handleSubmit}>
      <Grid.Container   justify="center">
        <Grid xs={12} sm={6} alignItems="center" css={{marginRight: "200px"}}>
          <Col css={{"width": "100%"}}>
          <Card css={{justifyContent: "center", height:"500px", width: "120%", padding: "10px"}}>
          <Card.Header style={{"justifyContent":"center"}}>
            <Text weight={"bold"} size={40} b>Trade</Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body css={{ py: "$10" }}>
          <Grid.Container gap={2} justify="center">
          <Grid xs={6} css={{ height: "100px", color:"White"}}>
            <Dropdown>
              <Dropdown.Button flat color="primary" css={{ tt: "capitalize", width: "500px" }}>
                {selectedFromValue}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Single selection actions"
                color="secondary"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedFrom}
                dropdownPosition="top"
                onSelectionChange={setSelectedFrom}
              >
                <Dropdown.Item key="ETH" >ETH</Dropdown.Item>
                <Dropdown.Item key="SOL">SOL</Dropdown.Item>
                <Dropdown.Item key="BTC">BTC</Dropdown.Item>
                <Dropdown.Item key="MATIC">MATIC</Dropdown.Item>
                <Dropdown.Item key="USDT">USDT</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            &nbsp;
            {/* <Image
              color='white'
              src="/arrow3.png"
              alt="Default Image"
              width={50}
              height={50}
            /> */}
            &nbsp;
            <Dropdown>
              <Dropdown.Button flat color="primary" css={{ tt: "capitalize", width: "500px" }}>
                {selectedToValue}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Single selection actions"
                color="secondary"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedTo}
                onSelectionChange={setSelectedTo}
              >
                <Dropdown.Item key="ETH">ETH</Dropdown.Item>
                <Dropdown.Item key="SOL">SOL</Dropdown.Item>
                <Dropdown.Item key="BTC">BTC</Dropdown.Item>
                <Dropdown.Item key="MATIC">MATIC</Dropdown.Item>
                <Dropdown.Item key="USDT">USDT</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Grid>
          <Grid xs={6} justify={"center"}>
          <>
            <Input clearable bordered labelPlaceholder="Amount: " value={inputValue} onChange={handleChange} initialValue="0.00" />
          </>
          </Grid>
    </Grid.Container>
          </Card.Body>
          <Card.Divider />
          <Card.Footer>
            <Row justify="center">
              <Button 
               type="submit"
               auto 
               flat 
               href="#" 
               bordered 
               size="lg" 
               color="primary"
               >
                {TradeBTN}</Button>
            </Row>
          </Card.Footer>
        </Card> 
        </Col>
        </Grid>
      </Grid.Container>
      </form>
    </Container>
     )}
     </div>
  )
}

export default Trade


  