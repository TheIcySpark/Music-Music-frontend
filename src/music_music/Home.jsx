import React, { useEffect } from 'react'
import Login from './Login'
import MusicPlayer from './MusicPlayer'

function Home(props) {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)

    if(isLoggedIn){
        return(
            <MusicPlayer setIsLoggedIn={setIsLoggedIn}/>
        )
    }else{
        return (
            <Login setIsLoggedIn={setIsLoggedIn}/>
        )
    }
}

export default Home