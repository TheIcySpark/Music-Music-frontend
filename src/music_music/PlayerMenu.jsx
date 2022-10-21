import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useDisclosure } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { BsMusicNoteList } from 'react-icons/bs'
import { MdBuild, MdLibraryMusic, MdPlaylistAdd, MdPublic } from 'react-icons/md'
import { RiLogoutCircleRFill } from 'react-icons/ri'

function PlayerMenu(props) {
    const [menuButtonsColors, setMenuButtonsColors] = React.useState([undefined, 'green'])
    const [playlistShortcuts, setPlaylistShortcuts] = React.useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    function fetchPlaylistShortcuts() {
        fetch('http://127.0.0.1:8000/api/playlists/', {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('Token'),
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        })
            .then((response) => {
                setPlaylistShortcuts(response)
            })
    }

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
            console.log(response)
        })
    }

    function highlighSelectedButton(i) {
        let x = []
        x[i] = 'green'
        setMenuButtonsColors(x)
    }

    useEffect(() => {
        props.fetchSongs("http://localhost:8000/api/songs/")
        fetchPlaylistShortcuts()
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
            {playlistShortcuts.length > 0 && playlistShortcuts.map((data, index) =>
                <Button
                    leftIcon={<BsMusicNoteList />}
                    w="100%"
                    mt={1}
                    colorScheme={menuButtonsColors[index + 2]}
                    key={index}
                    onClick={() => {
                        highlighSelectedButton(index + 2)
                    }}
                >
                    {data.name}
                </Button>)
            }

            <Button
                mt={1}
                leftIcon={<MdPlaylistAdd />}
                w="100%"
                colorScheme='blue'
                onClick={onOpen}
            >
                New playlist
            </Button>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create new playlist</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Playlist name</FormLabel>
                            <Input ref={initialRef} id='newPlaylistName' />
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
                        <Button colorScheme='blue' mr={3} onClick={() => createPlaylist()}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
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