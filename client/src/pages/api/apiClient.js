const SERVER_URL = 'http://0.0.0.0:8080'

const POST_PLAY = `${SERVER_URL}/api/play`
const POST_COMMIT = `${SERVER_URL}/api/battle/commit`
const POST_OPEN = `${SERVER_URL}/api/battle/open`

const sendPost = (url, data) => {
    return fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
}

export const playGame = async (playerState) => { 
    const response = await sendPost(POST_PLAY, { playerState })
    const data = await response.json();
    return {
        ...data,
    }
}

export const commitPlayerMove = async (playerMove, commitRandomness, gameId) => {
    const response = await sendPost(POST_COMMIT, { playerMove, commitRandomness, gameId })
    const data = await response.json();
    return {
        ...data,
    }
}

export const openPlayerMove = async (key, gameId) => {
    const response = await sendPost(POST_OPEN, { key, gameId })
    const data = await response.json();
    return {
        ...data,
    }
}

export const commitNpcMove = async (gameId) => {
    const response = await sendPost(POST_COMMIT, { gameId })
    const data = await response.json();
    return {
        ...data,
    }
}

export const openNpcMove = async (randomness, gameId) => {
    const response = await sendPost(POST_OPEN, { randomness, gameId })
    const data = await response.json();
    return {
        ...data,
    }
}