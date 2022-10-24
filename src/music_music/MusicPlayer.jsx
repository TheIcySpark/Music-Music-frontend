import React, { useEffect } from 'react'
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
    const [songsSrcQueue, setSongsSrcQueue] = React.useState([])
    const [songSrcUrl, setSongSrcUrl] = React.useState('')
    const [currentSongData, setCurrentSongData] = React.useState(Object)
    const [ownPlaylists, setOwnPlaylists] = React.useState([])

    function fetchSongs(url) {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setSongResults(data.results)
                setNextPageSongResults(data.next)
                setPreviousPageSongResults(data.previous)
                const songsSrcs = []
                const urls = [url]
                while (data.next) {
                    urls.push(data.next)
                    let new_data
                    fetch(data.next)
                        .then((response) => {
                            new_data = response
                        })
                    data = new_data
                }

                urls.forEach((currentUrl) => {
                    fetch(currentUrl)
                        .then((response) => response.json())
                        .then((data) => {
                            data.results.forEach(element => {
                                songsSrcs.push(element)
                            });
                        })
                })
                setSongsSrcQueue(songsSrcs)
            })
    }

    function fetchOwnPlaylists() {
        fetch('http://127.0.0.1:8000/api/playlists/', {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('Token'),
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((response) => {
            setOwnPlaylists(response)
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
                <GridItem rowSpan={9} colSpan={1} overflowY="auto"
                    onContextMenu={(event) => {
                        event.preventDefault()
                    }}
                >
                    <PlayerMenu
                        fetchOwnPlaylists={fetchOwnPlaylists}
                        ownPlaylists={ownPlaylists}
                        fetchSongs={fetchSongs}
                        setIsLoggedIn={props.setIsLoggedIn}
                    />
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
                                        {songResults.length > 0 && songResults.map((data, index) =>
                                            <SongResult
                                                setSongUrl={setSongSrcUrl}
                                                setCurrentSongData={setCurrentSongData}
                                                ownPlaylists={ownPlaylists}
                                                data={data}
                                                key={index + 'songResults'}
                                            />
                                        )}
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
                    <AudioPlayer
                        songSrcUrl={songSrcUrl}
                        setSongSrcUrl={setSongSrcUrl}
                        currentSongData={currentSongData}
                        setCurrentSongData={setCurrentSongData}
                        songsSrcQueue={songsSrcQueue}
                    />

                </GridItem>
            </Grid>
        </ChakraProvider >
    )
}

export default MusicPlayer