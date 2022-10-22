import {
    Button, Divider, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader,
    PopoverTrigger, Portal, Select, Stack, Tag, TagLeftIcon, Text, useDisclosure
} from '@chakra-ui/react'
import React, { memo, useEffect } from 'react'
import { FaPlay, FaSave } from "react-icons/fa"
import {
    Tr,
    Td
} from '@chakra-ui/react'
import { RiZoomInFill } from 'react-icons/ri'
import { MdAccessibility, MdAccessible, MdAdd, MdAlbum, MdBlurOn, MdBook, MdDateRange, MdDelete, MdFormatListNumbered, MdLineStyle, MdMergeType, MdPerson, MdSave, MdStyle } from 'react-icons/md'

function SongResult(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Tr>
            <Td>
                <IconButton
                    icon={<FaPlay />}
                    isRound
                    variant="outline"
                    colorScheme='blue'
                    size="sm"
                    onClick={() => {
                        props.setSongUrl("http://localhost:8000/api/song_audio_file/" + props.data.id)
                        props.setCurrentSongData(props.data)
                    }}
                />
            </Td>
            <Td>
                <Image src={props.data.album[0].image_url} boxSize='50px' borderRadius="full" />
            </Td>
            <Td>
                <Tag colorScheme="blue">
                    {props.data.name}
                </Tag>
            </Td>
            <Td>
                <Tag colorScheme="blue">
                    {props.data.artist[0].name}
                </Tag>
            </Td>
            <Td>
                <Tag colorScheme="blue">
                    {props.data.album[0].name}
                </Tag>
            </Td>
            <Td>
                <IconButton
                    icon={<RiZoomInFill />}
                    isRound
                    variant="outline"
                    colorScheme='blue'
                    size="sm"
                    onClick={onOpen}
                />
                <Modal isOpen={isOpen} onClose={onClose} size='xl' scrollBehavior='inside'>
                    <ModalOverlay backdropFilter='blur(10px) hue-rotate(90deg)' />
                    <ModalContent>
                        <ModalHeader>
                            {props.data.name}
                            <Popover closeOnBlur={false}>
                                <PopoverTrigger>
                                    <IconButton
                                        isRound
                                        icon={<MdAdd />}
                                        colorScheme='orange'
                                    />
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader>Select Playlist</PopoverHeader>
                                    <PopoverBody >
                                        <Select id='infoPlaylistSelect' autoFocus>
                                            {props.ownPlaylists.length > 0 && props.ownPlaylists.map((data, index) =>
                                                <option value={data.id} key={index + 'selectPlaylist'}>{data.name}</option>
                                            )}
                                        </Select>
                                    </PopoverBody>
                                    <PopoverFooter>
                                        <IconButton
                                            isRound
                                            icon={<MdSave />}
                                            colorScheme='green'
                                            onClick={() => {
                                                let playlist_id = document.getElementById('infoPlaylistSelect').value
                                                fetch('http://127.0.0.1:8000/api/add_song_to_playlist/', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Authorization': localStorage.getItem('Token'),
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        playlist_id: playlist_id,
                                                        song_id: props.data.id
                                                    })
                                                }).then((response) => {
                                                    console.log(response)
                                                })
                                            }}
                                        />
                                        <IconButton
                                            isRound
                                            icon={<MdDelete />}
                                            colorScheme='red'
                                        />
                                    </PopoverFooter>
                                </PopoverContent>
                            </Popover>

                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Stack direction='row' p={1}>
                                <Image
                                    boxSize='200px'
                                    objectFit='cover'
                                    src={props.data.album[0].image_url}
                                    borderRadius
                                />
                                <Divider orientation='vertical' />
                                <Stack direction='column' w='100%'>
                                    <Tag p={1} colorScheme='cyan' variant='solid' size='lg'>
                                        <TagLeftIcon as={MdAlbum} />
                                        Album: {props.data.album[0].name}
                                    </Tag>
                                    <Tag p={1} colorScheme='blue' variant='solid'>
                                        <TagLeftIcon as={MdDateRange} />
                                        Release date: {props.data.album[0].release_date}
                                    </Tag>
                                    <Tag p={1} colorScheme='blue' variant='solid'>
                                        <TagLeftIcon as={MdFormatListNumbered} />
                                        Total songs: {props.data.album[0].total_songs}
                                    </Tag>
                                    <Tag p={1} colorScheme='blue' variant='solid'>
                                        <TagLeftIcon as={MdBook} />
                                        Type: {props.data.album[0].type}
                                    </Tag>
                                </Stack>
                            </Stack>
                            <Divider />
                            {props.data.artist.length > 0 && props.data.artist.map((data, index) =>
                                <Stack direction='row' p={1} key={index + 'artistData'}>
                                    <Image
                                        boxSize='200px'
                                        objectFit='cover'
                                        src={data.image_url}
                                        borderRadius
                                    />
                                    <Divider orientation='vertical' />
                                    <Stack direction='column' w='100%'>
                                        <Tag p={1} colorScheme='red' variant='solid' size='lg'>
                                            <TagLeftIcon as={MdPerson} />
                                            Artist: {data.name}
                                        </Tag>
                                        {data.genres.length > 0 && data.genres.map((genresData, index) =>
                                            <Tag p={1} colorScheme='blue' variant='solid' key={index + 'genresData'}>
                                                <TagLeftIcon as={MdStyle} />
                                                {genresData.genre}
                                            </Tag>
                                        )}
                                    </Stack>
                                </Stack>
                            )}


                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='red' mr={3} onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Td>
        </Tr>
    )
}

export default SongResult