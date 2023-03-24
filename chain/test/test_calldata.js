const proof_bytes1 = "0x23a2fce227e671307942959835dd48a1a36f934b805f964d20e6f679aa18e5db2d41f4c6626693e8f40da3af12628f10b8c44da6dc96012b0df0b88bf5a0f94823ddead93b2f004895bdb9940cf7df4c8d988852ff5ff7b123553f3507db5fc8142e717e04563e82ff010ce994dc885a81896df23438cca5b12e91bc54a1ad9a113452b389168c2df22f9dc23372cd5c268d96112f9f8af0c8d19dc4a78dc34107cdd1869a1eb5c463023a5eea409b4ebfb606b0216f484739a06b6908199eae18a941daa471e75c33d77e7ec35a1212b735daad964208ab7820cb9a9710d7081ddfbbd30eef996f47a9d7fdd38e16d7bcef570aeec7afa984a51ff98317e61811a48b2306a38938a1737a525190dc45b2ec17613f61c15457ae6cbc8d2e741a0d381404afbe76f2bc437e2e0ad2c876791eabab0baa937a397f69fa568f99e402cb270600113ff5aeac481c74fcadae3caca0274225011e5d72986cd11ef2e7144dd93a2cddd04d882778afd29c929733feb796ef0514700dda1f611a63d0d11dcec13edd5b826109b19a174b6a4b262d82328447b1fdcacaf051877197467b20eee83a12657a5b8cd56e827a0028d315b118ac89458497dd8b68ad368881c7146d8b155c7d3577277a7c788d8d6d312f6aa7e017ceaac5111139c5fd708b3315a19e81a8460b93d4e8b75dc5c0b2517cf134c49d1c29aae8ae4ccfb7f725661a4c3c0785491b6dd94ac2142670700bd5e79bdc6fb524efee0982050e14637217aa21f11c944122fe52e4be89f4575cebb3f8cb66756749980e36eeadccd6be12a21535ef8e8fb0ccf0353e2b1d04b9638b9514d1533b5771181afda6f47def12ef9fc6f008f27401a2312609baedc21a05c5dccb070b286076bdc010d34dac2f71fee4fc58a5c0fb08d2d2d47c88317bf5523b0594bb8e5a25171cc17d990f0d4162fc2600f5a1309a69be609346923fe5603186d0d7b17079bcd5cfb73b4b28daadfe51b09ab7c7dc66fe2590335e77e79dcd7a209c48785c6a89a4d1f0630311930429f27470b7685018a08d18dac70bba7eaa44761d1e0a0062e3d6a9c1047a2cd9880c6a20fd88e4c0fb052aa3eb4b777d8d20c73816278177e1e7440d"
const public_bytes1 = ["0x23a49b527e3edf176a452573287ad25e7fac6a3506b15b8be3284f52b8c3a85d","0x00000000000000000000000000000000b55081fa9cd148c295d4efe2db322a54"];
const gameId1 = "0241008287272164729465721528295504357972";
// const gameHash1 = "16121784613732570431897151168924282937533843863475920913035944891340762097757";
const gameHash1 = "0x23a49b527e3edf176a452573287ad25e7fac6a3506b15b8be3284f52b8c3a85d"

const test1 = {
    gameId: gameId1,
    proof_bytes: proof_bytes1,
    public_bytes: public_bytes1,
    gameHash: gameHash1
}

module.exports = {
    test1
}