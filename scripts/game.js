function gameDisplayTemplate() {
    return `
        <div id="start-container" class="start-container">
            <h2 class="text-center">Willkommen im Pokémon Kampfspiel!</h2>
            <button id="start-game-btn" class="btn btn-primary" onclick="startBattleGame()">Spiel Starten</button>
        </div>
        <div id="battle-container" class="game-container d-none">
            <h2 class="text-center">Pokémon Kampfspiel</h2>
           <div class="battle-arena">
                <div id="player-card" class="pokemon-card pokemon-card-container"></div>
                <div class="vs">VS</div>
                <div id="enemy-card" class="pokemon-card pokemon-card-container"></div>
            </div>
            <button id="start-battle-btn" class="btn btn-primary" onclick="initiateBattle()">Starte einen Kampf</button>
            <div id="battle-log" class="battle-log"></div>
        </div>
    `;
}

async function renderStartScreen() {
    const gameWrapper = document.getElementById("game-wrapper");
    gameWrapper.innerHTML = gameDisplayTemplate();

    // Lade zufällige Pokémon-Karten
    const allPokemonDetails = await fetchAllPokemonDetails();
    const playerPokemon = getRandomPokemon(allPokemonDetails, 1)[0];
    const enemyPokemon = getRandomPokemon(allPokemonDetails, 1)[0];

    // Zeige die Karten an
    const playerCardContainer = document.getElementById("player-card");
    const enemyCardContainer = document.getElementById("enemy-card");

    playerCardContainer.innerHTML = pokemonCardTemplate(playerPokemon);
    enemyCardContainer.innerHTML = pokemonCardTemplate(enemyPokemon);

    return gameWrapper;
}

function startGame() {

    document.getElementById("overlay").classList.add("blur");
    

    renderStartScreen();
}

// Startet den Zwei-Kampf
function startBattleGame() {
    document.getElementById("start-container").classList.add("d-none");
    document.getElementById("battle-container").classList.remove("d-none");
}

