function renderAllPokemonCards(pokemonList, loadMore) {
    currentPokemon = pokemonList;
    const display = document.getElementById("pokemon-display");

    if(loadMore === false){
        display.innerHTML = "";
    }

    pokemonList.forEach((pokemon) => {
        display.innerHTML += pokemonCardTemplate(pokemon);
    });
};

function renderCategory() {
    const controlsContainer = document.getElementById("controls");
    if (!currentPokemon || currentPokemon.length === 0) {
      controlsContainer.innerHTML = `
        <p>Filter werden geladen...</p>
      `;
      return;
    }
    controlsContainer.innerHTML = filterTemplate(pokemonTypes, currentPokemon);
  };



async function renderOverlay(index, evolutions) {
    const overlay = document.getElementById("overlay");
    const pokemon = currentPokemon[index];
        if (!pokemon) {
            overlay.innerHTML = "<p>Fehler: Pokémon nicht gefunden.</p>";
            overlay.style.display = "flex";
        return;}
        currentPokemonIndex = index;
    if (!evolutions) {
        evolutions = await fetchEvolutions(pokemon.id);}
    overlay.innerHTML = overlayTemplate(pokemon, evolutions);
    overlay.style.display = "flex";
        document.body.style.overflow = "hidden";
    renderStatsBars(pokemon, currentPokemon);
};

function renderEvolutionCard(evolutions) {
    if (!evolutions || evolutions.length === 0) {
        return "<p>Keine Evolution verfügbar</p>";
    }
    let evolutionHtml = "";
    for (let i = 0; i < evolutions.length; i++) {
        const evo = evolutions[i];
        evolutionHtml += evolutionTemplate(evo);
    }
    return evolutionHtml;
};

function openPokemonOverlay(pokemonId) {
    AUDIO_openPkmn.play();
    const contentWrapper = document.getElementById("content-wrapper");
    let pokemon = null;
    let index = -1;

    for (let i = 0; i < currentPokemon.length; i++) {
        if (currentPokemon[i].id === pokemonId) {
            pokemon = currentPokemon[i];
            index = i;
            break;}}
    if (!pokemon) return;
    contentWrapper.classList.add("blur"); 
    renderOverlay(index);
};

function closePokemonOverlay() {
    const overlay = document.getElementById("overlay");
    const contentWrapper = document.getElementById("content-wrapper");

    overlay.style.display = "none";
    AUDIO_closeOverlay.play();
    contentWrapper.classList.remove("blur");
    document.body.style.overflow = "auto";
};