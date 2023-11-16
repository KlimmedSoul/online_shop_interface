import { abi } from './abi.js';
import Web3 from 'web3';

const CONTRACT_ADDRESS = "0x364540e8acD942729FB5F87Bb7f5A0D8bFddf70d";
const PORT = "http://127.0.0.1:7545";

let myContract, web3, accounts;


async function initializeWeb3() {
  web3 = new Web3(new Web3.providers.HttpProvider(PORT));
  myContract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
}

export async function registration(email, password, address) {
  try {
    await initializeWeb3(); 
    const convertedPassword = web3.utils.soliditySha3(password);
    const result = await myContract.methods.registration(email, convertedPassword).send({
      from: address,
      to: CONTRACT_ADDRESS,
      gas: 1000000,
    });
    window.location.href = "http://localhost:3000/buyer"
  } catch (err) {
    throw err;
  }
}

export async function upToAdmin(address, curAddress) {
  try {
    await initializeWeb3();
    const admin = await myContract.methods.up_to_admin(address).send({
      from: curAddress,
      to: CONTRACT_ADDRESS,
      gas: 100000
    });
    console.log(upToAdmin);
  } catch(e) {
    throw e;
  }
}


export async function getUserAddreses() {
    try {
        await initializeWeb3(); 
        const result = await myContract.methods.get_user_addreses().call({
          gas: 1000000
        });
        return result;
      } catch (err) {
        throw err;
      }
}

export async function getUserInfo(address, password) {
  try { 
    await initializeWeb3();
    const result = await myContract.methods.get_user_info(address).call({
      gas: 100000
    });

    const newInfo = {
      email: result.email,
      password: web3.utils.soliditySha3(password) == result.password ? true : false,
      role: Number(result.role)
    };

    return newInfo;

  } catch (e) {
    throw e;
  }
}

export async function getUserInfoLogin(address) {
    try { 
    await initializeWeb3();
    const result = await myContract.methods.get_user_info(address).call({
      gas: 100000
    });
    return result;

  } catch (e) {
    throw e;
  }
}


export async function getRequests() {
  try {
    await initializeWeb3();
    const result = await myContract.methods.get_requests().call({
    gas:1000000
  });
    return result
  } catch (e) {
    throw e;
  }
}

export async function acceptRequest(req_id, address) {
  try {
   await initializeWeb3();
   console.log(address);
   const result = await myContract.methods.request_accept(req_id).send({
    from: address,
    to: CONTRACT_ADDRESS,
    gas: 100000,
  })
    return result
  } catch(e) {
    throw e
  }
}

export async function rejectRequest(req_id, address) {
  try {
   await initializeWeb3();
   const result = await myContract.methods.request_reject(req_id).send({
    from: address,
    to: CONTRACT_ADDRESS,
    gas: 100000,
  })
    return result
  } catch(e) {
    throw e
  }
}