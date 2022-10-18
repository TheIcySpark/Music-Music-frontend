import { IconButton, Image, Tag } from '@chakra-ui/react'
import React from 'react'
import MusicPlayer from './MusicPlayer'
import { FaPlay } from "react-icons/fa"
import {
    Tr,
    Td
} from '@chakra-ui/react'

function SongResult(props) {
    return (
        <Tr>
            <Td>
                <IconButton 
                    icon={<FaPlay />} 
                    variant="outline" 
                    colorScheme='blue' 
                    size="sm"
                    onClick={()=> props.setSongUrl("http://localhost:8000/api/song_audio_file/" + props.data.id)}
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
        </Tr>
    )
}

export default SongResult