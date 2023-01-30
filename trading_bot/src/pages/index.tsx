import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'
import { Container, Navbar, Text, Button, Grid, Col, Modal, Card, Row, Dropdown, Image } from '@nextui-org/react';
import InfoCard from '../components/InfoCard';
import { FaWallet } from 'react-icons/fa'

const Home: NextPage = () => {
  const [visible, setVisible] = React.useState(false)
  const handler = () => setVisible(true)
  const closeHandler = () => {
    setVisible(false)
    console.log("closed")
  }
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
          <Navbar.Link href="#">Trade</Navbar.Link>
          <Navbar.Link href="#">Asset</Navbar.Link>
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
      {/* Jumbotron */}
      <Grid.Container justify="center" css={{"height": "500px", "backgroundImage": "url(https://littlevisuals.co/images/sunset.jpg)"}}>
        <Grid xs={12} sm={6} alignItems="center">
          <Col css={{"width": "100%"}}>
        <Card css={{ mw: "800px" , justifyContent: "center"}}>
          <Card.Header style={{"justifyContent":"center"}}>
            <Text weight={"bold"} size={50} b>Trade</Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body css={{ py: "$10" }}>
            <Dropdown>
              <Dropdown.Button flat color="primary" css={{ tt: "capitalize" }}>
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
            <Image
              color='white'
              src="/arrow3.png"
              alt="Default Image"
              width={50}
              height={50}
            />
            &nbsp;
            <Dropdown>
              <Dropdown.Button flat color="primary" css={{ tt: "capitalize" }}>
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
          </Card.Body>
          <Card.Divider />
          <Card.Footer>
            <Row justify="center">
              <Button size="sm" color="secondary">Check Trade</Button>
            </Row>
          </Card.Footer>
        </Card> 
        </Col>
        </Grid>
      </Grid.Container>

      {/* 3 Displaying Product Cards */}
      <Grid.Container gap={2}>
        <Grid xs={12} sm={4}>
          <InfoCard
            label="Course"
            title="Learn Next.js With Cooper Codes"
            imageURL="https://littlevisuals.co/images/red_dawn.jpg"
            studentCount="3,500"
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <InfoCard
            label="Course"
            title="Learn Apollo Server With Cooper Codes"
            imageURL="https://littlevisuals.co/images/sunset.jpg"
            studentCount="1,000"
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <InfoCard
            label="Course"
            title="Create A Startup With Cooper Codes"
            imageURL="https://littlevisuals.co/images/tail.jpg"
            studentCount="5,000"
          />
        </Grid>
      </Grid.Container>
    </Container>
  )
}

export default Home