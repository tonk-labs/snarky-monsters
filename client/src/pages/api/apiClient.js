const SERVER_URL = 'http://0.0.0.0:8080'

const GET_HELLO_WORLD = `${SERVER_URL}/api`

// this is a file to communicate with the server
export const helloWorld = async () => {
    const response = await fetch(GET_HELLO_WORLD)
    const data = await response.json()
    console.log(data)
}

