import { abi } from './abi.js';
import Web3 from 'web3';

const CONTRACT_ADDRESS = "0x914784b89Cb72C9E7D41F0302DAb9F9D8747406B";
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

export async function getUserRequest(userAddress) {
    try {
      await initializeWeb3();
      const result = await myContract.methods.get_user_request(userAddress).call({
        gas:100000
      });
      return result;
    } catch (e) {

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
  } catch(e) {
    throw e;
  }
}

export async function sendRequest(userAddress) {
  try {
    await initializeWeb3();
    await myContract.methods.send_request().send({
      from: userAddress,
      to: CONTRACT_ADDRESS,
      gas: 1000000
    });
  } catch (e) {
    throw e;
  }
}

export async function addShop(admAddress, shopAddress, town, password) {
  try {
    await initializeWeb3();
    const newPassword = web3.utils.soliditySha3(password);
    console.log();
    const newShop = await myContract.methods.create_shop(shopAddress, town, newPassword).send({
      from: admAddress,
      to:CONTRACT_ADDRESS,
      gas: 1000000
    });
    console.log(newShop);
  } catch (e) {
    throw e;
  }

}


export async function removeSeller(admAddress, sellerId, shopAddress) {

  try {
    const remove = await myContract.methods.remove_seller(shopAddress, sellerId).send({
      from: admAddress,
      to: CONTRACT_ADDRESS, 
      gas: 3000000,
    })
  } catch (e) {
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

export async function removeShop(admAddress, shopAddress) {
  try {
    await initializeWeb3();
    const res = await myContract.methods.remove_shop(shopAddress).send({
      from: admAddress,
      to: CONTRACT_ADDRESS,
      gas: 100000
    })
  } catch (e) {
    throw e;
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

export async function getAllShops() {
  try {
    await initializeWeb3();
    const allShopAddresses = await myContract.methods.get_shop_addreses().call({
      gas: 100000
    });
    if (!allShopAddresses) {
      return false;
    }
    const allShops = [];

    for (let i = 0; i < allShopAddresses.length; i++) {
      console.log(allShopAddresses[i]);
      let shop = await myContract.methods.get_shop_info(allShopAddresses[i]).call({
        gas: 100000
      })
      let newShop = {
        address: allShopAddresses[i],
        town: shop.town,
        sellers: shop.sellers
      }

      allShops.push(newShop);
    }

    return allShops
  } catch (e) {
    throw e;
  }
}

export async function addSeller(shopAddress, sellerAddress, admAddress) {
  try {
    await initializeWeb3();
    const addSeller = await myContract.methods.add_seller(shopAddress, sellerAddress).send({
      from:admAddress,
      to: CONTRACT_ADDRESS,
      gas: 100000
    }) 

    return addSeller;
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