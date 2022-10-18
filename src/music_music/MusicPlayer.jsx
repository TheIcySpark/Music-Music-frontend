import React from 'react'
import {
    Grid,
    GridItem,
    ChakraProvider,
    Button,
    InputGroup,
    InputLeftElement,
    Input,
    TableContainer,
    Thead,
    Tr,
    Th,
    Tbody,
    Table,
    IconButton,
    Center,
    Tag,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    Box,
    SliderThumb,
    Tooltip
} from '@chakra-ui/react'
import { MdBuild, MdSearch, MdLibraryMusic, MdGraphicEq } from "react-icons/md"
import { GrFormPreviousLink, GrFormNextLink, GrNext } from "react-icons/gr"
import { AiFillSound } from 'react-icons/ai'
import { RiLogoutCircleRFill } from 'react-icons/ri'
import { BiSkipNext, BiSkipNextCircle } from 'react-icons/bi'
import { ImLoop, ImLoop2, ImNext2, ImPrevious, ImPrevious2 } from 'react-icons/im'
import { GiNextButton } from 'react-icons/gi'
import { FaLess, FaPause, FaPlay } from 'react-icons/fa'
import SongResult from './SongResult'

function MusicPlayer(props) {
    const [searchValue, setSearchValue] = React.useState('')
    const [songUrl, setSongUrl] = React.useState('')
    const [songResults, setSongResults] = React.useState([])
    const [nextPage, setNextPage] = React.useState('')
    const [previousPage, setPreviousPage] = React.useState('')
    const [playSongIcon, setPlaySongIcon] = React.useState(<FaPause />)
    const [loopIconStyle, setLoopIconStyle] = React.useState('outline')
    const [songDurationRange, setSongDurationRange] = React.useState('00:00 / 00:00')
    const [songDuration, setSongDuration] = React.useState(0)
    const [showVolumeTooltip, setShowVolumeTooltip] = React.useState(false)
    const [volumeValue, setVolumeValue] = React.useState(100)

    function logout() {
        localStorage.removeItem('Token')
        props.setIsLoggedIn(false)
    }

    function formatTime(seconds) {
        if (!seconds) {
            return '00:00'
        }
        let minutes
        minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    }

    function changeVolume(volume) {
        let audioTag = document.getElementById('audioTag')
        setVolumeValue(volume)
        audioTag.volume = volume
    }

    function togglePlaySong() {
        let audioTag = document.getElementById('audioTag')
        if (audioTag.src == 'http://localhost:3000/') {
            return
        }
        if (playSongIcon.type.name == 'FaPlay') {
            setPlaySongIcon(<FaPause />)
            audioTag.play()
        } else {
            setPlaySongIcon(<FaPlay />)
            audioTag.pause()
        }
    }

    function songDurationRangeChanged() {
        let audioTag = document.getElementById('audioTag')
        setSongDurationRange(formatTime(audioTag.duration) + ' / ' + formatTime(audioTag.currentTime))
    }

    function toggleLoopAudio() {
        let audiotag = document.getElementById('audioTag')
        if (loopIconStyle == 'outline') {
            audiotag.loop = true
            setLoopIconStyle('solid')
        } else {
            audiotag.loop = false
            setLoopIconStyle('outline')
        }
    }


    const searchSong = (event) => {
        setSearchValue(event.target.value)
    }

    function playSong() {
        setPlaySongIcon(<FaPause />)
    }

    function pauseSong() {
        setPlaySongIcon(<FaPlay />)
    }

    function fetchSongs(url) {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setSongResults(data.results)
                setNextPage(data.next)
                setPreviousPage(data.previous)
            })
    }

    return (
        <ChakraProvider>
            <Grid
                h='100vh'
                p={2}
                templateRows='repeat(10, 1fr)'
                templateColumns='repeat(6, 1fr)'
                gap={4}
            >
                <GridItem rowSpan={9} colSpan={1} overflowY="auto">
                    <Button leftIcon={<MdBuild />} w="100%">Settings</Button>
                    <Button
                        mt={1}
                        leftIcon={<MdLibraryMusic />}
                        w="100%"
                        onClick={() => fetchSongs("http://localhost:8000/api/songs/")}
                    >
                        All songs
                    </Button>
                    <Button
                        mt={1}
                        leftIcon={<RiLogoutCircleRFill />}
                        w="100%"
                        colorScheme="red"
                        onClick={() => logout()}
                    >
                        Logout
                    </Button>
                </GridItem>

                <GridItem rowSpan={9} colSpan={5} overflowY="auto" >
                    <InputGroup w="100%">
                        <InputLeftElement
                            children={<MdSearch />}
                        />
                        <Input
                            placeholder='Search song'
                            onChange={searchSong}
                        />
                    </InputGroup>
                    {songResults.length > 0 &&
                        <>
                            <TableContainer>
                                <Table variant="striped">
                                    <Thead>
                                        <Tr>
                                            <Th></Th>
                                            <Th></Th>
                                            <Th>Song</Th>
                                            <Th>Artist</Th>
                                            <Th>Album</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {songResults.length > 0 && songResults.map(data => <SongResult setSongUrl={setSongUrl} data={data} key={data.id} />)}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <Center m={2}>
                                <IconButton
                                    disabled={previousPage == null}
                                    value={previousPage}
                                    mr={1}
                                    colorScheme='blue'
                                    aria-label='Search database'
                                    variant="solid"
                                    size="lg"
                                    icon={<GrFormPreviousLink />}
                                    onClick={() => fetchSongs(previousPage)}
                                />
                                <IconButton
                                    value={nextPage}
                                    disabled={nextPage == null}
                                    colorScheme='blue'
                                    aria-label='Search database'
                                    variant="solid"
                                    size="lg"
                                    icon={<GrFormNextLink />}
                                    onClick={() => fetchSongs(nextPage)}
                                />
                            </Center>
                        </>
                    }
                </GridItem>
                <GridItem rowSpan={1} colSpan={6}>
                    <center>
                        <IconButton
                            colorScheme='blue'
                            aria-label='Search database'
                            variant='outline'
                            icon={<ImPrevious2 />}
                        />
                        <IconButton
                            colorScheme='blue'
                            aria-label='Search database'
                            variant='outline'
                            icon={playSongIcon}
                            onClick={() => togglePlaySong()}
                        />
                        <IconButton
                            colorScheme='blue'
                            aria-label='Search database'
                            variant='outline'
                            icon={<ImNext2 />}
                        />
                        <IconButton
                            colorScheme='blue'
                            aria-label='Search database'
                            variant={loopIconStyle}
                            onClick={() => toggleLoopAudio()}
                            icon={<ImLoop2 />}
                        />
                        <Tag
                            colorScheme="blue"
                        >
                            {songDurationRange}
                        </Tag>
                        <Slider
                            w='10vw'
                            min='0'
                            max='1'
                            step={0.01}
                            defaultValue={100}
                            onChange={(v) => changeVolume(v)}
                            onMouseEnter={() => setShowVolumeTooltip(true)}
                            onMouseLeave={() => setShowVolumeTooltip(false)}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <Tooltip
                                hasArrow
                                bg='teal.500'
                                color='white'
                                placement='top'
                                isOpen={showVolumeTooltip}
                                label={Math.round(volumeValue * 100)}
                            >
                                <SliderThumb boxSize={5}>
                                    <Box color='teal' as={AiFillSound} />
                                </SliderThumb>

                            </Tooltip>
                        </Slider>

                    </center>
                    <audio id='audioTag'
                        src={songUrl}
                        controls
                        autoPlay
                        loop={true}
                        onPlay={() => playSong()}
                        onPause={() => pauseSong()}
                        onDurationChange={() => songDurationRangeChanged()}
                        onTimeUpdate={() => songDurationRangeChanged()}
                    />
                </GridItem>
            </Grid>
        </ChakraProvider>
    )
}

export default MusicPlayer