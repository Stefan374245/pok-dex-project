async function init() {
  toggleLoadingScreen(true);
  await fetchAllPokemons();
  currentPokemon = [...allPokemon];
  pokemonTypes = await fetchTypesFromAPI();
  pokemonGenerations = await fetchGenerationsFromAPI();
  renderCategory();
  toggleLoadingScreen(false);
  document.getElementById("search-bar").addEventListener("blur", resetSearch);
  fetchALLPokemonToSearch();
  setupMusicControls();
}

function playMusic(skip = false) {
  if (skip) {
    nextTrack();
  } else {
    if (AUDIO_backgroundMusic.paused) {
      AUDIO_backgroundMusic.play();
    } else {
      AUDIO_backgroundMusic.pause();
    }
  }
}

function setupMusicControls() {
  document.addEventListener("click", playMusic, { once: true });
  document.getElementById("music-toggle").addEventListener("click", () => playMusic());
  document.getElementById("skip-track").addEventListener("click", () => playMusic(true));
  AUDIO_backgroundMusic.addEventListener("ended", nextTrack);
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % soundtracks.length;
  AUDIO_backgroundMusic.src = soundtracks[currentTrackIndex];
  AUDIO_backgroundMusic.play();
}

async function fetchToJson(url) {
  const response = await fetch(url);
  return response.json();
}

async function fetchALLPokemonToSearch() {
  try {
    const pokemonListData = await fetchToJson("https://pokeapi.co/api/v2/pokemon?limit=1010");
    const batchSize = 50;
    for (let i = 20; i < pokemonListData.results.length; i += batchSize) {
      const batch = pokemonListData.results.slice(i, i + batchSize);
      const batchPokemon = await Promise.all(batch.map(pokemon => fetchToJson(pokemon.url)));
      allPokemon = [...allPokemon, ...batchPokemon];
    }
  } catch (error) {
    console.error("Fehler beim Laden aller Pokémon:", error);
  }
}

async function fetchAllPokemons() {
  const display = document.getElementById("pokemon-display");
  try {
    const pokemonListData = await fetchToJson(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
    const newPokemons = await Promise.all(pokemonListData.results.map(pokemon => fetchToJson(pokemon.url)));
    allPokemon = [...allPokemon, ...newPokemons];
    renderAllPokemonCards(newPokemons);
    offset += 20;
  } catch (error) {
    display.innerHTML = `<p>Fehler beim Laden der Pokémon: ${error.message}</p>`;
  } finally {
    toggleLoadingScreen(false);
  }
}

async function fetchAllPokemonDetails(limit = 15) {
  try {
    const pokemonListData = await fetchToJson("https://pokeapi.co/api/v2/pokemon?limit=1010");
    const allPokemonDetails = [];
    for (let i = 0; i < pokemonListData.results.length; i++) {
      const pokemonInfo = await fetchToJson(pokemonListData.results[i].url);
      allPokemonDetails.push(pokemonInfo);
      if (allPokemonDetails.length >= limit) {
        return allPokemonDetails;
      }
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Pokémon-Details:", error);
  }
}

async function fetchTypesFromAPI() {
  try {
    return (await fetchToJson("https://pokeapi.co/api/v2/type/")).results;
  } catch (error) {
    console.error("Fehler beim Abrufen der Typen:", error);
    return [];
  }
}

async function fetchGenerationsFromAPI() {
  try {
    return (await fetchToJson("https://pokeapi.co/api/v2/generation/")).results;
  } catch (error) {
    console.error("Fehler beim Abrufen der Generationen:", error);
    return [];
  }
}

async function fetchMorePokemons() {
  toggleLoadingScreen(true);
  try {
    await fetchAllPokemons();
  } catch (error) {
    console.error("Fehler beim Laden weiterer Pokémon:", error);
  } finally {
    toggleLoadingScreen(false);
  }
}

async function fetchEvolutions(pokemonId) {
  try {
    const speciesData = await fetchToJson(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    const evolutionData = await fetchToJson(speciesData.evolution_chain.url);
    let current = evolutionData.chain;
    globalEvolutions = [];
    while (current) {
      const id = current.species.url.split("/").slice(-2, -1)[0];
      globalEvolutions.push({ id, name: current.species.name });
      current = current.evolves_to[0];}
    return globalEvolutions;
  } catch (error) { console.error("Fehler beim Abrufen der Evolutionsdaten:", error);
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
  AUDIO_nextPkmn.play();
  renderOverlay(currentPokemonIndex, evolutions);
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
