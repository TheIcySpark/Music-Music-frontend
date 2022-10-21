import { Button, Center, Divider, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Tag, TagLeftIcon, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FaPlay } from "react-icons/fa"
import {
    Tr,
    Td
} from '@chakra-ui/react'
import { RiZoomInFill } from 'react-icons/ri'
import { MdAccessibility, MdAccessible, MdAlbum, MdBlurOn, MdBook, MdDateRange, MdFormatListNumbered, MdLineStyle, MdMergeType, MdPerson, MdStyle } from 'react-icons/md'

function SongResult(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Tr>
            <Td>
                <IconButton
                    icon={<FaPlay />}
                    variant="outline"
                    colorScheme='blue'
                    size="sm"
                    onClick={() => {
                        props.setSongUrl("http://localhost:8000/api/song_audio_file/" + props.data.id)
                        props.setCurrentSongData(props.data)
                        console.log(props.data)
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
                    variant="outline"
                    colorScheme='blue'
                    size="sm"
                    onClick={onOpen}
                />
                <Modal isOpen={isOpen} onClose={onClose} size='xl' scrollBehavior='inside'>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{props.data.name}</ModalHeader>
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
                                <Stack direction='row' p={1} key={index}>
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
                                            <Tag p={1} colorScheme='blue' variant='solid' key={index}>
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