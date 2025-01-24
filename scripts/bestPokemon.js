function getStatValue(pokemon, statName) {
    for (let j = 0; j < pokemon.stats.length; j++) {
        if (pokemon.stats[j].stat.name === statName) {
            return pokemon.stats[j].base_stat;
        }
    }
    return 0;
}

async function showBestStats() {
    toggleLoadingScreen(true);
    const allPokemon = await fetchAllPokemonDetails();

    let bestPokemon = null;
    let highestTotalStats = 0;

    for (let i = 0; i < allPokemon.length; i++) {
        const pokemon = allPokemon[i];
        let totalStats = 0;

        for (let j = 0; j < pokemon.stats.length; j++) {
            totalStats += pokemon.stats[j].base_stat;
        }

        if (totalStats > highestTotalStats) {
            highestTotalStats = totalStats;
            bestPokemon = pokemon;
        }
    }

    renderSinglePokemonCard(bestPokemon);
    toggleLoadingScreen(false);
}


async function showHighestAttack() {
    toggleLoadingScreen(true);
    const allPokemon = await fetchAllPokemonDetails();

    let bestAttackPokemon = null;
    let highestAttack = 0;

    for (let i = 0; i < allPokemon.length; i++) {
        const pokemon = allPokemon[i];
        const attack = getStatValue(pokemon, "attack");

        if (attack > highestAttack) {
            highestAttack = attack;
            bestAttackPokemon = pokemon;
        }
    }
    
    renderSinglePokemonCard(bestAttackPokemon);
    toggleLoadingScreen(false);
}


async function showHighestSpeed(allPokemons) {
    toggleLoadingScreen(true);
  
    if (!allPokemons || allPokemons.length === 0) {
      allPokemons = await fetchAllPokemonDetails(limit=1000);
    }
  
    let bestSpeedPokemon = null;
    let highestSpeed = 0;
  
    for (let i = 0; i < allPokemons.length; i++) {
      const pokemon = allPokemons[i];
      const speed = getStatValue(pokemon, "speed");
  
      if (speed > highestSpeed) {
        highestSpeed = speed;
        bestSpeedPokemon = pokemon;
      }
    }
  
    if (bestSpeedPokemon) {
      console.log(
        `Das schnellste Pokémon ist ${bestSpeedPokemon.name} mit einer Geschwindigkeit von ${highestSpeed}`
      );
      renderSinglePokemonCard(bestSpeedPokemon);
    } else {
      console.log("Keine Pokémon gefunden.");
    }
  
    toggleLoadingScreen(false);
  }
  