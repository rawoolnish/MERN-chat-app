import { Box, Button, Menu, MenuItem, Text, Tooltip, MenuList, MenuButton, Avatar, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useDisclosure, useToast, Spinner } from '@chakra-ui/react';
import { ChatState } from "../context/ChatProvider"
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import React, { useState } from 'react';
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import ProfileModal from '../pages/ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chatloading from './Chatloading'
import UserListItem from './UserListItem';
import { getSender } from '../config/Chatlogic';



const SideDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate();

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState();
    const [loadingChat, setLoadingChat] = useState("");


    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        navigate("/")
    }

    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'please enter something ',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            })
            return
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }

    }

    const accessChat = async (userId) => {
        try {
            setLoading(true)
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post("/api/chat", { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])

            setSelectedChat(data);
            setLoadingChat(false)
            onClose()
        } catch (error) {
            toast({
                title: "error occured while fetching",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }
    return (<>

        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} bg="white" w="100%" p="5px 10px" borderWidth={"5px "}>
            <Tooltip label="Search Users to chat" hasArrow placement='bottom-end' >
                <Button variant={"ghost"} onClick={onOpen}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <Text display={{ base: "none", md: "flex" }} px="4">Search user</Text>
                </Button>
            </Tooltip>
            <Text fontSize={"2xl"} fontFamily={"Open sans"}>
                Let's Chat
            </Text>
            <div>
                <Menu>
                    <MenuButton p={1}>
                        <NotificationBadge
                            count={notification.length}
                            effect={Effect.SCALE}
                        />
                        <BellIcon fontSize={"2xl"} m="1" />
                    </MenuButton>
                    <MenuList pl={2}>
                        {!notification.length && "No new messages"}
                        {notification.map((notif) =>
                        (<MenuItem key={notif._id}
                            onClick={() => {
                                setSelectedChat(notif.chat);
                                setNotification(notification.filter((n) => n !== notif));

                            }}>
                            {notif.chat.isGroupChat ?
                                `New message in ${notif.chat.chatName}` :
                                `New message from ${getSender(user, notif.chat.users)}`
                            }
                        </MenuItem>))}
                    </MenuList>
                </Menu>

                <Menu >
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        <Avatar size={"sm"} cursor={"pointer"} src={user.pic} />
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>My profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider></MenuDivider>
                        <MenuItem onClick={logoutHandler}>Logout </MenuItem>

                    </MenuList>
                </Menu>
            </div>
        </Box>
        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}

        >
            <DrawerOverlay />
            <DrawerContent>

                <DrawerHeader>search users</DrawerHeader>
                <DrawerBody>
                    <Box display={"flex"} pb={2}>
                        <Input
                            placeholder='Search by name or email'
                            mr={2}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button onClick={handleSearch}>Go</Button>
                    </Box>
                    {loading ? (<Chatloading />) : (
                        searchResult?.map(user => (<UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />))
                    )}
                    {loadingChat && <Spinner ml="auto" display={"flex"} />}
                </DrawerBody>
            </DrawerContent>

        </Drawer>
    </>)
}

export default SideDrawer