import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'
import { Container, Navbar, Text, Button, Grid, Col, Modal, Card, Row, Dropdown, Image, Input, Spacer, Switch, useTheme } from '@nextui-org/react';
import InfoCard from '../components/InfoCard';
import { FaWallet } from 'react-icons/fa'
import { useTheme as useNextTheme } from 'next-themes'
import { SunIcon } from './SunIcon';
import { MoonIcon } from './MoonIcon';

const Home: NextPage = () => {
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
  const [selectedFrom, setSelectedFrom] = React.useState(new Set(["text"]))
  const selectedFromValue = React.useMemo(
    () => Array.from(selectedFrom).join(", ").replaceAll("_", " "),
    [selectedFrom]
  )
  const [selectedTo, setSelectedTo] = React.useState(new Set(["text"]))
  const selectedToValue = React.useMemo(
    () => Array.from(selectedTo).join(", ").replaceAll("_", " "),
    [selectedTo]
  )

  /* Grid in trade container */
  // const MockItem = ({ text }) => {
  //   return (
  //     <Card css={{ h: "$24", $$cardColor: '$colors$primary' }}>
  //       <Card.Body>
  //         <Text h6 size={15} color="white" css={{ mt: 0 }}>
  //           {text}
  //         </Text>
  //       </Card.Body>
  //     </Card>
  //   );
  // };

  return (
    <Container>
      {/* Navbar */}
      <Navbar isCompact variant={"static"}>
        <Navbar.Brand>
          <Text b color="inherit">
            AMM
          </Text>
        </Navbar.Brand>
        <Navbar.Content hideIn="md">
          <Navbar.Link href="/">Trade</Navbar.Link>
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
            onPress={handler}
            > 
              <FaWallet/>
              &nbsp;Connect Wallet
            </Button> 
            {/* modal on wallet button */}
            <Modal 
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
            </Modal>
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

      <Grid.Container justify="center">
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
                onSelectionChange={setSelectedFrom}
              >
                <Dropdown.Item key="text">Text</Dropdown.Item>
                <Dropdown.Item key="number">Number</Dropdown.Item>
                <Dropdown.Item key="date">Date</Dropdown.Item>
                <Dropdown.Item key="single_date">Single Date</Dropdown.Item>
                <Dropdown.Item key="iteration">Iteration</Dropdown.Item>
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
                <Dropdown.Item key="text">Text</Dropdown.Item>
                <Dropdown.Item key="number">Number</Dropdown.Item>
                <Dropdown.Item key="date">Date</Dropdown.Item>
                <Dropdown.Item key="single_date">Single Date</Dropdown.Item>
                <Dropdown.Item key="iteration">Iteration</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Grid>
          <Grid xs={6} justify={"center"}>
          <>
            <Input clearable bordered labelPlaceholder="Amount" initialValue="0.00" />
          </>
          </Grid>
    </Grid.Container>
          </Card.Body>
          <Card.Divider />
          <Card.Footer>
            <Row justify="center">
              <Button 
               auto 
               flat 
               href="#" 
               bordered 
               onPress={handler} 
               size="lg" 
               color="primary"
               >
                Connect Wallet</Button>
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