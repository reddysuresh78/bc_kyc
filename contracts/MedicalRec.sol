pragma solidity ^0.4.21;

contract MedicalRec {
    

    address owner;

     
    event VaccineGiven(bytes32 indexed toWho, bytes32 byWhom, bytes32 vaccine, bytes32 indexed date, bytes32 location );
    
        
    
    constructor() public   {
        owner = msg.sender;
    }


    function recordGivenVaccine(bytes32 toWho, bytes32 byWhom, bytes32 vaccine, bytes32 date, bytes32 location) public {
        //Make any payments, if needed
         
        emit VaccineGiven(toWho, byWhom, vaccine, date, location);
        

    }

}