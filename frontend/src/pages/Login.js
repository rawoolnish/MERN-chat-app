import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);

    const handleShow = () => {
        setShow(!show)
    }


    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false);
            return;
        }

        // console.log(email, password);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(`/api/user/login`, { email, password }, config);
            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            toast({
                title: "Error Occured !",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }
    return (
        <VStack spacing='5px'>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)}></Input>
            </FormControl>
            <FormControl id='password' isRequired >
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : 'password'} value={password} placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width={"4.5rem"}>
                        <Button h={"1.75rem"} size="sm" onClick={handleShow}>{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>

            </FormControl>
            <Button colorScheme='blue' width={"100%"} style={{ marginTop: "15px" }} onClick={submitHandler}>
                Log In
            </Button>
            <Button colorScheme='red' width={"100%"} style={{ marginTop: "15px" }} onClick={() => setEmail("admin@gmail.com") & setPassword("123456")}>
                guest credentials
            </Button>
        </VStack >
    )
}

export default Login