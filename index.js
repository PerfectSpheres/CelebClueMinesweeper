const gridContainer = document.querySelector(".Suspect_Grid");
let cards = [];

let icon = {
    "Unkown": "fingerprint-scan.png",
    "Harem": "Lips.png",
    "Innocent": "forbidden.png",
    "Murderer": "Skull.png"
};

var n = 19;
let arr = [...Array(n)].map((item, index) => index + 1);
//shuffle(arr);
let status_array = Array(n).fill("Unkown");
let MurdererIndex = Math.floor(Math.random() * n);
status_array[MurdererIndex] = "Murderer";

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


generateCardsTest();
shuffle(arr);

function generateCardsTest() {
    for (let step of arr) {

        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-num", `${step}`);
        cardElement.innerHTML = `
                <div class="front">
                  <img class="front-image" src="img/CharCards/card${step}.jpg" />
                </div>
                <div class="front overlay">
                    <img class="status-image hidden" id="StatusDisplay${step}" src="img/Overlay/${icon["Unkown"]}" />
                </div>
              `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", selectCard);

    }

}

function selectCard() {
    let Num = Number(this.dataset.num);
    let DeathFlag = false;
    console.log(`I was clicked ${this} with index ${Num}`);
    let StatusIcon = document.getElementById(`StatusDisplay${Num}`);
    //Can't click on Cleared one.....
    if (status_array[Num - 1] == "Harem" || status_array[Num - 1] == "Innocent") {
        return;
    } else if (status_array[Num - 1] == "Unkown") {

        status_array[Num - 1] = "Harem"
    } else {
        //CHecking murder Index is better but this is more clear
        //OU ARE THE MURDERER GAME OVER..
        DeathFlag = true;
    }

    StatusIcon.classList.toggle('hidden');
    StatusIcon.src = `img/Overlay/${icon[status_array[Num - 1]]}`;

    let Innocents = findUnkown(2);
    for (let key of Innocents) {
        StatusIcon = document.getElementById(`StatusDisplay${key + 1}`);
        StatusIcon.classList.toggle('hidden');
        status_array[key] = "Innocent"
        StatusIcon.src = `img/Overlay/${icon[status_array[key]]}`; //Should beInnocent
    }
}

function findUnkown(number) {
    let innocents = [];
    for (x = 0; x < status_array.length; x++) {
        if (status_array[x] == "Unkown") {
            innocents.push(x);
        }
    }
    shuffle(innocents);
    return innocents.slice(0, number)
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