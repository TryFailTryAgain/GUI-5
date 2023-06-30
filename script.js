// File: script.js



// w3schools.com and developer.mozilla.org were used as learning and reference material
// to structure this assignment.

// Copyright (c) 2023. All rights reserved. May be freely copied or
// excerpted for educational purposes with credit to the author.
// Last updated: Jun 30, 2023

// Resources utilized along side w3School and developer.mozilla.org:
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell
// https://www.w3schools.com/jsref/dom_obj_table.asp
// https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
// jquery
// https://jqueryvalidation.org/required-method/
// https://jqueryvalidation.org/jQuery.validator.addMethod/
// jquery ui
// https://jqueryui.com/tabs/#manipulation
// https://jqueryui.com/slider/#colorpicker
// https://api.jqueryui.com/slider/#event-change
// https://www.w3schools.com/jquery/sel_gt.asp
// more jquery stuff
// https://jqueryui.com/draggable/#snap-to
// https://www.w3schools.com/jquery/html_attr.asp
// https://api.jqueryui.com/sortable/#event-receive
// https://cs.uml.edu/~wzhou/GUI_AJAX_examples/
// https://api.jquery.com/find/


//globals for passing around the array and score
let gameBoardOrder = [];
let modifiablePiecesArr = [];
let score = 0;

//initializes the two draggable elements as .sortable()
$("#playerHand").sortable({
    revert: true,
    connectWith: "#gameBoard",
});

$("#gameBoard").sortable({
    revert: true,
    connectWith: "#playerHand",
    //on receive of a draggable game piece, check the possition of all tiles and update array
    receive: function (event, ui) {
        //loops through to grab the new possition of each draggable
        $("#gameBoard .draggable").each(function (index) {
            gameBoardOrder[index] = $(this);
        });
        console.log("Array of gameBoardOrder:");
        console.log(gameBoardOrder);
        printCurrentBoard();
    },
    stop: function (event, ui) {
        // disable the draggable widget
        $(this).draggable("disable");
    },
    //remove the draggable from the gameBoard and put it back in the playerHand
    remove: function (event, ui) {
        //remove the element that was just removed from gameBoardOrder
        const pieceToRemoveIndex = gameBoardOrder.indexOf(ui.item);
        gameBoardOrder.splice(pieceToRemoveIndex -1 , 1);

        console.log("Array of gameBoardOrder:");
        console.log(gameBoardOrder);
        printCurrentBoard();
    }
});
//end of initialization


//handles the eventlistener on checkScore button
$("#checkScore").click(function () {
    tallyScore();
});
//new round button, clears everything and refreshes the hand
$("#newRound").click(function () {
    //clears the board
    $("#gameBoard").empty();
    gameBoardOrder = [];
    score = 0;
    fillPlayerHand(modifiablePiecesArr);
});


//handles scaling of the gameBoard and playerHand to keep everything in sync
let gameBoardHeight = parseInt($('#gameBoard').css('height'));
let calculatedPHandHeight = (gameBoardHeight / 100) * 50 + gameBoardHeight;
$('.draggable').css({
    'height': (gameBoardHeight + 'px'),
});
$('#playerHand').css({
    'height': (calculatedPHandHeight + 'px'),
});

//ensure that as the window is moved everything keeps updating
$(window).on("resize", function () {
    //gets the new height of the gameBoard
    let gameBoardHeight = parseInt($('#gameBoard').css('height'));
    console.log(gameBoardHeight);
    //calculates a scaled new height for player hand background image/board
    let calculatedPHandHeight = (gameBoardHeight / 100) * 50 + gameBoardHeight;
    console.log("calculated new hand height: " + calculatedPHandHeight);

    //updates the height of draggable tiles to be the same height as the board squares and playerHand that holds them
    $('.draggable').css({
        'height': (gameBoardHeight + 'px'),
    });

    $('#playerHand').css({
        'height': (calculatedPHandHeight + 'px'),
    });
});
//end of scaling


//gets the json data
let xhr = new XMLHttpRequest();
xhr.open('GET', 'pieces.json', true);
xhr.send();
//end of json data grabbing


//runs code on load of the json
xhr.onload = function () {
    let allPieces = JSON.parse(xhr.responseText);
    console.log(allPieces.piece[0].letter); //validation of load test

    //puts total letters into a global array
    //loop across each letter A-Z, then loops the amount of that letter from json
    for (let i = 0; i < allPieces.piece.length; i++) {
        for (let j = 0; j < allPieces.piece[i].amount; j++) {
            modifiablePiecesArr.push(allPieces.piece[i].letter);
        }
    }
    console.log(modifiablePiecesArr); //validation of list insertion
    fillPlayerHand(modifiablePiecesArr);
}
//end of json run on load


//helper functions to set images for the pieces
function fillPlayerHand(modifiablePiecesArr) {
    //randomly selects a tile from the array
    for (let i = 0; i < 7; i++) {
        let randomIndex = Math.floor(Math.random() * modifiablePiecesArr.length);
        console.log("Random index: " + randomIndex); //validation of random index selection
        let randomPiece = modifiablePiecesArr[randomIndex];
        console.log("Random piece: " + randomPiece); //validation of random tile selection

        //calls function to assign the tile to the player hand
        //+1 so that the id of the draggable is 1-7 instead of 0-6
        applyImageToPlayerHand(i + 1, randomPiece);

        //removal from the arrayy
        modifiablePiecesArr.splice(modifiablePiecesArr.indexOf(randomPiece), 1);
    }
}

//takes the random letter and the index it should go at in the players hand and applied correct image
function applyImageToPlayerHand(index, letter) {
    console.log("Letter: " + letter); //validation of letter passed

    //#draggable[index] to the letter passed
    let draggableId = $("#draggableImg" + index);
    $(draggableId).attr("src", ("Scrabble_Tiles/Scrabble_Tile_" + letter + ".jpg"));

    console.log($(draggableId).attr("src"));
    console.log($(draggableId));
}

//calculates the score of the game from the gameBoardOrder
function tallyScore() {
    //clear old score
    score = 0;
    //loads the json data
    let allPieces = JSON.parse(xhr.responseText);

    console.log("Tallying score...");
    //loop through the gameBoardOrder array and add up the score
    for (let i = 0; i < gameBoardOrder.length; i++) {
        //gets the letter of the current tile from the src image name
        let currentLetter = gameBoardOrder[i].attr("src").slice(29, 30);
        console.log(currentLetter);
        //gets the score of the current letter from the json
        let letterScore = allPieces.piece.find(piece => piece.letter == currentLetter).value;
        console.log(currentLetter + " has value of: " + letterScore);

        //check for double letter score in 7th gameboard possition/i=6
        if (i === 6) {
            letterScore *= 2;
        }

        score += letterScore;
    }
    //checks to see if double word score is populated, its the 3rd position on the board
    //if true, double the score
    if (gameBoardOrder[2]) {
        console.log("Double word score!");
        score *= 2;
    }

    //log score
    console.log("Final score: " + score);
    //display score
    $("#scoreBoard").text("Final score: " + score);
}

function printCurrentBoard() {
    fullWordEntered = "";
    for (let i = 0; i < gameBoardOrder.length; i++) {
        //gets the letter of the current tile from the src image name
        let currentLetter = gameBoardOrder[i].attr("src").slice(29, 30);
        console.log(currentLetter);
        fullWordEntered += currentLetter;
    }
    $("#currentWord").text("Currently entered word: " + fullWordEntered);
}