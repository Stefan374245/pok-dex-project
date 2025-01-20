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


async function showHighestSpeed() {
    toggleLoadingScreen(true);
    const allPokemon = await fetchAllPokemonDetails();

    let bestDefensePokemon = null;
    let highestDefense = 0;

    for (let i = 0; i < allPokemon.length; i++) {
        const pokemon = allPokemon[i];
        const defense = getStatValue(pokemon, "speed");

        if (defense > highestDefense) {
            highestDefense = defense;
            bestDefensePokemon = pokemon;
        }
    }

    renderSinglePokemonCard(bestDefensePokemon);
    toggleLoadingScreen(false);
}
