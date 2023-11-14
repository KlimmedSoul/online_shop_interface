import { abi } from './abi.js';
import Web3 from 'web3';

const CONTRACT_ADDRESS = "0x92fFE9522CEf266E9FbADbA5e05Ea35D1B2ebef8";
const PORT = "http://127.0.0.1:7545";

let myContract, web3, accounts;


async function initializeWeb3() {
  web3 = new Web3(new Web3.providers.HttpProvider(PORT));
  myContract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
  accounts = await web3.eth.getAccounts();
  return accounts;
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
    console.log(result);
    window.location.href = "http://localhost:3000/buyer"
  } catch (err) {
    throw err;
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
