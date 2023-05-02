import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const navigate = useNavigate()
    const [picLoading, setPicLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pic, setPic] = useState("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
    const toast = useToast()

    const handleShow = () => {
        setShow(!show)
    }

    const postDetails = (pics) => {
        setPicLoading(true)
        if (pics === undefined) {
            toast({
                title: "Please select an Image",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dvigofhzu");
            fetch("https://api.cloudinary.com/v1_1/dvigofhzu/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setPicLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setPicLoading(false);
            return;
        }
    }

    const submitHandler = async () => {
        setPicLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: " All Feilds mandatory",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            setPicLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setPicLoading(true)
            toast({
                title: "Passwords Do Not Match",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setPicLoading(false)
            return;
        }
        console.log(name, email, password, pic);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/user",
                {
                    name,
                    email,
                    password,
                    pic,
                },
                config
            );
            console.log(data);
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            navigate("/chats");
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setPicLoading(false);
        }


    }
    return (
        <VStack spacing='5px'>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)}></Input>
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)}></Input>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : 'password'} placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width={"4.5rem"}>
                        <Button h={"1.75rem"} size="sm" onClick={handleShow}>{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>

            </FormControl>
            <FormControl id='confirmPassword' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : 'password'} placeholder='Confirm Your Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <InputRightElement width={"4.5rem"}>
                        <Button h={"1.75rem"} size="sm" onClick={handleShow}>{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>

            </FormControl>
            <FormControl id='pic'>
                <FormLabel>Upload Profile Picture</FormLabel>
                <InputGroup>
                    <Input type="file" p={1.5} accept='image/*'
                        onChange={(e) => postDetails(e.target.files[0])} />

                </InputGroup>

            </FormControl>

            <Button colorScheme='blue' width={"100%"} style={{ marginTop: "15px" }} isLoading={picLoading} onClick={submitHandler}>
                Sign Up
            </Button>
        </VStack >
    )
}

export default Signup