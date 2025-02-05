let gridContainer = null;//document.querySelector(".Suspect_Grid");
let cards = [];
let dragCard = null;
let icon = {
    //States LIST
    // Start as Suspect or Murder
    // Suspect can go to Innocent or Fucked/Harem or even Jail
    // Murder can only got to Harem or Jail/Caught
    "Arrested": "handcuffs.png",
    "Jailed": "Jail.png",
    "Innocent": "Innocent.png",
    "Murderer": "Skull.png",
    "GameOver": "Killers.png"
};



//Doesn't Change...
var total_chars = 21;
let num_cols = 7;

let total_killers = 2;
var Search_count = 7;
var Harem_count = Jail_count = 0;


//Screen Ordering gets shuffled
var DisplayOrder = [];
var status_array = []; //
let killer_array = []; //
let Jail_array = [];//

//FIXED -remove comment
function NewGame() {
    gridContainer.replaceChildren();//Clear all children
    Search_count = 7;
    Harem_count = Jail_count = 0;

    //status_array = Array(total_chars).fill("Suspects");
    status_array = Array(total_chars).fill(0);
    DisplayOrder = [...Array(total_chars)].map((item, index) => index);
    killer_array.length = 0;
    Jail_array.length = 0;
    while (killer_array.length < total_killers) {
        //Pick an Entry
        let firstPick = Math.floor(Math.random() * total_chars);
        let tmp = killer_array.findIndex((x) => x === firstPick);
        //If not found: -1
        if (tmp == -1) {
            killer_array.push(firstPick);

        }

    }
    //Shuffle Order of suspects
    shuffle(DisplayOrder);
    //Populate STatus Array with Length Calc
    status_array = status_array.map((x, idx) => Math.min(calc_distance(idx, killer_array[0], 7), calc_distance(idx, killer_array[1], 7)));
    //Calculate distance based on display order
    //status_array = status_array.map((x, idx) => Math.min(calc_distance(idx, killer_array[0], 7), calc_distance(idx, killer_array[1], 7)));


}
//No Change
function StartGame() {
    const gameGrid = document.createElement("div");
    gameGrid.classList.add("Suspect_Grid");
    gridContainer = gameGrid;
    document.querySelector(".Intro").replaceChildren(gameGrid);//DELETE ALL CHILDREN
    document.getElementById("StartButton").disabled = true;
    document.getElementById("WinButton").disabled = false;
    document.getElementById("RedoButton").disabled = false;
    NewRound();
}
//No Change
function NewRound() {
    gridContainer.classList.remove('Reward_Grid');
    gridContainer.classList.add('Suspect_Grid');
    NewGame(); //Must have gridContainer asigned first
    generateCards();
    //Update Count
    updateCount();
    document.getElementById("EndButton").disabled = true;
}

/* FETCH DATA COMMENTED UNTILL I MAKE DATA BASE
fetch("./data/suspects.json")
    .then((res) => res.json())
    .then((data) => {
        cards = [...data];
        console.log(data)
        console.log(cards)

    })
    .catch(error => {
        // Handle errors
        console.error('error:', error);
    });;
*/



function generateCards() {
    //gridContainer.removeChild()
    //for (let step of DisplayOrder) {
    for (let [index, value] of DisplayOrder.entries()) {
        //3 ITEMS
        //FRONT IMAGE
        //BACK IMAGE
        //OVERALY //STart everyone as innocent
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("id", `CardSlot${index}`)
        cardElement.setAttribute("data-num", `${index}`);
        cardElement.draggable = false
        let icon_src = `img/Overlay/Cold_${status_array[index]}.png`;
        if (status_array[index] == 0) {
            icon_src = `img/Overlay/Hot_1.png`;
        }
        cardElement.innerHTML = `
                <div class="front">
                  <img class="front-image" src="img/CharCards/card${value}.jpg" />
                </div>
                <div class="back">
                  <img class="front-image" src="img/CharCards/back${value}.jpg" />
                </div>
                <div class="overlay">
                <!--<p class="distance"></p>-->
                    <img class="status-image hidden" id="StatusDisplay${index}" src="${icon_src}" />
                </div>
              `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", clickSlotBetter);
        cardElement.addEventListener("dragstart", dragStart, false);

    }

}

function fuckChar(cardContainer) {
    //Fucked and Added to Harem...
    //Flip to show Naughty Side
    cardContainer.classList.toggle('flipped');
    //Make Inactive
    cardContainer.classList.toggle("Inactive")
    cardContainer.draggable = true
    // GET Index
    let Num = Number(cardContainer.dataset.num);
    //let displayDistance = cardContainer.querySelector(".distance");
    //displayDistance.innerHTML = status_array[Num];
    //displayDistance.classList.remove("hidden");
    let StatusIcon = document.getElementById(`StatusDisplay${Num}`);
    //StatusIcon.src = `img/Overlay/Cold_${status_array[Num]}.png`; //Should Jail
    if (status_array[Num] == 0) {
        //"Killers.png"
        StatusIcon.src = `img/Overlay/${icon["GameOver"]}`; //Should Jail
    }
    StatusIcon.classList.remove('hidden');


    Harem_count++;
    //Total # in Jail Guilty or not


    return status_array[Num] !== 0;
    //Update Status-only reveal
    //status_array[Num] 


}

