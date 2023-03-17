'use strict';

let data = [];

//#region utils

function seed(variant){
    data = [
        {
            name: "Axel",
            infectionStatus: "",
            age: 30,
            immunisedSatus: "",
            isDead: false,
            group: [
                {
                    name: "Lylou",
                    infectionStatus: "",
                    age: 24,
                    immunisedSatus: "",
                    isDead: false,
                    group: [
                        {
                            name: "Sami",
                            infectionStatus: "",
                            age: 10,
                            immunisedSatus: "",
                            isDead: false,
                            group: []
                        }
                    ]
                },
                {
                    name: "Samuel",
                    infectionStatus: variant,
                    age: 26,
                    immunisedSatus: "",
                    isDead: false,
                    group: [
                        {
                            name: "Ilyan",
                            infectionStatus: "",
                            age: 10,
                            immunisedSatus: "",
                            isDead: false,
                            group: []
                        },
                        {
                            name: "Soumaya",
                            infectionStatus: "",
                            age: 24,
                            immunisedSatus: "",
                            isDead: false,
                            group: []
                        },
                        {
                            name: "Jeanne",
                            infectionStatus: "",
                            age: 30,
                            immunisedSatus: "",
                            isDead: false,
                            group: []
                        },
                        {
                            name: "Edgar",
                            infectionStatus: "",
                            age: 50,
                            immunisedSatus: "",
                            isDead: false,
                            group: []
                        }
                    ]
                }
            ]
        },
        {
            name: "Julian",
            infectionStatus: variant,
            age: 37,
            immunisedSatus: "",
            isDead: false,
            group: [
                {
                    name: "Amira",
                    infectionStatus: "",
                    age: 40,
                    immunisedSatus: "",
                    isDead: false,
                    group: [
                        {
                            name: "Thaïs",
                            infectionStatus: "",
                            age: 17,
                            immunisedSatus: "",
                            isDead: false,
                            group: []
                        }
                    ]
                }
            ]
        },
        {
            name: "Violette",
            infectionStatus: variant,
            age: 25,
            immunisedSatus: "",
            isDead: false,
            group: []
        },
    ];
}

function getInfectedFromGroup(d, variant){
    //get infected people from current level
    let filteredData = d.filter(p => p.infectionStatus === variant);

    //each people in current level
    for(let i = 0; i < d.length; i++){
        //check if there is a group
        if(d[i].group.length > 0){
            filteredData = filteredData.concat(getInfectedFromGroup(d[i].group, variant));
        }
    }

    return filteredData;
}

function isInTree(d, infected){
    let found = false;

    if(isAnInfected(d, infected)){
        found = true;
    } else if(d.group.length > 0){
        for(let i = 0; i < d.group.length; i++){
            found = isInTree(d.group[i], infected);
            if(found) break;
        }
    }

    return found;
}

function isAnInfectedAtSameLevel(d, infected){
    for(let i = 0; i < d.length; i++){
        if(isAnInfected(d[i], infected)){
            return true;
        }
    }

    return false;
}

function isAnInfected(d, infected){
    return infected.map(i => i.name).includes(d.name);
}

//#endregion

//#region Zombie A infect from top to bottom

function startZombieAInfection(d){
    //Get infected peoples
    let filteredData = getInfectedFromGroup(d, "A");

    if(filteredData.length > 0){
        return infectWithZombieA(d, filteredData);
    }
}

function infectWithZombieA(d, infected, needToBeInfected = false){
    for(let i = 0; i < d.length; i++){
        let subLevelNeedToBeInfected = needToBeInfected;
        if(!needToBeInfected) subLevelNeedToBeInfected = isAnInfected(d[i], infected);

        if(subLevelNeedToBeInfected){
            //Infect the person
            d[i].infectionStatus = "A";
            console.log(d[i].name + " is infected with variant A");
        }

        if(d[i].group.length > 0){
            infectWithZombieA(d[i].group, infected, subLevelNeedToBeInfected);
        }
    }

    return d;
}

//End zombie A
//#endregion

//#region Zombie B infect from bottom to top

function startZombieBInfection(d){
    //Get infected peoples
    let filteredData = getInfectedFromGroup(d, "B");

    if(filteredData.length > 0){
        return infectWithZombieB(d, filteredData);
    }
}

function infectWithZombieB(d, infected){
    for(let i = 0; i < d.length; i++){
        if(isInTree(d[i], infected)){
            //Infect the person
            d[i].infectionStatus = "B";
            console.log(d[i].name + " is infected with variant B");
        }

        //Infect the group
        if(d[i].group.length > 0){
            infectWithZombieB(d[i].group, infected);
        }
    }

    return d;
}

//End zombie B
//#endregion

//#region Zombie 32 infect from bottom to top and from top to bottom

function startZombie32Infection(d){
    //Get infected peoples
    let filteredData = getInfectedFromGroup(d, "32");

    if(filteredData.length > 0){
        return infectWithZombie32(d, filteredData);
    }
}

