/**
 * This method will generate the slots array for the solo, duo and squad modes.
 * @param {Number} allowedPlayers - It takes the maximum number of allowed players in a match
 * @param {Number} teamMembers - It takes the size of the team or number of players in a team
 * @param {Number} firstSlot - It takes the first slot that from 1 that can assigned to a player (like in LIVIK, first slot number is 9, but in NUSA, it is 5)
 * @returns {Array} - It returns the multi-dimensional array representing slots number.
 */
exports.generateSlots = ({ allowedPlayers, teamMembers, firstSlot }) => {

    // slot values
    let slots = [];
    let slotNumber = firstSlot;
    let slotArr = [];

    // iterate upto maxPlayers
    while (slotNumber < allowedPlayers + firstSlot) {
        
        slotArr = [];  // empty the slotArray
        for (let j=0; j<teamMembers; j++) {  // generate the size of the team
            
            // player positions
            slotArr.push(slotNumber++); 
        }

        // push the slot array into slots
        slots.push(slotArr); 
    }
    return slots;  // the actual slots for players
};

