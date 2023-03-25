const { buildMimc7 } = require('circomlibjs')
const CryptoJS = require('crypto-js')

/**
 * For (i = 0; i < NMoves; i++) {
    Hash(State_i), Hash(Randomness_i), Hash(Move_i), Hash(AttackEff_i), Hash(DefEff_i)
}

Hash(State_N+1) //hash the final state object

 */
// Convert a hex string to a byte array
function hexToBytes(hex) {
  let bytes = []
  for (let c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16))
  return bytes
}

/**
 *
 * @param {*} list
 * @returns
 */
function intsToHex(list) {
  var result = []
  for (var i = 0; i < list.length; i++) {
    result.push(list[i].toString(16))
  }
  return result.join('')
}

/**
 *
 * @param {string} seed
 * @returns
 */
const createEncryptedSecret = (seed) => {
    const key = CryptoJS.lib.WordArray.random(16).toString();
    const randomness = seed ? seed : generateRandomness();    
    const encrypted = CryptoJS.AES.encrypt(randomness, key, { format: JsonFormatter })

    return {
        ciphertext: encrypted.toString(CryptoJS.enc.JSON),
        key,
    }
}

/**
 * Why in the hell does enc as hex return utf8 representation of hex
 * whereas when I encode as hex on the decryption it's completely different representation
 * idk
 * @returns random hex string
 */
const generateRandomness = () =>
  CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex)

/**
 *
 * @param {*} key
 * @param {*} encrypted
 * @param {*} opts //Utf8 is the string representation of the hex because... see above
 * @returns
 */
const decryptSecret = (key, encrypted, opts = { enc: CryptoJS.enc.Utf8 }) => {
    return CryptoJS.AES.decrypt(encrypted, key, { format: JsonFormatter }).toString(opts.enc);
}

/**
 * there is a specific ordering that needs to be enforced here for the gameHash to be
 * consistent across client and server
 *
 * @param {*} randomness1  contribution from the source
 * @param {*} randomness2  contribution from the target
 * @returns
 */
const calculateCombinedRandomness = (randomness1, randomness2) => {
  return Math.abs(CryptoJS.SHA256(randomness1 + randomness2).words[0]) % 101
}

/**
 * Creates mimc hash of an array and represents it in a way
 * to agree with the circom hash code
 * @param {*} arr
 * @returns
 */
const mimcHashArray = async (arr) => {
  const mimc7 = await buildMimc7()
  const hash = mimc7.multiHash(arr, 0)
  return BigInt(mimc7.F.toObject(hash)).toString()
}

/**
 * Convenience function for hashing from the engine of the game
 * Outputs the MiMC Multihash of the game state necessary for the circuit input
 * @param {*} engine The engine should hold a completed game state.
 */
const hashGameState = (engine) => {
  let gameArray = []
  for (var i = 0; i < engine.moveLimit; i++) {
    const ithState = engine.previousState[i]
    const ithMove = engine.previousMoves[i]

    const encoding = [
      ithState.player.id,
      ithState.player.hp,
      ithState.player.stats.attack,
      ithState.player.stats.defense,
      ithState.player.category,
      ithState.npc.id,
      ithState.npc.hp,
      ithState.npc.stats.attack,
      ithState.npc.stats.defense,
      ithState.npc.category,
      engine.prevRandomness[i],
      ithMove.id,
      ithMove.attack,
      ithMove.crit,
      ithMove.miss,
      ithMove.category,
      ithMove.type,
      engine.prevAtkEff[i],
      engine.prevDefEff[i],
    ].reduce((prev, current) => {
      return prev + current.toString()
    })

    gameArray.push(BigInt(encoding))
  }

  const encoding = [
    engine.player.id,
    engine.player.hp,
    engine.player.stats.attack,
    engine.player.stats.defense,
    engine.player.category,
    engine.npc.id,
    engine.npc.hp,
    engine.npc.stats.attack,
    engine.npc.stats.defense,
    engine.npc.category,
  ].reduce((prev, current) => {
    return prev + current.toString()
  })

  gameArray.push(BigInt(encoding))

  return mimcHashArray(gameArray)
}

const JsonFormatter = {
    stringify: function(cipherParams) {
      // create json object with ciphertext
      var jsonObj = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
      // optionally add iv or salt
      if (cipherParams.iv) {
        jsonObj.iv = cipherParams.iv.toString();
      }
      if (cipherParams.salt) {
        jsonObj.s = cipherParams.salt.toString();
      }
      // stringify json object
      return JSON.stringify(jsonObj);
    },
    parse: function(jsonStr) {
      // parse json string
      var jsonObj = JSON.parse(jsonStr);
      // extract ciphertext from json object, and create cipher params object
      var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
      });
      // optionally extract iv or salt
      if (jsonObj.iv) {
        cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
      }
      if (jsonObj.s) {
        cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
      }
      return cipherParams;
    }
  };

module.exports = {
  hashGameState,
  mimcHashArray,
  createEncryptedSecret,
  decryptSecret,
  calculateCombinedRandomness,
  generateRandomness,
}

// const engine = new Engine(2,3,25);

// for (var i =0; i < engine.moveLimit; i++) {
//     engine.turn(Model.Moves[Model.Moves.length - 1], 0);
// }

// hashGameState(engine).then((result) => console.log(result))
