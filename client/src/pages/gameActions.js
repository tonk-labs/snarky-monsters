import Game from '../model/model';

export const ACTION_TYPES = {

}

export const playerSelectMonster = (dispatch, getState) => (monsterId) => {
    dispatch({
        payload: {
            playerState: {
                ...Game.Monsters[monsterId],
            }
        }
    })
    
    setTimeout(() => {
        // pretend we are making a call to the server and it takes 1 second
        // we get back from the server some randomness
        const randomness = "dc33caadab561027e1cfa5280a2f65656ad8ffb6bc779fccfec74aa673b97184";
        //now we need to convert this into our "random number and save it for later somehow",
        dispatch({
            payload: {
                npcState: {
                    ...Game.Monsters[Math.round(Math.random()*6)],
                },
                sessionID: "07554609-60f4-4edb-a6de-c7fab54f5b2b",
                randomness: Math.random() * 100 //pretend we already did the conversion
            }
        })
    }, 3000)

}