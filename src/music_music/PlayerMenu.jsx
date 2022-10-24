import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { BsMusicNoteList } from 'react-icons/bs'
import { MdBuild, MdLibraryMusic, MdPlaylistAdd, MdPublic } from 'react-icons/md'
import { RiLogoutCircleRFill } from 'react-icons/ri'

function PlayerMenu(props) {
    const [menuButtonsColors, setMenuButtonsColors] = React.useState([undefined, 'green'])

    const { isOpen: isNewPlaylistOpen, onOpen: onNewPlaylistOpen, onClose: onNewPlaylistClose } = useDisclosure()
    const { isOpen: isDeletePlaylistOpen, onOpen: onDeletePlaylistOpen, onClose: onDeletePlaylistClose } = useDisclosure()
    const toast = useToast()

    const [playlistSelectedToUpdate, setPlaylistSelectedToUpdate] = React.useState('')

    function logout() {
        fetch('http://127.0.0.1:8000/api/auth/token/logout', {
            method: 'POST',
            body: JSON.stringify({
                Token: localStorage.getItem('Token').split()[1]
            }),
            headers: {
                'Authorization': localStorage.getItem('Token')
            }
        })
        localStorage.removeItem('Token')
        props.setIsLoggedIn(false)
    }

    function createPlaylist() {
        let playlistName = document.getElementById('newPlaylistName').value
        let playlistType = document.getElementById('newPlaylistType').value
        fetch('http://127.0.0.1:8000/api/playlists/', {
            method: 'POST',
            body: JSON.stringify({
                name: playlistName,
                public: playlistType
            }),
            headers: {
                'Authorization': localStorage.getItem('Token'),
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            props.fetchOwnPlaylists()
            onNewPlaylistClose()
        })
    }

    function highlighSelectedButton(i) {
        let x = []
        x[i] = 'green'
        setMenuButtonsColors(x)
    }

    useEffect(() => {
        props.fetchSongs("http://localhost:8000/api/songs/")
        props.fetchOwnPlaylists()
    }, [])

    return (
        <>
            <Button
                leftIcon={<MdBuild />}
                w="100%"
                colorScheme={menuButtonsColors[0]}
                onClick={() => {
                    highlighSelectedButton(0)
                }}
            >
                Settings
            </Button>
            <Button
                mt={1}
                leftIcon={<MdLibraryMusic />}
                w="100%"
                colorScheme={menuButtonsColors[1]}
                onClick={() => {
                    props.fetchSongs("http://localhost:8000/api/songs/")
                    highlighSelectedButton(1)
                }}
            >
                All songs
            </Button>
            {props.ownPlaylists.length > 0 && props.ownPlaylists.map((data, index) =>
                <Button
                    leftIcon={<BsMusicNoteList />}
                    w="100%"
                    mt={1}
                    colorScheme={menuButtonsColors[index + 2]}
                    key={index + 'ownPlaylists'}
                    onAuxClick={(event) => {
                        event.preventDefault()
                        onDeletePlaylistOpen()
                        setPlaylistSelectedToUpdate(data)
                    }}
                    onClick={() => {
                        highlighSelectedButton(index + 2)
                        props.fetchSongs("http://localhost:8000/api/playlists/" + data.id + '/')
                    }}
                >
                    {data.name}
                </Button>
            )}
            <Modal
                isOpen={isDeletePlaylistOpen}
                onClose={onDeletePlaylistClose}
            >
                <ModalOverlay backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent>
                    <ModalHeader>Edit playlist</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Playlist name</FormLabel>
                            <Input defaultValue={playlistSelectedToUpdate.name} id='updatePlaylistName' />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Type</FormLabel>
                            <Select defaultValue={playlistSelectedToUpdate.public + 0} icon={<MdPublic />} id='updatePlaylistType'>
                                <option value={0}>Private</option>
                                <option value={1}>Public</option>
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={() => {
                            let playlistName = document.getElementById('updatePlaylistName').value
                            let playlistType = document.getElementById('updatePlaylistType').value
                            fetch('http://localhost:8000/api/playlists/' + playlistSelectedToUpdate.id + '/', {
                                method: 'PATCH',
                                body: JSON.stringify({
                                    name: playlistName,
                                    public: playlistType
                                }),
                                headers: {
                                    'Authorization': localStorage.getItem('Token'),
                                    'Content-Type': 'application/json'
                                }
                            }).then((response) =>{
                                if(response.status >= 200 || response.status <= 200){
                                    onDeletePlaylistClose()
                                    props.fetchOwnPlaylists()
                                    toast({
                                        title: 'Updated',
                                        description: "Playlist updated",
                                        status: 'success',
                                        duration: 3000,
                                        position: 'top-right',
                                        isClosable: true,
                                    })
                                }
                            })
                        }}>
                            Update
                        </Button>
                        <Button
                            colorScheme='red'
                            onClick={() => {
                                fetch('http://localhost:8000/api/playlists/' + playlistSelectedToUpdate.id + '/', {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': localStorage.getItem('Token'),
                                    'Content-Type': 'application/json'
                                }
                            }).then((response) =>{
                                if(response.status >= 200 || response.status <= 200){
                                    props.fetchOwnPlaylists()
                                    props.fetchSongs("http://localhost:8000/api/songs/")
                                    highlighSelectedButton(1)
                                    toast({
                                        title: 'Deleted',
                                        description: "Playlist deleted",
                                        status: 'warning',
                                        duration: 3000,
                                        position: 'top-right',
                                        isClosable: true,
                                    })
                                    onDeletePlaylistClose()

                                }
                            })
                            }}>
                            Delete playlist
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Button
                mt={1}
                leftIcon={<MdPlaylistAdd />}
                w="100%"
                colorScheme='blue'
                onClick={onNewPlaylistOpen}
            >
                New playlist
            </Button>
            <Modal
                isOpen={isNewPlaylistOpen}
                onClose={onNewPlaylistClose}
            >
                <ModalOverlay backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent>
                    <ModalHeader>Create new playlist</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Playlist name</FormLabel>
                            <Input id='newPlaylistName' />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Type</FormLabel>
                            <Select icon={<MdPublic />} id='newPlaylistType'>
                                <option value={0}>Private</option>
                                <option value={1}>Public</option>
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => {
                            toast({
                                title: 'Created',
                                description: "New playlist created",
                                status: 'success',
                                duration: 3000,
                                position: 'top-right',
                                isClosable: true,
                            })
                            createPlaylist()
                        }}>
                            Save
                        </Button>
                        <Button onClick={onNewPlaylistClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Button
                mt={1}
                leftIcon={<RiLogoutCircleRFill />}
                w="100%"
                colorScheme="red"
                onClick={() => logout()}
            >
                Logout
            </Button>
        </>
    )
}

export default PlayerMenu