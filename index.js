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
let total_killers = 2;
var Suspect_count = Harem_count = Jail_count = 0;
var status_array = [];

//Make List of Suspects of length N
var arr = [];
//New Array will be destroyed- to pick killers
let newArray = [];

let killer_array = []

function NewGame() {
    gridContainer.replaceChildren();//Clear all children
    Suspect_count = Harem_count = Jail_count = 0;
    status_array = Array(total_chars).fill("Suspects");
    arr = [...Array(total_chars)].map((item, index) => index);
    killer_array.length = 0;
    newArray = arr.slice();//COPY BY VALUE....
    shuffle(newArray)
    for (y = 0; y < total_killers; y++) {
        let MurdererIndex = newArray.pop()
        status_array[MurdererIndex] = "Murderer";
        killer_array.push(MurdererIndex)
    }

    //Shuffle Order of suspects
    shuffle(arr);
}

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

function NewRound() {
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
    for (let step of arr) {
        //3 ITEMS
        //FRONT IMAGE
        //BACK IMAGE
        //OVERALY //STart everyone as innocent
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("id", `CardSlot${step}`)
        cardElement.setAttribute("data-num", `${step}`);
        cardElement.setAttribute("data-num", `${step}`);
        cardElement.draggable = false
        cardElement.innerHTML = `
                <div class="front">
                  <img class="front-image" src="img/CharCards/card${step}.jpg" />
                </div>
                <div class="back">
                  <img class="front-image" src="img/CharCards/back${step}.jpg" />
                </div>
                <div class="overlay">
                    <img class="status-image hidden" id="StatusDisplay${step}" src="img/Overlay/${icon["Innocent"]}" />
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
    //Update Status
    status_array[Num] = "Fucked"
}

function escapeChar(cardContainer) {
    //Fucked and Added to Harem...
    //Flip to show Naughty Side
    cardContainer.classList.add('escaped');
    //Make Inactive
    cardContainer.classList.toggle("Inactive")
    // GET Index
    let Num = Number(cardContainer.dataset.num);
    //Update Status
    status_array[Num] = 'Innocent'
    //Update overlay as well
    let StatusIcon = document.getElementById(`StatusDisplay${Num}`);
    StatusIcon.classList.remove('hidden');
}

function jailChar(cardContainer) {
    //Make them inactive
    cardContainer.classList.toggle("Inactive")
    //Reset to Default
    cardContainer.classList.remove('escaped');
    cardContainer.classList.remove('flipped');
    // GET Index
    let Num = Number(cardContainer.dataset.num);
    //Update StatusIcon to Jail and remove hidden
    status_array[Num] = 'Arrested';
    let StatusIcon = document.getElementById(`StatusDisplay${Num}`);
    StatusIcon.src = `img/Overlay/${icon[status_array[Num]]}`; //Should Jail
    StatusIcon.classList.remove('hidden');
}

function updateCount() {
    //Suspect Count is the number of Suspects + Murderers
    Suspect_count = status_array.filter(x => x === "Suspects").length + status_array.filter(x => x === "Murderer").length;
    // # of ones you fucked Guilty or Not
    Harem_count = status_array.filter(x => x === "Fucked").length;
    //Total # in Jail Guilty or not
    Jail_count = status_array.filter(x => x === "Arrested").length;

    const suspect_counter = document.getElementById("count_suspects"); //+ Murderers
    suspect_counter.textContent = Suspect_count;
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
        if (status_array[killer] == "Arrested") {
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
        alert("You Won")

    } else {
        alert("You Lost")
    }
}

function ClaimRewards() {
    const Sophie = document.getElementById("Jail");
    Sophie.classList.add('flipped');
    const rewardContainer = document.querySelector(".Reward_Grid");
    rewardContainer.replaceChildren()
    generateRewardCards()

}

function generateRewardCards() {
    const rewardContainer = document.querySelector(".Reward_Grid");
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
    //Check if Active
    //Maybe use ACTIVE CLASS???
    //classList.contains(class)
    if (this.classList.contains("Inactive")) {
        return;
    }
    fuckChar(this);
    // Look at data base to see Card Status..
    //Lookup array to find 2 suspects to flip
    let Suspects = findtag(2, "Suspects");

    for (let key of Suspects) {
        let susCard = document.getElementById(`CardSlot${key}`);
        escapeChar(susCard);
    }
    //Update Count of each category
    updateCount();

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