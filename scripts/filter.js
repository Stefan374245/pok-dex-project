function filterAndShowPokemons(searchInput) {
  currentPokemon = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  renderAllPokemonCards(currentPokemon);
}

async function fetchGenerationSpecies(generation) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/generation/${generation}`
    );
    const data = await response.json();
    const speciesNames = [];
    for (let i = 0; i < data.pokemon_species.length; i++) {
      speciesNames.push(data.pokemon_species[i].name);
    }
    return speciesNames;
  } catch (error) {
    console.error("Fehler beim Abrufen der Generation:", error);
    return [];
  }
}

async function filterByType(type, allPokemons) {
  toggleLoadingScreen(true);
  if (!allPokemons || allPokemons.length === 0) {
    allPokemons = await fetchAllPokemonDetails();
  }

  if (type === "all") {
    renderAllPokemonCards(allPokemons);
    toggleLoadingScreen(false);
    return;
  }

  const filteredPokemons = [];

  for (let i = 0; i < allPokemons.length; i++) {
    const pokemon = allPokemons[i];

    for (let j = 0; j < pokemon.types.length; j++) {
      if (pokemon.types[j].type.name === type) {
        filteredPokemons.push(pokemon);
        break;
      }
    }
  }
  renderAllPokemonCards(filteredPokemons);
  toggleLoadingScreen(false);
}

async function filterByGeneration(generation, allPokemons) {
  toggleLoadingScreen(true);
  if (!allPokemons || allPokemons.length === 0) {
    allPokemons = await fetchAllPokemonDetails();
  }

  if (generation === "all") {
    renderAllPokemonCards(allPokemons);
    toggleLoadingScreen(false);
    return;
  }
  const pokemonSpecies = await fetchGenerationSpecies(generation);
  const filteredPokemons = [];
  for (let i = 0; i < allPokemons.length; i++) {
    const pokemon = allPokemons[i];

    for (let j = 0; j < pokemonSpecies.length; j++) {
      if (pokemon.name === pokemonSpecies[j]) {
        filteredPokemons.push(pokemon);
        break;
      }
    }
  }
  renderAllPokemonCards(filteredPokemons);
  toggleLoadingScreen(false);
}
