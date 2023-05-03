import React, { useEffect, useState } from 'react'
import { Box, Container } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import LogIn from '../Components/Authentication/LogIn'
import SignUp from '../Components/Authentication/SignUp'
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate()

  const [user, setUser] = useState()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    setUser(userInfo)

    if(userInfo) {
        navigate("/chats")
    } 
  }, [navigate])

  return (
    <Container maxW='xl' centerContent padding="20px">
      <Box bg="black" w="100%" p={4} borderRadius="lg" borderWidth="3px" borderColor="white">
        <Tabs variant='enclosed'>
          <TabList mb="1em">
            <Tab width="50%" color="white">LogIn</Tab>
            <Tab width="50%" color="white">SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel color="white">
              <LogIn />
            </TabPanel>
            <TabPanel color="white">
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home