pragma solidity ^0.4.21;

contract GenericStore {
    
    address owner;

     
    event FileStored(bytes32 indexed filepath, bytes32 indexed date, bytes32 indexed extraindexfield, bytes32 timestamp, bytes32 filehash);
    event DataStored(bytes32 indexed indexfield1, bytes32 indexed indexfield2, bytes32 indexed indexfield3, bytes32 timestamp, bytes32 jsondata );
           
    
    constructor() public   {
        owner = msg.sender;
    }


    function storeFile(bytes32 filepath, bytes32 date, bytes32 extraindexfield, bytes32 timestamp, bytes32 filehash) public {
        //Make any payments, if needed
        emit FileStored(filepath, date, extraindexfield, timestamp, filehash);
    }

    function storeData(bytes32 indexfield1, bytes32 indexfield2, bytes32 indexfield3, bytes32 timestamp, bytes32 jsondata) public {
        //Make any payments, if needed
        emit DataStored(indexfield1, indexfield2, indexfield3, timestamp, jsondata);
    }

}