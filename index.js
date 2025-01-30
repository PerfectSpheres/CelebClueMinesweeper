const gridContainer = document.querySelector(".Suspect_Grid");
let cards = [];

let icon = {
    "Unkown": "lipstick_heart.png",
    "Harem": "cum_splatter.png",
    //"Innocent": "forbidden.png",
    "Innocent": "Innocent.png",
    "Murderer": "Skull.png"
};

var n = 21;
let arr = [...Array(n)].map((item, index) => index);

let status_array = Array(n).fill("Unkown");
let MurdererIndex = Math.floor(Math.random() * n);
status_array[MurdererIndex] = "Murderer";
MurdererIndex = Math.floor(Math.random() * n);
status_array[MurdererIndex] = "Murderer";

shuffle(arr)
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
    if (status_array[Num] == "Harem" || status_array[Num] == "Innocent") {
        return;
    } else if (status_array[Num] == "Unkown") {

        status_array[Num] = "Harem"
    } else {
        //CHecking murder Index is better but this is more clear
        //OU ARE THE MURDERER GAME OVER..
        DeathFlag = true;
    }

    StatusIcon.classList.toggle('hidden');
    StatusIcon.src = `img/Overlay/${icon[status_array[Num]]}`;

    let Innocents = findtag(2, "Unkown");

    for (let key of Innocents) {
        StatusIcon = document.getElementById(`StatusDisplay${key}`);
        StatusIcon.classList.toggle('hidden');
        status_array[key] = "Innocent"
        StatusIcon.src = `img/Overlay/${icon[status_array[key]]}`; //Should beInnocent
    }
    if (Innocents.length < 2) {
        let Killers = findtag(2, "Murderer");
        for (let key of Killers) {
            StatusIcon = document.getElementById(`StatusDisplay${key}`);
            StatusIcon.classList.toggle('hidden');
            StatusIcon.src = `img/Overlay/${icon[status_array[key]]}`; //Should beInnocent
        }
    }
}

function findtag(number, tag) {
    let innocents = [];
    for (x = 0; x < status_array.length; x++) {
        if (status_array[x] == tag) {
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