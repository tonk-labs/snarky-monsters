var hp = 10;

moves = {
    attack: {
        points: -2,
        success: 0.8
    },
    heal: {
        points: +2,
        success: 0.4
    }
}

struct State {
    player: {
        hp,
        moves
    },
    npc: {
        hp,
        moves
    }
}

struct Move {
    // false means its the player, true means its the npc
    agent: bool,
    // name of the move to execute
    name: String,
    // a number between 0 and 100
    randomness: int
}

function executeMove(move: Move, s: State) -> State {
    const success = moves[move.name] > move.randomness;
    if (!success) {
        return s;
    }
    ns = s.copy();
    switch (move.name): {
        case attack: {
            move.agent ? ns.npc.hp += moves[move.name].points : ns.player.hp += moves[move.name].points
        }
        case heal: {
            move.agent ? ns.npc.hp += moves[move.name].points : ns.player.hp += moves[move.name].points
        }
    }

    return ns;
}