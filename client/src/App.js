import React, { useEffect, useState } from 'react';
import { ethers, Contract, toNumber } from 'ethers';
import logo from './logo.svg';
import abi from "./utils/test.json";
import './App.css';

const getEthereumObject = () => window.ethereum;

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    /*
    * First make sure we have access to the Ethereum object.
    */
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};


function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "CHANGE_TO_ADDRESS_LATER";

   /**
   * Create a variable here that references the abi content!
   */
   const contractABI = abi.abi;

  const disconnectWallet = () => {
    setCurrentAccount();
  }
  const connectWallet = () => {
    const connect = async () => {
        try {
          const ethereum = getEthereumObject();
          if (!ethereum) {
            alert("Get MetaMask!");
            return;
          }

          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });

          console.log("Connected", accounts[0]);
          setCurrentAccount(accounts[0]);
        } catch (error) {
          console.error(error);
        }
      };
    connect();
  }

  const bump = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.JsonRpcProvider("http://localhost:8545");
        const signer = await provider.getSigner();
        const wavePortalContract = new Contract(contractAddress, contractABI, signer);

        provider.getNetwork().then((network) => {
          console.log(network.toJSON())
        });

        let count = await wavePortalContract.getTotalBumps();
        console.log("Retrieved total wave count...", toNumber(count));

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.bump();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalBumps();
        console.log("Retrieved total wave count...", toNumber(count));
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}

  /*
   * This runs our function when the page loads.
   * More technically, when the App component "mounts".
   */
  useEffect(() => {
    const findMetaMask = async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setCurrentAccount(account);
      }
    }
    findMetaMask();
  }, []);
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
             {/*
         * If there is no currentAccount render this button
         */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {currentAccount && (
          <button className="waveButton" onClick={disconnectWallet}>
            Disconnect
          </button>
        )}

        <button onClick={bump}>Bump</button>
      </header>
    </div>
  );
}

export default App;
