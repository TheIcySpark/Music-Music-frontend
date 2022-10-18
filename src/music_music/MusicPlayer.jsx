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
} from '@chakra-ui/react'
import { MdBuild, MdSearch, MdLibraryMusic} from "react-icons/md"
import { GrFormPreviousLink, GrFormNextLink} from "react-icons/gr"
import { RiLogoutCircleRFill } from 'react-icons/ri'
import SongResult from './SongResult'
import AudioPlayer from './AudioPlayer'

function MusicPlayer(props) {
    const [songResults, setSongResults] = React.useState([])
    const [nextPage, setNextPage] = React.useState('')
    const [previousPage, setPreviousPage] = React.useState('')
    const [songSrcUrl, setSongSrcUrl] = React.useState('')

    function logout() {
        localStorage.removeItem('Token')
        props.setIsLoggedIn(false)
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
                                        {songResults.length > 0 && songResults.map(data => <SongResult setSongUrl={setSongSrcUrl} data={data} key={data.id} />)}
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
                    <AudioPlayer songSrcUrl={songSrcUrl}/>
                </GridItem>
            </Grid>
        </ChakraProvider>
    )
}

export default MusicPlayer