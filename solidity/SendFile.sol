contract TransactFile {
    /* Public variables of the token */
    string public name;
    struct File{
      address owner;
      address author;
      uint256 price;
      bool exists;
    }
  //  mapping
    mapping (bytes32 => File) public availableFiles;
    mapping (address => mapping (uint => bytes32)) public owners;//efficient way to track files that a given address has
    mapping (address => mapping (bytes32 => uint)) shadowOwners; //track owners' hashes..required because web3 can't access keys without knowing what the keys are.  If/when solidity introduces "abstraction" then we can remove this and the "maxOwnership" map
    mapping (address => uint) public maxOwnership;//track largest number of files owned possible
    /* This generates a public event on the blockchain that will notify clients */
    event FileBought(address indexed from, address indexed to, bytes32 value);
    event FileAdded(address indexed from, uint256 price, bytes32 value);
    function TransactFile(string tokenName) {
        name = tokenName;                                   // Set the name for display purposes
    }
    function addFile(bytes32 _hash, uint256 price){ //add hash at a give price
        if(availableFiles[_hash].exists){ //cant add a file which already exists...otherwise can transfer ownership back!
          throw;
        }
        availableFiles[_hash]=File(msg.sender, msg.sender, price, true); //add new file to the market
        maxOwnership[msg.sender]++; //make sure that the index of the hash is unique for this address
        shadowOwners[msg.sender][_hash]=maxOwnership[msg.sender]; //track index for hash
        owners[msg.sender][maxOwnership[msg.sender]]=_hash; //make the author the owner
        FileAdded(msg.sender, price, _hash); //send the information to the network
    }
    function buyFile(bytes32 _hash){ //buy hash
        if(availableFiles[_hash].owner==msg.sender||availableFiles[_hash].author!=availableFiles[_hash].owner||msg.sender.balance<availableFiles[_hash].price){ //don't bother exchanging if ownership already exists, can only exchange once, and ensure enough wei to actually buy the file
          throw;
        }
        address currAddress=availableFiles[_hash].owner; //store current owner
        currAddress.send(availableFiles[_hash].price); //send current owner the price of the file
        availableFiles[_hash].owner=msg.sender; //new owner is the buyer

        delete owners[currAddress][shadowOwners[currAddress][_hash]]; //remove hash from current owner
        delete shadowOwners[currAddress][_hash]; //remove hash from current owner

        maxOwnership[msg.sender]++; //ensure uniqute index for hash
        owners[msg.sender][maxOwnership[msg.sender]]=_hash; //add hash to owners
        shadowOwners[msg.sender][_hash]=maxOwnership[msg.sender]; //track which hash has which id
        FileBought(msg.sender, currAddress, _hash); //send the event to the network
    }
    /* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        throw;     // Prevents accidental sending of ether
    }
}
