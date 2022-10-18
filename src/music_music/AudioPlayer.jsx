import { Box, IconButton, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tag, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { AiFillSound } from 'react-icons/ai'
import { FaPause, FaPlay } from 'react-icons/fa'
import { ImLoop2, ImNext2, ImPrevious2 } from 'react-icons/im'


function AudioPlayer(props) {

    const [songDurationRange, setSongDurationRange] = React.useState('00:00 / 00:00')
    const [showVolumeTooltip, setShowVolumeTooltip] = React.useState(false)
    const [volumeValue, setVolumeValue] = React.useState(1)
    const [playSongIcon, setPlaySongIcon] = React.useState(<FaPause />)
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

    function songDurationRangeChanged() {
        setSongDurationRange(formatTime(audioTag.currentTime) + ' / ' + formatTime(audioTag.duration))
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
                src={props.songSrcUrl}
                controls
                autoPlay
                loop={true}
                onPlay={() => playSong()}
                onPause={() => pauseSong()}
                onDurationChange={() => songDurationRangeChanged()}
                onTimeUpdate={() => songDurationRangeChanged()}
            />
        </>
    )
}

export default AudioPlayer