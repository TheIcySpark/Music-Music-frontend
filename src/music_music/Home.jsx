import React from 'react'
import Login from './Login'
import MusicPlayer from './MusicPlayer'

function Home(props) {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)

    if(isLoggedIn || localStorage.getItem('Token') != null){
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