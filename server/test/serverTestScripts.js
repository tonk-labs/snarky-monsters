const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8080/api',
    timeout: 1000,
});

const Model = require('../src/model');

const testInitialPlayer = () => {
    instance.post('/play', {
        playerState: Model.Monsters[0],
    }).then((response) => {
        const { gameId } = response.data;
        instance.get(`/play/${gameId}`).then((getr) => {
            console.log(getr.data);
        });
    });
}

testInitialPlayer();
