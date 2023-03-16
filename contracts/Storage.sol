// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Storage {
    string[] public postsHashes;
    mapping(string => uint) public indexes;
    mapping(address => bool) public admins;
    address public owner;
    uint internal index;

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
        require(_toMakeAdmin == msg.sender, "Why you indicate another address");
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
        uint currIndex = indexes[_oldPostHash];
        postsHashes[currIndex] = _newPostHash;
    }

    function deletePostHash(
        string calldata _postHash
    ) external onlyOwnerOrAdmin {
        uint currIndex = indexes[_postHash];
        delete postsHashes[currIndex];
    }

    function withDraw(uint _amount, address _to) external onlyOwnerOrAdmin {
        payable(_to).transfer(_amount);
    }

    fallback() external payable {}

    receive() external payable {}
}
