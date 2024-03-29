import React, { useEffect} from 'react'
import logo from './static/logo.svg'
import {
    ChakraProvider,
    Container,
    Input,
    Center,
    Image,
    Text,
    Button,
    Tag,
    Link,
    useToast
} from '@chakra-ui/react'
import CreateAccount from './CreateAccount'

function Login(props) {
    const toast = useToast()
    const [createAccount, setCreateAccount] = React.useState(false)

    useEffect(() => {
        if (localStorage.getItem('Token') !== null) {
            props.setIsLoggedIn(true)
        }
    }, [])

    function getAuthToken(username, password) {
        fetch('http://localhost:8000/api/auth/token/login', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response)
                if (response.status !== 200) {
                    toast({
                        title: 'Credentials not found',
                        description: "Please check your provided data",
                        status: 'error',
                        duration: 3000,
                        position: 'top-right',
                        isClosable: true,
                    })
                    return
                }
                return response.json()
            })
            .then((response) => {
                if (response.auth_token === undefined) {
                    return
                }
                localStorage.setItem('Token', 'Token ' + response.auth_token)
                props.setIsLoggedIn(true)
            })
    }

    if (!createAccount) {
        return (
            <ChakraProvider resetCSS>
                <Container p={5}>
                    <Center>
                        <Image src={logo} height="200px" width="200px" />
                    </Center>
                    <Center>
                        <Text>Login</Text>
                    </Center>
                    <Tag mt={2} mb={1}>Username</Tag>
                    <Input variant="filled" id='usernameInput' />
                    <Tag mt={2} mb={1}>Password</Tag>
                    <Input type={"password"} variant="filled" mt={1} id='passwordInput' />
                    <Center>
                        <Button
                            mt={2}
                            variant="solid"
                            size="md"
                            onClick={() => getAuthToken(document.getElementById('usernameInput').value, document.getElementById('passwordInput').value)}
                        >
                            Login
                        </Button>
                    </Center>
                    <Link onClick={() => {
                        setCreateAccount(true)
                    }
                    }>
                        Don't have an account?
                    </Link>
                </Container>
            </ChakraProvider>
        )
    } else {
        return (
            <CreateAccount setCreateAccount={setCreateAccount} />
        )
    }
}

export default Login