function getRandomPokemon(pokemonList, count) {
    const randomPokemons = [];
    while (randomPokemons.length < count) {
        const randomIndex = Math.floor(Math.random() * pokemonList.length);
        const selectedPokemon = pokemonList[randomIndex];
        let isDuplicate = false;
        for (let i = 0; i < randomPokemons.length; i++) {
            if (randomPokemons[i].id === selectedPokemon.id) {
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate) {
            randomPokemons.push(selectedPokemon);
        }
    }
    return randomPokemons;
}

// Holt den Wert eines bestimmten Status mit einer Schleife
function getStatValue(pokemon, statName) {
    for (let i = 0; i < pokemon.stats.length; i++) {
        if (pokemon.stats[i].stat.name === statName) {
            return pokemon.stats[i].base_stat;
        }
    }
    return 0;
}
async function initiateBattle() {
    const allPokemonDetails = await fetchAllPokemonDetails();
    // Wähle 3 Pokémon für Spieler und Gegner aus
    const playerPokemons = getRandomPokemon(allPokemonDetails, 3);
    const enemyPokemons = getRandomPokemon(allPokemonDetails, 3);
   
    const playerCardContainer = document.getElementById("player-card");
    const enemyCardContainer = document.getElementById("enemy-card");

    // Spieler- und Gegnerkarten rendern
    playerCardContainer.innerHTML = ""; // Container leeren
    enemyCardContainer.innerHTML = ""; // Container leeren

    for (let i = 0; i < playerPokemons.length; i++) {
        playerCardContainer.innerHTML += pokemonCardTemplate(playerPokemons[i]);
        enemyCardContainer.innerHTML += pokemonCardTemplate(enemyPokemons[i]);
    }

    // Karten auswählen
    const playerCards = document.querySelectorAll("#player-card .pokemon-card");
    const enemyCards = document.querySelectorAll("#enemy-card .pokemon-card");

    // Initialer Kampfstatus
    const battleState = {
        currentPlayerIndex: 0,
        currentEnemyIndex: 0,
        
        playerHP: getStatValue(playerPokemons[0], "hp"),
        enemyHP: getStatValue(enemyPokemons[0], "hp"),
        battleLog: `<div class="log-entry">
                        <span class="log-player">${playerPokemons[0].name}</span> 
                        tritt an gegen 
                        <span class="log-enemy">${enemyPokemons[0].name}</span>.
                    </div>`,
    };

    // Zeige initialen Battle-Log
    document.getElementById("battle-log").innerHTML = battleState.battleLog;

    // Starte die nächste Runde, wenn der Spieler klickt
    document.getElementById("start-battle-btn").onclick = () => {
        playNextCard(battleState, playerCards, enemyCards);
    };
}

function playNextCard(battleState, playerCards, enemyCards) {
    let { currentPlayerIndex, currentEnemyIndex, playerHP, enemyHP, battleLog } = battleState;

    // Spieler greift an
    const currentPlayerPokemon = battleState.playerPokemons[currentPlayerIndex];
    const currentEnemyPokemon = battleState.enemyPokemons[currentEnemyIndex];
    const damageToEnemy = calculateDamage(currentPlayerPokemon, currentEnemyPokemon);
    enemyHP -= damageToEnemy;

    battleLog += `
        <div class="log-entry">
            <span class="log-player">${currentPlayerPokemon.name}</span>
            verursacht <span class="log-damage">-${damageToEnemy}</span> Schaden an
            <span class="log-enemy">${currentEnemyPokemon.name}</span>.
        </div>
    `;

    if (enemyHP <= 0) {
        battleLog += `
            <div class="log-entry">
                <span class="log-enemy">${currentEnemyPokemon.name}</span> wurde besiegt!
            </div>
        `;
        enemyCards[currentEnemyIndex].classList.add("played");
        currentEnemyIndex++;
        if (currentEnemyIndex < enemyPokemons.length) {
            battleState.enemyHP = getStatValue(enemyPokemons[currentEnemyIndex], "hp");
            battleLog += `
                <div class="log-entry">
                    Nächstes gegnerisches Pokémon: 
                    <span class="log-enemy">${enemyPokemons[currentEnemyIndex].name}</span>.
                </div>
            `;
        } else {
            battleLog += `<div class="log-entry victory">Du hast gewonnen!</div>`;
            document.getElementById("battle-log").innerHTML = battleLog;
            return;
        }
    }

    // Gegner greift an
    const damageToPlayer = calculateDamage(currentEnemyPokemon, currentPlayerPokemon);
    playerHP -= damageToPlayer;

    battleLog += `
        <div class="log-entry">
            <span class="log-enemy">${currentEnemyPokemon.name}</span>
            verursacht <span class="log-damage">-${damageToPlayer}</span> Schaden an
            <span class="log-player">${currentPlayerPokemon.name}</span>.
        </div>
    `;

    if (playerHP <= 0) {
        battleLog += `
            <div class="log-entry">
                <span class="log-player">${currentPlayerPokemon.name}</span> wurde besiegt!
            </div>
        `;
        playerCards[currentPlayerIndex].classList.add("played");
        currentPlayerIndex++;
        if (currentPlayerIndex < playerPokemons.length) {
            battleState.playerHP = getStatValue(playerPokemons[currentPlayerIndex], "hp");
            battleLog += `
                <div class="log-entry">
                    Dein nächstes Pokémon: 
                    <span class="log-player">${playerPokemons[currentPlayerIndex].name}</span>.
                </div>
            `;
        } else {
            battleLog += `<div class="log-entry defeat">Du hast verloren!</div>`;
            document.getElementById("battle-log").innerHTML = battleLog;
            return;
        }
    }

    // Aktualisiere den Spielstatus
    battleState.currentPlayerIndex = currentPlayerIndex;
    battleState.currentEnemyIndex = currentEnemyIndex;
    battleState.playerHP = playerHP;
    battleState.enemyHP = enemyHP;
    battleState.battleLog = battleLog;

    // Aktualisiere das Battle Log
    document.getElementById("battle-log").innerHTML = battleLog;
    console.log(battleState.playerPokemons, battleState.enemyPokemons);
console.log(currentPlayerPokemon, currentEnemyPokemon);
}



// Berechnet den Schaden basierend auf Angreifer und Verteidiger
function calculateDamage(attacker, defender) {
    const attackStat = getStatValue(attacker, "attack");
    const defenseStat = getStatValue(defender, "defense");
    const damage = Math.max(attackStat - defenseStat, 10); // Minimaler Schaden
    return damage;
}

function endGame() {
    document.getElementById("battle-container").classList.add("d-none");
    document.getElementById("start-container").classList.remove("d-none");
}