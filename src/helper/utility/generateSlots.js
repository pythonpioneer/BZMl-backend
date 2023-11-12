// importing requirements
const { alpha, numeric } = require('../../constants');

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


// we have the two random string from where we have to pick values to generate slot codes
const _alpha = alpha;  // 'befjkqwxyz'
const _numeric = numeric;  // '1234567896'

// method to generate team/slot code
const _generateCode = (randomValue) => {

    // making sure that the random value is of length 5
    const randomString = randomValue.toString().padStart(5, '0');

    // to generate the code, we need to fix the values picked from _alpha and _numeric strings
    let startFromAlpha;

    // if odd pick 3 from numeric
    if (randomValue % 2) startFromAlpha = false;
    else startFromAlpha = true;

    // now, generate the slot/team code
    let slotCode = "";
    let i = 0;
    while (randomString.length !== slotCode.length) {  // traverse in random string and pull values from alpha and numeric

        // pushing values in slotCode
        if (startFromAlpha) {  // pick values from alpha string
            slotCode += _alpha[randomString[i++]];
            startFromAlpha = false;
        }
        else {  // pick values from numeric string
            slotCode += _numeric[randomString[i++]];
            startFromAlpha = true;
        }
    }

    return slotCode;  // return the slot code
};

/**
 * This method will generate the slot code (team code) for duo and squad modes.
 * @return {String} - It return the string of length 5.
 */
exports.generateSlotCode = (slotStatus) => {  // confirm that the two codes are not same
    
    // generating random value and making sure the length of the random value is atleast 4
    const randomValue = Math.floor(Math.random() * 100000);
    let slotCode = _generateCode(randomValue);    

    // making sure that the slot code is unique, by finding the value in slot arr
    const isCodeThere = slotStatus?.find(item => item.code === slotCode);

    // if code is already there then generate the new code
    if (isCodeThere) this.generateSlotCode(slotStatus);
    else return slotCode;  // return the team code, if the team code is unique
};