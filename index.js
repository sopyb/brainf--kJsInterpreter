const readline = require('readline-sync')
// const { readFileSync } = require('fs')

/**
 * @param {string} text The string
 */
function bfinterpreter(text) {
    //define necesarry variables
    let memory = new Array(30000).fill(0), // memory 30k
        pointer = 0,
        result = "",
        arrStart = [];

    //["t", "e", "x", "t", " ", "t", "o", " ", "a", "r", "r", "a", "y"]
    text = text.split("")

    for (let i = 0; i < text.length; i++) {
        let curChar = text[i]

        // console.log(`${curChar} - ${i} (${pointer} - ${memory[pointer]})`) //DEBUG or smth

        switch (curChar) {
            // move pointer forward
            case '>':
                pointer++
                // if at end of memory move back to end
                if (pointer > memory.length) pointer = memory.length
                break;

            // move pointer backwards
            case '<':
                pointer--
                // if at start of memory move back to end
                if (pointer < 0) pointer = 0
                break;

            // increase value in memory
            case '+':
                memory[pointer]++
                // overflow to 0
                if (memory[pointer] > 255) memory[pointer] = 0
                break;

            // decrease value in memory
            case '-':
                memory[pointer]--
                // overflow to 255
                if (memory[pointer] < 0) memory[pointer] = 255
                break;

            // add to result buffer
            case '.':
                result += String.fromCharCode(memory[pointer])
                break;

            // get input
            case ',':
                // output and clear result buffer
                console.log(result)
                result = ""

                //accept input
                let answer = readline.question().charCodeAt(0)

                //check if input is valid
                if (answer > 255 || isNaN(answer)) {
                    console.info("Invalid input, try again")
                    i--
                } else memory[pointer] = answer
                break;

            // start while loop
            case '[':
                // start loop if memory@pointer isn't 0
                if (memory[pointer] !== 0) {
                    arrStart.push(i)
                } else {
                    let map = text
                        // every entry of array to object {entry, index}
                        .map((entry, index) => {return {entry, index}})
                        //filter out entries before current character
                        .filter((e => e?.index > i))
                        // filter entries of loop operators [ and ]
                        .filter((e) => e?.entry === "]" || e?.entry === "[")


                    let brackeys = 1,
                        index = -1;

                    //while open loops
                    while (brackeys !== 0) {
                        index++

                        if (map[index]?.entry === "[") {
                            brackeys++
                        } else {
                            brackeys--
                        }
                    }

                    // declare found loop end position
                    newPos = map[index]?.index

                    // check if pos is a number
                    if(typeof newPos === "number") {
                        i = newPos
                    } else throw Error(`${newPos}Loop starting at pos ${i} never ends.`)
                }
                break;

            // end while loop
            case ']':
                // repeat if memory@pointer isn't 0
                if (memory[pointer] !== 0) {
                    i = arrStart[arrStart.length - 1]
                } else {
                    // clear starting point of finished while loop
                    arrStart.pop()
                }
                break;
            default:
                break;
        }
    }
    // output what's left in the result buffer
    console.log(result);
}
// using https://github.com/mitxela/bf-tic-tac-toe
// bfinterpreter(readFileSync('./ttt.bs').toString())

module.exports = bfinterpreter