function infectWithZombie32(d, infected, needToBeInfected = false){
    for(let i = 0; i < d.length; i++){
        let currentLevelNeedToBeInfected = needToBeInfected;
        if(currentLevelNeedToBeInfected === false) {
            currentLevelNeedToBeInfected = isInTree(d[i], infected);
        }

        //if the person is in the tree
        if(currentLevelNeedToBeInfected === true){
            //Infect the person
            d[i].infectionStatus = "32";
            console.log(d[i].name + " is infected with variant 32");

            //Infect the group
            if(d[i].group.length > 0){
                infectWithZombie32(d[i].group, infected, currentLevelNeedToBeInfected);
            }
        }        
    }

    return d;
}

//End zombie 32
//#endregion

//#region Zombie C infect one of two people of the current level

function startZombieCInfection(d){
    //Get infected peoples
    let filteredData = getInfectedFromGroup(d, "C");

    if(filteredData.length > 0){
        return infectWithZombieC(d, filteredData);
    }
}

function infectWithZombieC(d, infected){
    //Check if we are at the same level as the infected people
    if(isAnInfectedAtSameLevel(d, infected)){
        let toggle = true;
        for(let i = 0; i < d.length; i++){
            if(toggle) {
                d[i].infectionStatus = "C";
                console.log(d[i].name + " is infected with variant C");
            }
            toggle = !toggle;
        }
    }
    else
    {
        for(let i = 0; i < d.length; i++){
            if(d[i].group.length > 0) {
                infectWithZombieC(d[i].group, infected);
            }
        }
    }

    return d;
}

//End zombie C
//#endregion

//#region Ultimate Zombie infect only top level

function startUltimateZombieInfection(d){
    //Get infected peoples
    let filteredData = getInfectedFromGroup(d, "U");

    for(let i = 0; i < filteredData.length; i++){
        console.log(filteredData[i].name + " is infected with variant Ultimate");
    }

    if(filteredData.length > 0){
        return infectWithUltimateZombie(d, filteredData);
    }
}

function infectWithUltimateZombie(d, infected){
    for(let i = 0; i < d.length; i++){
        if(isInTree(d[i], infected)){
            if(d[i].infectionStatus !== "U"){
                //Infect the person
                d[i].infectionStatus = "U";
                console.log(d[i].name + " is infected with variant Ultimate");
            }
        }
    }

    return d;
}


//End ultimate zombie
//#endregion

//#region Vaccin-A.1 usefull vs Zombie A and Zombie 32

function applyVaccinA1(d){
    for(let i = 0 ; i < d.length; i++){
        if(d[i].infectionStatus === "A" || d[i].infectionStatus === "32"){
            if(d[i].age >= 0 && d[i].age <= 30){
                d[i].infectionStatus = "";
                d[i].immunisedSatus = "Ascendant and Descendant";
                console.log(d[i].name + " is immunised with Vaccin-A.1 (Ascendant and Descendant)")
            }
        }
        if(d[i].group.length > 0){
            applyVaccinA1(d[i].group);
        }
    }

    return d;
}

//End Vaccin-A.1
//#endregion

//#region Vaccin-B.1 usefull vs Zombie B and Zombie C

function applyVaccinB1(d, toggle = false){
    for(let i = 0 ; i < d.length; i++){
        if(d[i].infectionStatus === "B" || d[i].infectionStatus === "C"){
            d[i].infectionStatus = "";
            d[i].isDead = toggle;
            toggle = !toggle;
            console.log(d[i].name + " is immunised with Vaccin-B.1 and is " + (d[i].isDead ? "dead" : "alive"));
        }
        if(d[i].group.length > 0){
            applyVaccinB1(d[i].group, toggle);
        }
    }

    return d;
}

//End Vaccin-Ultime
//#endregion

//#region Vaccin-Ultime usefull vs Ultimate Zombie

function applyUltimateVaccin(d){
    for(let i = 0 ; i < d.length; i++){
        if(d[i].infectionStatus === "U"){
            d[i].infectionStatus = "";
            d[i].immunisedSatus = "All";
            console.log(d[i].name + " is immunised with Vaccin-Ultime (All)")
        }
        if(d[i].group.length > 0){
            applyUltimateVaccin(d[i].group);
        }
    }

    return d;
}

//End Vaccin-Ultime
//#endregion

seed("A");
let nd = startZombieAInfection(data);
nd = applyVaccinA1(nd);
console.log("\r\n=====================================");
console.log("Raw data : " + JSON.stringify(nd));
console.log("=====================================\r\n");

seed("B");
nd = startZombieBInfection(data);
nd = applyVaccinB1(nd);
console.log("\r\n=====================================");
console.log("Raw data : " + JSON.stringify(nd));
console.log("=====================================\r\n");

seed("32");
nd = startZombie32Infection(data);
nd = applyVaccinA1(nd);
console.log("\r\n=====================================");
console.log("Raw data : " + JSON.stringify(nd));
console.log("=====================================\r\n");

seed("C");
nd = startZombieCInfection(data);
nd = applyVaccinB1(nd);
console.log("\r\n=====================================");
console.log("Raw data : " + JSON.stringify(nd));
console.log("=====================================\r\n");

seed("U");
nd = startUltimateZombieInfection(data);
nd = applyUltimateVaccin(nd);
console.log("\r\n=====================================");
console.log("Raw data : " + JSON.stringify(nd));
console.log("=====================================\r\n");