function jailChar(cardContainer) {
    //Make them inactive
    cardContainer.classList.toggle("Inactive");
    //Reset to Default
    cardContainer.classList.remove('escaped');
    cardContainer.classList.remove('flipped');
    // GET Index
    let Num = Number(cardContainer.dataset.num);
    //Update StatusIcon to Jail and remove hidden
    Jail_array.push(Num);
    let StatusIcon = document.getElementById(`StatusDisplay${Num}`);
    StatusIcon.src = `img/Overlay/${icon["Arrested"]}`; //Should Jail
    StatusIcon.classList.remove('hidden');
    Jail_counter++;
}

function updateCount() {
    const attemps_counter = document.getElementById("count_suspects"); //+ Murderers
    attemps_counter.textContent = Search_count;
    const Harem_counter = document.getElementById("count_harem"); //+ Murderers
    Harem_counter.textContent = Harem_count;
    const Jail_counter = document.getElementById("count_arrested"); //+ Murderers
    Jail_counter.textContent = Jail_count;
}
function updateKiller() {
    const Murder_counter = document.getElementById("count_murderers"); //+ Murderers
    Murder_counter.textContent = total_killers;
}

function winCheck() {
    const Sophie = document.getElementById("Jail");

    //Flip Jail Jail

    // See if the Killer is in the murder list
    // set Win Conditon to Getting all Killers
    let Win_Check = total_killers;
    //Iterate through killers to check their status
    for (let killer of killer_array) {
        if (Jail_array.includes(killer)) {
            Win_Check--;
            //DIE
            let StatusIcon = document.getElementById(`StatusDisplay${killer}`);
            StatusIcon.src = `img/Overlay/${icon["Jailed"]}`; //Should Jail
            StatusIcon.classList.remove('flipped');
            StatusIcon.classList.remove('hidden');
        } else {
            //DIE
            let cardElement = document.getElementById(`CardSlot${killer}`);
            cardElement.classList.remove('flipped');
            let StatusIcon = document.getElementById(`StatusDisplay${killer}`);
            StatusIcon.src = `img/Overlay/${icon["GameOver"]}`; //Should Jail

            StatusIcon.classList.remove('hidden');
        }

    }

    if (Win_Check == 0) {
        document.getElementById("EndButton").disabled = false;
        alert("You Won- Claim your Rewards")
        const Sophie = document.getElementById("Jail");
        Sophie.classList.add('flipped');

    } else {
        alert("Killer Got Away -You Lose")
    }
}

function ClaimRewards() {

    //const rewardContainer = document.querySelector(".Reward_Grid");
    //rewardContainer.replaceChildren()
    gridContainer.replaceChildren();//Clear all children
    gridContainer.classList.remove('Suspect_Grid');
    gridContainer.classList.add('Reward_Grid');
    generateRewardCards();

}

function generateRewardCards() {
    const rewardContainer = document.querySelector(".Reward_Grid");
    const header = document.createElement("div");
    header.innerHTML = `<h2>You have ${Search_count + 7} rewards points</h2>`;
    header.classList.add("Reward_Instructions")
    rewardContainer.appendChild(header);
    //gridContainer.removeChild()
    for (x = 0; x < 6; x++) {
        //3 ITEMS
        //FRONT IMAGE
        //BACK IMAGE
        //OVERALY //STart everyone as innocent
        const cardElement = document.createElement("div");
        cardElement.classList.add("card_H");
        cardElement.setAttribute("id", `RewardSlot${x}`)
        cardElement.setAttribute("data-num", `${x}`);
        cardElement.draggable = false
        cardElement.innerHTML = `
                <div >
                  <img  class="front-image" src="img/RewardCards/Reward${x}.jpg" />
                </div>
              `;
        rewardContainer.appendChild(cardElement);
        //cardElement.addEventListener("click", clickSlotBetter);
        //cardElement.addEventListener("dragstart", dragStart, false);

    }

}

function clickSlotBetter() {
    let Num = Number(this.dataset.num);
    //Also Check for Max Tries
    if (this.classList.contains("Inactive")) {
        return;
    }
    if (Search_count < 1) {
        return;
    }
    //Suspect Count is the number of Suspects + Murderers
    Search_count--;

    let safe = fuckChar(this);
    updateCount();
    if (safe) {
        return;
    } else {
        Search_count = 0;// WHOOPS CALL DIE
        alert("You Died - Play Again?")
    }





}


//DragStart Grabs Data its not grabbed by default
function dragStart(event) {
    //dragged = event.target;//Don't pass ID just pass the object
    let divy = event.target.parentElement.parentElement;
    event.dataTransfer.setData("Text", divy.id);
    dragCard = divy
    console.log(`Moving object ${divy.id}`)
}
//By default DRAG events can't pass data on dragover
function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("Text");
    //or use dragged
    console.log(`This object got dropped on me ${data}`);
    jailChar(dragCard);
    updateCount();
}


function findtag(number, tag) {
    let results = [];
    for (x = 0; x < status_array.length; x++) {
        if (status_array[x] == tag) {
            results.push(x);
        }
    }
    shuffle(results);
    return results.slice(0, number)
}

function calc_distance(loc_a, loc_b, num_cols) {
    let cols_apart = Math.abs((loc_a % num_cols) - (loc_b % num_cols));
    let rows_apart = Math.abs(Math.floor(loc_a / num_cols) - Math.floor((loc_b / num_cols)));
    return cols_apart + rows_apart;
}

// FROM
//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}
