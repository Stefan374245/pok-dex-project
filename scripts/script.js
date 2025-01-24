async function init() {
  await fetchAllPokemons();
  currentPokemon = allPokemon;
  renderAllPokemonCards(currentPokemon);

  pokemonTypes = await fetchTypesFromAPI();
  pokemonGenerations = await fetchGenerationsFromAPI();
  renderCategory();
}

async function fetchAllPokemons() {
  const display = document.getElementById("pokemon-display");
  toggleLoadingScreen(true);

  try {
    const pokemonListResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`
    );
    const pokemonListData = await pokemonListResponse.json();

    for (let j = 0; j < pokemonListData.results.length; j++) {
      const pokemonInfoResponse = await fetch(pokemonListData.results[j].url);
      const pokemonInfo = await pokemonInfoResponse.json();
      allPokemon.push(pokemonInfo);
    }

    renderAllPokemonCards(allPokemon);
    offset += 20;
  } catch (error) {
    display.innerHTML = `<p>Fehler beim Laden der Pokémon: ${error.message}</p>`;
  } finally {
    toggleLoadingScreen(false);
  }
}

async function fetchAllPokemonDetails(limit = 15) {
  const pokemonListResponse = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=1010"
  );
const pokemonListData = await pokemonListResponse.json();  
  const allPokemonDetails = [];

  for (let i = 0; i < pokemonListData.results.length; i++) {
    const pokemonInfoResponse = await fetch(pokemonListData.results[i].url);
    const pokemonInfo = await pokemonInfoResponse.json();
    allPokemonDetails.push(pokemonInfo);

    if (allPokemonDetails.length >= limit) {
      return allPokemonDetails;
    }
  }
}

async function fetchMorePokemons() {
  if (isLoading) return;
  isLoading = true;
  await fetchAllPokemons();
  isLoading = false;
}

async function fetchEvolutions(pokemonId) {
  try {
    const speciesData = await (
      await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
    ).json();
    const evolutionData = await (
      await fetch(speciesData.evolution_chain.url)
    ).json();
    let current = evolutionData.chain;
    const evolutions = [];
    while (current) {
      const id = current.species.url.split("/").slice(-2, -1)[0];
      evolutions.push({ id, name: current.species.name });
      current = current.evolves_to[0];
    }
    return evolutions;
  } catch (error) {
    console.error("Fehler beim Abrufen der Evolutionsdaten:", error);
    return [];
  }
}

function toggleLoadingScreen(show) {
  const loadingScreen = document.getElementById("loading-screen");
  const body = document.body;
  if (show) {
    loadingScreen.classList.remove("d-none");
    body.style.overflow = "hidden";
  } else {
    loadingScreen.classList.add("d-none");
    body.style.overflow = "";
  }
}

async function navigatePokemon(direction) {
  if (!currentPokemon || currentPokemon.length === 0) {
    return;
  }
  currentPokemonIndex += direction;
  if (currentPokemonIndex < 0) {
    currentPokemonIndex = allPokemon.length - 1;
  } else if (currentPokemonIndex >= allPokemon.length) {
    currentPokemonIndex = 0;
  }
  const pokemon = currentPokemon[currentPokemonIndex];
  const evolutions = await fetchEvolutions(pokemon.id);
  renderOverlay(currentPokemonIndex, evolutions);
}

async function fetchTypesFromAPI() {
  const cachedTypes = localStorage.getItem("pokemonTypes");
  if (cachedTypes) {
    return JSON.parse(cachedTypes);
  }
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type/");
    const data = await response.json();

    localStorage.setItem("pokemonTypes", JSON.stringify(data.results));
    return data.results;
  } catch (error) {
    console.error("Fehler beim Abrufen der Typen:", error);
    return [];
  }
}

async function fetchGenerationsFromAPI() {
  const cachedGenerations = localStorage.getItem("pokemonGenerations");
  if (cachedGenerations) {
    return JSON.parse(cachedGenerations);
  }
  try {
    const response = await fetch("https://pokeapi.co/api/v2/generation/");
    const data = await response.json();

    localStorage.setItem("pokemonGenerations", JSON.stringify(data.results));

    return data.results;
  } catch (error) {
    console.error("Fehler beim Abrufen der Generationen:", error);
    return [];
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
