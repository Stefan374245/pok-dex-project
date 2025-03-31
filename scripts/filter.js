function filterAndShowPokemons(searchInput) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const searchTerm = searchInput.toLowerCase();
    const display = document.getElementById("pokemon-display");
    filterPokemons(searchTerm, allPokemon, display);
  }, 300);
}

function filterPokemons(searchTerm, allPokemon, display) {
  if (!allPokemon || allPokemon.length === 0) {
    return;}
  display.innerHTML = "";
  if (searchTerm.length < 3) {
    display.innerHTML =
      "<p id='search-message'>Bitte mindestens 3 Buchstaben eingeben...</p>";
    return;}
  currentPokemon = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm)
  );
  if (currentPokemon.length === 0) {
    display.innerHTML = "<p>Keine Pokémon gefunden</p>";
  } else {
    renderAllPokemonCards(currentPokemon);
  }
}

function resetSearch() {
  const searchBar = document.getElementById("search-bar");
  const display = document.getElementById("pokemon-display");

  if (searchBar.value.trim() === "") {
    display.innerHTML = "";
    renderAllPokemonCards(allPokemon.slice(0, 20));
  }
}

async function filterByType(type, offset = 0, limit = 15, filteredPokemons = [], loadmore = false) {
  toggleLoadingScreen(true);
  let loadbtn = document.getElementById("load-more-button");
  currentFilter = { type, generation: null };

  try {
    await fetchTypePokemons(type, offset, limit, filteredPokemons, loadmore);
  } catch (error) {
    console.error("Fehler beim Filtern nach Typ:", error);
  } finally {
    loadbtn.setAttribute("onclick", `loadMoreTypesOrGeneration(${offset})`);
    toggleLoadingScreen(false);
  }
}

async function fetchTypePokemons(type, offset, limit, filteredPokemons, loadMore) {
  const pokemonListResponse = await fetch(
    "https://pokeapi.co/api/v2/type/" + type
  );
  const pokemonListData = await pokemonListResponse.json();

  const pokemonUrls = pokemonListData.pokemon.map(
    (pokemonEntry) => pokemonEntry.pokemon.url
  );
  for (let i = offset; filteredPokemons.length <= limit; i++) {
    const pokemonResponse = await fetch(pokemonUrls[i]);
    const pokemonDetails = await pokemonResponse.json();
    filteredPokemons.push(pokemonDetails);
    offset++;
  }
  renderAllPokemonCards(filteredPokemons, loadMore);
}

async function filterByGeneration(generation, offset = 0, limit = 15, filteredPokemons = [], loadmore = false) {
  toggleLoadingScreen(true);
  let loadbtn = document.getElementById("load-more-button");
  currentFilter = { type: null, generation };
  try {
    await fetchGenerationPokemon(generation, offset, limit, filteredPokemons, loadmore);
  } catch (error) {
    console.error("Fehler beim Filtern nach Generation:", error);
  } finally {
    loadbtn.setAttribute("onclick", `loadMoreTypesOrGeneration(${offset})`);
    toggleLoadingScreen(false);
  }
}

async function fetchGenerationPokemon( generation, offset, limit, filteredPokemons, loadmore) {
  const generationResponse = await fetch(
    `https://pokeapi.co/api/v2/generation/${generation}`
  );
  const generationData = await generationResponse.json();

  const speciesUrls = generationData.pokemon_species.map(
    (species) => `https://pokeapi.co/api/v2/pokemon/${species.name}`
  );

  for (let i = offset; filteredPokemons.length <= limit; i++) {
    const pokemonResponse = await fetch(speciesUrls[i]);
    const pokemonDetails = await pokemonResponse.json();
    filteredPokemons.push(pokemonDetails);
    offset++;
  }
  renderAllPokemonCards(filteredPokemons, loadmore);
}

function loadMoreTypesOrGeneration(offset, filteredPokemons = []) {
  if (currentFilter.type) {
    filterByType(currentFilter.type, offset + 16, 15, filteredPokemons, true);
  } else if (currentFilter.generation) {
    filterByGeneration(currentFilter.generation, offset + 16, 15, filteredPokemons, true);
  }
}

function generateTypeOptions(types) {
  let options = "";
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    options += `<li><button class="dropdown-item" onclick="filterByType('${
      type.name
    }')">${capitalize(type.name)}</button></li>`;
  }
  return options;
}

function generateGenerationOptions(generations) {
  let options = "";
  for (let i = 0; i < generations.length; i++) {
    const displayName = `Generation ${i + 1}`;
    options += `<li><button class="dropdown-item" onclick="filterByGeneration(${
      i + 1
    })">${displayName}</button></li>`;
  }
  return options;
}
