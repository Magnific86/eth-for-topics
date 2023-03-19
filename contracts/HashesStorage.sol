// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

contract HashesStorage {
    string[] public postsHashes;
    mapping(string => uint) public indexes;
    mapping(address => bool) public admins;
    address public owner;
    uint public index = 1;

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    modifier onlyOwnerOrAdmin() {
        require(
            owner == msg.sender || admins[msg.sender],
            "Only owner or admin!"
        );
        _;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only owner!");
        _;
    }

    function makeAdmin(address _toMakeAdmin) public {
        if (msg.sender != owner) {
            require(
                _toMakeAdmin == msg.sender,
                "Why you indicate another address"
            );
        }

        admins[_toMakeAdmin] = true;
    }

    function removeAdmin(address _toRemoveAdmin) public onlyOwner {
        admins[_toRemoveAdmin] = false;
    }

    function getAllPostsHashes() public view returns (string[] memory) {
        return postsHashes;
    }

    function addPostHash(string calldata _postHash) external onlyOwnerOrAdmin {
        postsHashes.push(_postHash);
        indexes[_postHash] = index;
        index++;
    }

    function setNewPostHashAfterEdit(
        string calldata _newPostHash,
        string calldata _oldPostHash
    ) external onlyOwnerOrAdmin {
        uint currIndexInMapping = indexes[_oldPostHash];
        postsHashes[currIndexInMapping - 1] = _newPostHash;
        indexes[_newPostHash] = currIndexInMapping;
        delete indexes[_oldPostHash];
    }

    function deletePostHash(
        string calldata _postHash
    ) external onlyOwnerOrAdmin {
        uint currIndexInMapping = indexes[_postHash];
        require(currIndexInMapping > 0, "Undefined index!");
        require(
            currIndexInMapping <= postsHashes.length + 1,
            "Index of finded post more than all arr length"
        );
        delete postsHashes[currIndexInMapping - 1];
    }

    function withDraw(uint _amount, address _to) external onlyOwner {
        payable(_to).transfer(_amount);
    }

    fallback() external payable {}

    receive() external payable {}
}
