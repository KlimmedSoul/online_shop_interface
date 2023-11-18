// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2;
contract Store {
    // role = 1 - buyer, 2 - seller, 3 - admin
    struct User {
        string email;
        bytes32 password;
        uint role;
    }

    struct Shop {
        string town;
        bytes32 password;
        address[] sellers; 
    }

    struct Comment {
        address shop_address;
        address user;
        string text;
        // кол-во лайков
        uint likes;
        uint dislikes;
        // оценка пользователя
        uint rating; 
        // те кто оценили пост
        address[] users;
    }

    struct Request {
        address user_address;
        uint date;
        // default - false
        uint role;
        bool done;
        bool accepted;  
    }

    Request[] requests;

    mapping(address => User) users;
    address[] user_addresses;

    mapping(address => Shop) shops;
    address[] shop_addresses;
    Comment[] all_comments;
    constructor() {
        // LOLOLOL
        users[0x73E9373b8a127B12e98fbDB8a9Fa6B0A92B9B9DB] = User("putin@mail.ru", 0xd19b1daae14f69657db836ab6f51534a23d83d05fd3c2a7c7d6eaa6ab0b7237b, 3);
        user_addresses.push(0x73E9373b8a127B12e98fbDB8a9Fa6B0A92B9B9DB);

        users[0x8ed14B0992Ea1a5BC062e9C8bE6711F7B03602FB] = User("biden@mail.ru", 0xd19b1daae14f69657db836ab6f51534a23d83d05fd3c2a7c7d6eaa6ab0b7237b, 2);
        user_addresses.push(0x8ed14B0992Ea1a5BC062e9C8bE6711F7B03602FB);

        users[0xee88DDB262aE315036b1BE67fbd46d9B77A05870] = User("biden1@mail.ru", 0xd19b1daae14f69657db836ab6f51534a23d83d05fd3c2a7c7d6eaa6ab0b7237b, 2);
        user_addresses.push(0xee88DDB262aE315036b1BE67fbd46d9B77A05870);

        users[0xD95AE5b99A535bc5edF8FB4637eD94b703ebec8A] = User("obama@mail.ru", 0xd19b1daae14f69657db836ab6f51534a23d83d05fd3c2a7c7d6eaa6ab0b7237b, 1);
        user_addresses.push(0xD95AE5b99A535bc5edF8FB4637eD94b703ebec8A);

        users[0xe7b351c07d28507227B0E7fBA05D6c99a20f0eF3] = User("simba@mail.ru", 0xd19b1daae14f69657db836ab6f51534a23d83d05fd3c2a7c7d6eaa6ab0b7237b, 1);
        user_addresses.push(0xe7b351c07d28507227B0E7fBA05D6c99a20f0eF3);

        address[] memory _sellers = new address[](1);
        _sellers[0] = 0x8ed14B0992Ea1a5BC062e9C8bE6711F7B03602FB;
        shops[0xe232dc2072D64b7EF59dEe6cbaCF0c99edDA96Fa] = Shop("Kaluga",  0xd19b1daae14f69657db836ab6f51534a23d83d05fd3c2a7c7d6eaa6ab0b7237b, _sellers);
        shop_addresses.push(0xe232dc2072D64b7EF59dEe6cbaCF0c99edDA96Fa);

        requests.push(Request(0x8ed14B0992Ea1a5BC062e9C8bE6711F7B03602FB, 1700061348, 2, true, true));
        requests.push(Request(0x8ed14B0992Ea1a5BC062e9C8bE6711F7B03602FB, 1700061348, 1, false, false));
        requests.push(Request(0xD95AE5b99A535bc5edF8FB4637eD94b703ebec8A, 1700061348, 2, true, false));
        requests.push(Request(0xe7b351c07d28507227B0E7fBA05D6c99a20f0eF3, 1700061348, 2, false, false));
    }

    function registration(string memory user_email, bytes32 user_password) public {
        for(uint i = 0; i < user_addresses.length; i++) {
            require(user_addresses[i] != msg.sender, "u already registered");
            require(keccak256(abi.encodePacked(users[user_addresses[i]].email)) != keccak256(abi.encodePacked(user_email)), "email already registered");
        }
        users[msg.sender] = User(user_email, user_password, 1);
        user_addresses.push(msg.sender);
    }

    function up_to_admin(address user_address) public {
        require(users[msg.sender].role == 3);
        require(users[user_address].role != 3, "user alredy admin");
        bool flag = false;
        for(uint i = 0; i < user_addresses.length; i++) {
            if(user_addresses[i] == user_address) {
                flag = true;
            }
        }
        require(flag, "user does not exist");

        users[user_address].role = 3;
    }

    // заявка на повышение и понижение 
    function send_request() public  {
        require(users[msg.sender].role != 3, "admin can't make a request");
        for (uint i = 0; i < requests.length; i++) {
            if(requests[i].user_address == msg.sender) {
                require(requests[i].done == true, "u already sended request");
            }
        }
        if(users[msg.sender].role == 1) {
            requests.push(Request(msg.sender, block.timestamp, 2, false, false));
        } else {
            requests.push(Request(msg.sender, block.timestamp, 1, false, false));
        }
    }


    function request_accept(uint request_id) public  {
        require(users[msg.sender].role == 3, "u aren't a admin");
        require(requests[request_id].done == false, "request already done");
        if(users[requests[request_id].user_address].role == 1) {
            // делаем продавцом
            users[requests[request_id].user_address].role = 2;
        } else if(users[requests[request_id].user_address].role == 2) {
            // делаем покупателем
            users[requests[request_id].user_address].role = 1;
        }

        requests[request_id].done = true;
        requests[request_id].accepted = true;
    }
    

    function request_reject(uint request_id) public {
        require(users[msg.sender].role == 3, "u aren't a admin");
        require(requests[request_id].done == false, "request already done");
 
        requests[request_id].done = true;
        requests[request_id].accepted = false;
        
    }

    function remove_shop(address shop_address) public  {
        require(users[msg.sender].role == 3, "u aren't admin");
        require(keccak256(abi.encodePacked(shops[shop_address].town)) != keccak256(abi.encodePacked("")), "the shop doesn't exist");
        delete shops[shop_address];
        uint index;
        for(uint i = 0; i < shop_addresses.length; i++) {
            if (shop_addresses[i] == shop_address) {
                index = i;
            }
        }
        for (uint i = index; i < shop_addresses.length - 1; i++) {
            shop_addresses[i] = shop_addresses[i + 1];
        }
        shop_addresses.pop();
    }

    function create_shop(address shop_address, string memory town, bytes32 password) public {
        require(users[msg.sender].role == 3, "u aren't admin");
        for (uint i = 0; i < shop_addresses.length; i++ ) {
            require(shop_addresses[i] != shop_address, "shop already registered");
        }

        address[] memory _sellers;
        shops[shop_address] = Shop(town, password, _sellers);
    }

    function remove_seller(address shop_address, uint index) public {
        require(users[msg.sender].role == 3, "u aren't admin");
        for(uint i = index; i < shops[shop_address].sellers.length - 1; i++) {
            shops[shop_address].sellers[i] = shops[shop_address].sellers[i + 1];
        }
        shops[shop_address].sellers.pop();
    }

    function add_seller(address shop_address, address seller_address) public {
        require(users[seller_address].role == 2, "user aren't seller");
        require(users[msg.sender].role == 3, "u aren't admin");
        for(uint i = 0; i < shops[shop_address].sellers.length; i++) {
            require(shops[shop_address].sellers[i] != shop_address, "seller already registered");
        }
        shops[shop_address].sellers.push(seller_address);
    }



    function add_comment(address _shop_address, string memory _text, uint _rating) public {
        require(users[msg.sender].role != 3, "admin can't comment");
        require(keccak256(abi.encodePacked(shops[_shop_address].town)) != keccak256(abi.encodePacked("")), "the shop doesn't exist");
        require(keccak256(abi.encodePacked(_text)) != keccak256(abi.encodePacked("")), "message empty");
        address[] memory users_comment;
        all_comments.push(Comment(_shop_address, msg.sender, _text, 0, 0, _rating, users_comment));
    }

    function rate_comment(uint comment_id, bool rate) public {
        require(keccak256(abi.encodePacked(users[msg.sender].email)) != keccak256(abi.encodePacked("")), "u aren't registered");
        for(uint i = 0; i < all_comments[comment_id].users.length; i++) {
            require(all_comments[comment_id].users[i] != msg.sender, "u already rate this comment");
        }
        if (rate) {
            all_comments[comment_id].likes += 1;
        } else {
            all_comments[comment_id].dislikes += 1;
        }

        all_comments[comment_id].users.push(msg.sender);
    }

    function getComments() public view returns(Comment[] memory) {
        return all_comments;
    }

    function get_user_addreses() public view returns(address[] memory) {
        return user_addresses;
    }

    function get_shop_addreses() public view returns(address[] memory) {
        return shop_addresses;
    }

    function get_requests() public view returns(Request[] memory) {
        return requests;
    }

    function get_shop_info(address shop_address) public view returns(Shop memory) {
        return shops[shop_address];
    }

    function get_user_info(address user_address) public view returns (User memory) {
        return users[user_address];
    }

}
