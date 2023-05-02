import React, { useEffect } from 'react'
import { Container, Box, Text, TabList, Tabs, Tab, TabPanel, TabPanels } from "@chakra-ui/react"
import Login from './Login'
import Signup from './Signup'
import { useNavigate } from 'react-router-dom'
const HomePage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            navigate('/chats')
        }
    }, [navigate])

    return <Container maxW='xl' centerContent>
        <Box display="flex"
            justifyContent='center'
            p={3}
            bg={"white"}
            w="100%"
            m="40px 0 15px 0"
            borderRadius='lg'
            borderWidth='1px'
            boxShadow={'dark-lg'}>
            <Text fontSize='4xl' fontFamily="Open sans" color={"black"}>Let's talk</Text>
        </Box>
        <Box bg='white' w="100%" p={4} borderRadius={"lg"} borderWidth={"1px"} boxShadow={'dark-lg'}>
            <Tabs variant='soft-rounded' colorScheme='orange'>
                <TabList mb='1em'>
                    <Tab width={"50%"}>Log In </Tab>
                    <Tab width={"50%"}>Sign Up</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {<Login />}
                    </TabPanel>
                    <TabPanel>
                        {<Signup />}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>

    </Container>
}

export default HomePage