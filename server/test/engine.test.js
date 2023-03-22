const Engine = require('../src/engine');
const model = require('../src/model');

test('initializes engine', () => {
    const engine = new Engine(model.Category.DEGEN, model.Category.AGI, 25);

    expect(engine.player.category).toBe(model.Category.DEGEN);
    expect(engine.npc.category).toBe(model.Category.AGI);
    expect(engine.moveLimit).toBe(25);
});

test('swap success', () => {
    const engine = new Engine(model.Category.VC, model.Category.BITCOIN_MAXI, 25);

    const move = model.Moves[0];
    move.category = model.Category.AGI;
    engine.turn(move, 60);

    expect(engine.player.category).toBe(model.Category.AGI)

    expect(engine.previousMoves.length).toBe(1);
    expect(engine.previousState.length).toBe(1);
    expect(engine.prevAtkEff.length).toBe(1);
    expect(engine.prevDefEff.length).toBe(1);
    expect(engine.prevRandomness.length).toBe(1);
})

test('swap miss', () => {
    const engine = new Engine(model.Category.VC, model.Category.BITCOIN_MAXI, 25);

    let move = model.Moves[0];
    move.category = model.Category.AGI;
    engine.turn(move, 10);

    expect(engine.player.category).toBe(model.Category.VC);
})

test('heal success', () => {
    const engine = new Engine(model.Category.REGULATOR, model.Category.MOON_MATHER, 25);

    engine.player.hp += -20;

    let move = model.Moves[1];
    engine.turn(move, 30);

    expect(engine.player.hp).toBe(90);
    expect(engine.previousMoves.length).toBe(1);
    expect(engine.previousState.length).toBe(1);
    expect(engine.prevAtkEff.length).toBe(1);
    expect(engine.prevDefEff.length).toBe(1);
    expect(engine.prevRandomness.length).toBe(1);
})

test('heal miss', () => {
    const engine = new Engine(model.Category.REGULATOR, model.Category.MOON_MATHER, 25);

    engine.player.hp += -20;

    let move = model.Moves[1];
    engine.turn(move, 10);//also tests leq condition

    expect(engine.player.hp).toBe(80);
})

test('dmg success', () => {
    const engine = new Engine(model.Category.REGULATOR, model.Category.MOON_MATHER, 25);

    let move = model.Moves[5];
    engine.turn(move, 65);//also tests leq condition

    expect(engine.npc.hp).toBe(85);
    expect(engine.previousMoves.length).toBe(1);
    expect(engine.previousState.length).toBe(1);
    expect(engine.prevAtkEff.length).toBe(1);
    expect(engine.prevDefEff.length).toBe(1);
    expect(engine.prevRandomness.length).toBe(1);
})

test('dmg miss', () => {
    const engine = new Engine(model.Category.REGULATOR, model.Category.MOON_MATHER, 25);

    let move = model.Moves[4];
    engine.turn(move, 10);

    expect(engine.npc.hp).toBe(100);
})

test('dmg with crit', () => {
    const engine = new Engine(model.Category.REGULATOR, model.Category.MOON_MATHER, 25);

    let move = model.Moves[5];
    engine.turn(move, 98);

    expect(engine.npc.hp).toBe(65);
})

test('dmg with super effectiveness', () => {
    const engine = new Engine(model.Category.REGULATOR, model.Category.DEGEN, 25);

    let move = model.Moves[4];
    engine.turn(move, 50);

    expect(engine.npc.hp).toBe(72);
})

test('dmg against super effective opponent', () => {
    const engine = new Engine(model.Category.REGULATOR, model.Category.BITCOIN_MAXI, 25);

    let move = model.Moves[4];
    engine.turn(move, 50);

    expect(engine.npc.hp).toBe(100);
})

test('dmg with very effectiveness', () => {
    const engine = new Engine(model.Category.REGULATOR, model.Category.NORMIE, 25);

    let move = model.Moves[4];
    engine.turn(move, 50);

    expect(engine.npc.hp).toBe(85);
})

test('dmg with crit and super effectiveness', () => {
    const engine = new Engine(model.Category.REGULATOR, model.Category.DEGEN, 25);

    let move = model.Moves[5];
    engine.turn(move, 98);

    expect(engine.npc.hp).toBe(22);
})

test('test weird dmg edge case', () => {
    const engine = new Engine(model.Category.BITCOIN_MAXI, model.Category.DEGEN, 25);

    let move = model.Moves[13];
    engine.turn(move, 98);

    expect(engine.npc.hp).toBe(65);
})

test('test weird edge case 2', () => {
    const engine = new Engine(model.Category.VC, model.Category.DEGEN, 25);

    engine.npc.hp -= 10;

    let move = model.Moves[7];
    engine.turn(move, 65);

    expect(engine.npc.hp).toBe(90);
})
