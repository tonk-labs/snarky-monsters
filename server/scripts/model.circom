pragma circom 2.1.4;

// f(type -> type) testing if first type is effective against second
function effectivenessAgainst(t1, t2) {

  // values of effectiveness for each class of character
  // sort of a psuedo matrix

  var degen[7] = [1, 0, 3, 2, 1, 1, 1];
  var reg[7] =   [3, 1, 1, 2, 1, 0, 1];
  var vc[7] =    [0, 1, 1, 1, 3, 2, 1];
  var norm[7] =  [1, 1, 2, 1, 1, 3, 0];
  var agi[7] =   [1, 2, 0, 1, 1, 1, 3];
  var btcm[7] =  [1, 3, 1, 0, 1, 1, 2];
  var mm[7] =    [1, 2, 1, 3, 0, 1, 1];

  if (t1 == 1) {
    return degen[t2 - 1];

  } else if (t1 == 2) {
    return reg[t2 - 1];

  } else if (t1 == 3) {
    return vc[t2 - 1];

  } else if (t1 == 4) {
    return norm[t2 - 1];

  } else if (t1 == 5) {
    return agi[t2 - 1];

  } else if (t1 == 6) {
    return btcm[t2 - 1];

  } else if (t1 == 7) {
    return mm[t2 - 1];

  } else {
    return -1;
  }
}

function getMonsterForId(i) {
  var Monsters[35] = [
		1, 100, 10, 10, 1,
		2, 100, 10, 10, 2,
		3, 100, 10, 10, 3,
		4, 100, 10, 10, 4,
		5, 100, 10, 10, 5,
		6, 100, 10, 10, 6,
		7, 100, 10, 10, 7
];


  var monster[5];
  var index = i*5;
  monster[0] = Monsters[index];
  monster[1] = Monsters[index+1];
  monster[2] = Monsters[index+2];
  monster[3] = Monsters[index+3];
  monster[4] = Monsters[index+4];

  return monster;
}

function getMoveForId(i) {
  var Moves[102] = [
		0, 0, 0, 20, 0, 0,
		1, 10, 2, 10, 0, 1,
		2, 10, 2, 0, 0, 2,
		3, 10, 2, 10, 1, 2,
		4, 10, 2, 10, 1, 2,
		5, 10, 2, 10, 2, 2,
		6, 10, 2, 10, 2, 2,
		7, 10, 2, 10, 3, 2,
		8, 10, 2, 10, 3, 2,
		9, 10, 2, 10, 4, 2,
		10, 10, 2, 10, 4, 2,
		11, 10, 2, 10, 5, 2,
		12, 10, 2, 10, 5, 2,
		13, 10, 2, 10, 6, 2,
		14, 10, 2, 10, 6, 2,
		15, 10, 2, 10, 7, 2,
		16, 10, 2, 10, 7, 2
];
  var move[6];
  var index = i*6;
  move[0] = Moves[index];
  move[1] = Moves[index+1];
  move[2] = Moves[index+2];
  move[3] = Moves[index+3];
  move[4] = Moves[index+4];
  move[5] = Moves[index+5];

  return move;
}
