import React from 'react'
import {
    Grid,
    GridItem,
    ChakraProvider,
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
} from '@chakra-ui/react'
import { MdSearch } from "react-icons/md"
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr"
import SongResult from './SongResult'
import AudioPlayer from './AudioPlayer'
import PlayerMenu from './PlayerMenu'

function MusicPlayer(props) {
    const [songResults, setSongResults] = React.useState([])
    const [nextPageSongResults, setNextPageSongResults] = React.useState('')
    const [previousPageSongResults, setPreviousPageSongResults] = React.useState('')
    const [songSrcUrl, setSongSrcUrl] = React.useState('')
    const [currentSongData, setCurrentSongData] = React.useState(Object)

    function fetchSongs(url) {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setSongResults(data.results)
                setNextPageSongResults(data.next)
                setPreviousPageSongResults(data.previous)
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
                    <PlayerMenu fetchSongs={fetchSongs} setIsLoggedIn={props.setIsLoggedIn}/>
                </GridItem>

                <GridItem rowSpan={9} colSpan={5} overflowY="auto" >
                    <InputGroup w="100%">
                        <InputLeftElement
                            children={<MdSearch />}
                        />
                        <Input
                            placeholder='Search song'
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
                                            <Th></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {songResults.length > 0 && songResults.map(data => <SongResult setSongUrl={setSongSrcUrl} setCurrentSongData={setCurrentSongData} data={data} key={data.id} />)}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <Center m={2}>
                                <IconButton
                                    disabled={previousPageSongResults == null}
                                    value={previousPageSongResults}
                                    mr={1}
                                    colorScheme='blue'
                                    aria-label='Search database'
                                    variant="solid"
                                    size="lg"
                                    icon={<GrFormPreviousLink />}
                                    onClick={() => fetchSongs(previousPageSongResults)}
                                />
                                <IconButton
                                    value={nextPageSongResults}
                                    disabled={nextPageSongResults == null}
                                    colorScheme='blue'
                                    aria-label='Search database'
                                    variant="solid"
                                    size="lg"
                                    icon={<GrFormNextLink />}
                                    onClick={() => fetchSongs(nextPageSongResults)}
                                />
                            </Center>
                        </>
                    }
                </GridItem>
                <GridItem rowSpan={1} colSpan={6}>
                    <AudioPlayer songSrcUrl={songSrcUrl} currentSongData={currentSongData} />
                </GridItem>
            </Grid>
        </ChakraProvider >
    )
}

export default MusicPlayer