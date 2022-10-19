import { Box, Center, Grid, GridItem, IconButton, Image, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tag, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { AiFillSound } from 'react-icons/ai'
import { FaPause, FaPlay } from 'react-icons/fa'
import { ImLoop2, ImNext2, ImPrevious2 } from 'react-icons/im'


function AudioPlayer(props) {

    const [songDurationRange, setSongDurationRange] = React.useState('00:00 / 00:00')
    const [songDuration, setSongDuration] = React.useState(0)
    const [songCurrentTime, setSongCurrentTime] = React.useState(0)
    const [showVolumeTooltip, setShowVolumeTooltip] = React.useState(false)
    const [volumeValue, setVolumeValue] = React.useState(1)
    const [playSongIcon, setPlaySongIcon] = React.useState(<FaPause />)
    const [wasSongPlaying, setWasSongPlaying] = React.useState(false)
    const [loopIconStyle, setLoopIconStyle] = React.useState('outline')

    const audioTag = document.getElementById('audioTag')

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
        setVolumeValue(volume)
        audioTag.volume = volume
    }

    function togglePlaySong() {
        if (audioTag.src === 'http://localhost:3000/') {
            return
        }
        if (playSongIcon.type.name === 'FaPlay') {
            setPlaySongIcon(<FaPause />)
            audioTag.play()
        } else {
            setPlaySongIcon(<FaPlay />)
            audioTag.pause()
        }
    }

    function songDurationCurrentTimeUpdate() {
        setSongDurationRange(formatTime(audioTag.currentTime) + ' / ' + formatTime(audioTag.duration))
        setSongCurrentTime(audioTag.currentTime)
    }

    function songCurrentTimeChange(value) {
        audioTag.currentTime = value
        setSongCurrentTime(value)
    }

    function songDurationUpdate() {
        setSongDurationRange(formatTime(audioTag.currentTime) + ' / ' + formatTime(audioTag.duration))
        setSongDuration(audioTag.duration)
    }

    function toggleLoopAudio() {
        if (loopIconStyle === 'outline') {
            audioTag.loop = true
            setLoopIconStyle('solid')
        } else {
            audioTag.loop = false
            setLoopIconStyle('outline')
        }
    }

    function playSong() {
        setPlaySongIcon(<FaPause />)
    }

    function pauseSong() {
        setPlaySongIcon(<FaPlay />)
    }

    return (
        <>
            <Grid
                p={2}
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(3, 1fr)'
                gap={0}
            >
                <GridItem rowSpan={1} colSpan={1}>
                    <Center h='100%'>
                        {Object.keys(props.currentSongData).length !== 0 &&
                            <>
                            <Tag p={5} mr={5} colorScheme='green'>
                                {props.currentSongData.artist[0].name} : {props.currentSongData.name}
                            </Tag>
                                < Image src={props.currentSongData.album[0].image_url} boxSize='50px' borderRadius="full" />
                            </>
                        }
                    </Center>
                </GridItem>
                <GridItem rowSpan={1} colSpan={1}>
                    <Center h='100%'>
                        <IconButton
                            colorScheme='blue'
                            aria-label='Search database'
                            variant='outline'
                            icon={<ImPrevious2 />}
                        />
                        <IconButton
                            ml={2}
                            mr={2}
                            colorScheme='blue'
                            aria-label='Search database'
                            variant='outline'
                            icon={playSongIcon}
                            onClick={() => togglePlaySong()}
                        />
                        <IconButton
                            mr={2}
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
                    </Center>

                </GridItem>
                <GridItem rowSpan={1} colSpan={1}>
                    <Center h='100%'>
                        <Slider
                            w='50%'
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
                    </Center>

                </GridItem>

                <GridItem rowSpan={1} colSpan={3}>
                    <Center h='100%'>
                        <Tag
                            colorScheme="blue"
                        >
                            {songDurationRange.split('/')[0]}
                        </Tag>
                        <Slider
                            ml={2}
                            mr={2}
                            w='50%'
                            min={0}
                            max={songDuration}
                            step={0.001}
                            defaultValue={0}
                            value={songCurrentTime}
                            onChange={(v) => songCurrentTimeChange(v)}
                            onChangeStart={(v) => {
                                if (!audioTag.paused) {
                                    setWasSongPlaying(true)
                                }
                                audioTag.pause()
                            }}
                            onChangeEnd={(v) => {
                                if (wasSongPlaying) {
                                    audioTag.play()
                                    setWasSongPlaying(false)
                                }
                            }}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                        <Tag
                            colorScheme="blue"

                        >
                            {songDurationRange.split('/')[1]}
                        </Tag>
                    </Center>
                </GridItem>
            </Grid>

            <audio id='audioTag'
                src={props.songSrcUrl}
                autoPlay
                loop={false}
                onPlay={() => playSong()}
                onPause={() => pauseSong()}
                onDurationChange={() => songDurationUpdate()}
                onTimeUpdate={(v) => songDurationCurrentTimeUpdate(v)
                }
            />
        </>
    )
}

export default AudioPlayer