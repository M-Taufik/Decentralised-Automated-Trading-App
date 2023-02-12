import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'
import { Container, Navbar, Text, Button, Grid, Col, Modal, Card, Row, Dropdown, Image, Input, Spacer, Switch, useTheme, Table } from '@nextui-org/react';
import InfoCard from '../components/InfoCard';
import { FaWallet } from 'react-icons/fa'
import { useTheme as useNextTheme } from 'next-themes'
import { SunIcon } from './SunIcon';
import { MoonIcon } from './MoonIcon';

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
      coin: "USDC",
      value: "S$1.00"
    },
    {
      key: "2",
      coin: "WSTETH",
      value: "S$1,263.00"
    },
  ];

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