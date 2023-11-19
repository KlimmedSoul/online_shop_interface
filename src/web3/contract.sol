// SPDX-License-Identifier: GPL-5.0

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

    struct Grade {
        uint rating;
        string text;
        address user_address;
        address shop_address;
        uint likes;
        uint dislikes;
        // те кто оценили пост
        address[] users;

        // address[] com_users;
        // string[] com_texts;
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
    Grade[] all_grades;
    mapping(address => User) users;
    address[] user_addresses;

    mapping(address => Shop) shops;
    address[] shop_addresses;
    constructor() {
        // LOLOLOL
        users[0x0A6fc465Df91653551bA827983B67F35E55Ba828] = User("putin@mail.ru", 0xd19b1daae14f69657db836ab6f51534a23d83d05fd3c2a7c7d6eaa6ab0b7237b, 3);
        user_addresses.push(0x0A6fc465Df91653551bA827983B67F35E55Ba828);

        users[0xb715DcB369bfE33707c6d67d499c165791407476] = User("biden@mail.ru", 0xd19b1daae14f69657db836ab6f51534a23d83d05fd3c2a7c7d6eaa6ab0b7237b, 2);
        user_addresses.push(0xb715DcB369bfE33707c6d67d499c165791407476);

        users[0xb715DcB369bfE33707c6d67d499c165791407476] = User("biden1@mail.ru", 0xd19b1daae14f69657db836ab6f51534a23d83d05fd3c2a7c7d6eaa6ab0b7237b, 2);
        user_addresses.push(0xb715DcB369bfE33707c6d67d499c165791407476);

        users[0xBD5Dabab7C1006c4eD857babEeCeCD23922401e6] = User("obama@mail.ru", 0xd19b1daae14f69657db836ab6f51534a23d83d05fd3c2a7c7d6eaa6ab0b7237b, 1);
        user_addresses.push(0xBD5Dabab7C1006c4eD857babEeCeCD23922401e6);

        users[0xB28B12625E23d51Df16614898c453b2f37cEa37c] = User("simba@mail.ru", 0xd19b1daae14f69657db836ab6f51534a23d83d05fd3c2a7c7d6eaa6ab0b7237b, 1);
        user_addresses.push(0xB28B12625E23d51Df16614898c453b2f37cEa37c);

        address[] memory _sellers = new address[](1);
        _sellers[0] = 0xb715DcB369bfE33707c6d67d499c165791407476;
        shops[0xcA0DBfd5bC05324A6A8768d4438A152395746268] = Shop("Kaluga",  0xd19b1daae14f69657db836ab6f51534a23d83d05fd3c2a7c7d6eaa6ab0b7237b, _sellers);
        shop_addresses.push(0xcA0DBfd5bC05324A6A8768d4438A152395746268);

        requests.push(Request(0xb715DcB369bfE33707c6d67d499c165791407476, 1700061348, 2, true, true));
        requests.push(Request(0xb715DcB369bfE33707c6d67d499c165791407476, 1700061348, 1, false, false));
        requests.push(Request(0xBD5Dabab7C1006c4eD857babEeCeCD23922401e6, 1700061348, 2, true, false));
        requests.push(Request(0xB28B12625E23d51Df16614898c453b2f37cEa37c, 1700061348, 2, false, false));
        address[] memory _us;
        all_grades.push(Grade(5, "takoy sebe magaz xd", 0xBD5Dabab7C1006c4eD857babEeCeCD23922401e6, 0xcA0DBfd5bC05324A6A8768d4438A152395746268, 0, 0, _us));
    }

    function registration(string memory user_email, bytes32 user_password) public {
        for(uint i = 0; i < user_addresses.length; i++) {
            require(user_addresses[i] != msg.sender, "u already registered");
            require(keccak256(abi.encodePacked(users[user_addresses[i]].email)) != keccak256(abi.encodePacked(user_email)), "email already registered");
        }
        users[msg.sender] = User(user_email, user_password, 1);
        user_addresses.push(msg.sender);
    }

    function get_user_request(address _user_address) public view returns (bool) {
        for(uint i = 0; i < requests.length; i++) {
            if(requests[i].user_address == _user_address) {
                if(requests[i].done == false) {
                    return true;
                }
            }
        }
        return false;
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
        shop_addresses.push(shop_address);
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


    function add_grade(uint _rate, string  memory _text, address _shop_address) public {
        bool flag = false;
        for(uint i = 0; i < shop_addresses.length; i++) {
            if(shop_addresses[i] == _shop_address){
                flag = true;
            }
        }
        require(flag == true, "shop aren't exists");
        // address[] memory _com_users;
        // string[] memory _com_texts;
        address[] memory _users;
        all_grades.push(Grade(_rate, _text, msg.sender, _shop_address, 0, 0, _users));
    }

    // function add_comment(uint index, string memory _text) public {
    //     all_grades[index].com_users.push(msg.sender);
    //     all_grades[index].com_texts.push(_text);
    // }

    function rate_grade(uint index, bool rate) public {
        require(users[msg.sender].role != 3, "only buyer and seller can comment shop");

        if(rate) {
            all_grades[index].likes += 1;
        } else {
            all_grades[index].dislikes += 1;
        }

        all_grades[index].users.push(msg.sender);
    } 

    // function rate_comment(uint comment_id, bool rate) public {
    //     require(keccak256(abi.encodePacked(users[msg.sender].email)) != keccak256(abi.encodePacked("")), "u aren't registered");
    //     for(uint i = 0; i < all_comments[comment_id].users.length; i++) {
    //         require(all_comments[comment_id].users[i] != msg.sender, "u already rate this comment");
    //     }
    //     if (rate) {
    //         all_comments[comment_id].likes += 1;
    //     } else {
    //         all_comments[comment_id].dislikes += 1;
    //     }

    //     all_comments[comment_id].users.push(msg.sender);
    // }

    // function getComments() public view returns(Comment[] memory) {
    //     return all_comments;
    // }

    function get_all_grades() public view returns(Grade[] memory) {
        return all_grades;
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
