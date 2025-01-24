function filterAndShowPokemons(searchInput) {
  currentPokemon = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  renderAllPokemonCards(currentPokemon);
}

function resetOffset() {
  offset = 0;
}

function resetToFetchMorePokemons() {
  resetOffset();
  document.getElementById("load-more-pokemon").onclick = fetchMorePokemons;
}

let loadMoreButton = document.getElementById("load-more-pokemon");

async function filterByType(type, offset = 0, limit = 15) {
  toggleLoadingScreen(true);
  let loadbtn = document.getElementById('load-more-button');
  currentFilter = { type: null, type };

  try {
    const pokemonListResponse = await fetch("https://pokeapi.co/api/v2/type/" + type);
    const pokemonListData = await pokemonListResponse.json();

    const pokemonUrls = pokemonListData.pokemon.map(
      (pokemonEntry) => pokemonEntry.pokemon.url
    );

    const filteredPokemons = [];

    for (let i = offset; filteredPokemons.length <= limit; i++) {
      const pokemonResponse = await fetch(pokemonUrls[i]);
      const pokemonDetails = await pokemonResponse.json();
      filteredPokemons.push(pokemonDetails);
      offset++
    }

    renderAllPokemonCards(filteredPokemons);
  } catch (error) {
    console.error("Fehler beim Filtern nach Typ:", error);
  } finally {
    loadbtn.setAttribute(
      "onclick",
      `loadMoreTypesOrGeneration(${offset}, ${limit})`
    );
    toggleLoadingScreen(false);
  }
}


async function filterByGeneration(generation, offset = 0, limit = 15) {

  toggleLoadingScreen(true);
  let loadbtn = document.getElementById('load-more-button');
  currentFilter = { type: null, generation };

  try {
    const generationResponse = await fetch( `https://pokeapi.co/api/v2/generation/${generation}`);

    const generationData = await generationResponse.json();

    const speciesUrls = generationData.pokemon_species.map((species) => `https://pokeapi.co/api/v2/pokemon/${species.name}`);
    const filteredPokemons = [];
    
    for (let i = offset; filteredPokemons.length <= limit; i++) {
      const pokemonResponse = await fetch(speciesUrls[i]);
      const pokemonDetails = await pokemonResponse.json();
      filteredPokemons.push(pokemonDetails);
      offset++
    }
      renderAllPokemonCards(filteredPokemons);
  } catch (error) {
    console.error("Fehler beim Filtern nach Generation:", error);
  } finally {
    loadbtn.setAttribute("onclick",`loadMoreTypesOrGeneration(${offset}, ${limit})`);
    toggleLoadingScreen(false);
  }
}


async function fetchGenerationSpecies(generation) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/generation/${generation}`);
    const data = await response.json();
    const speciesNames = [];
    for (let i = 0; i < data.pokemon_species.length; i++) {
      speciesNames.push(data.pokemon_species[i].name);
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Generation:", error);
    return [];
  }
}

function loadMoreTypesOrGeneration(offset) {
  if (currentFilter.type) {
    filterByType(currentFilter.type, offset);
  } else if (currentFilter.generation) {
    filterByGeneration(currentFilter.generation, offset);
  }
}
