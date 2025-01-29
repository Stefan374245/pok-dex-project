function filterAndShowPokemons(searchInput) {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const searchTerm = searchInput.toLowerCase();
    const display = document.getElementById("pokemon-display");

    if (!allPokemon || allPokemon.length === 0) {
      return;
    }
    display.innerHTML = "";
    if (searchTerm.length < 3) {
      display.innerHTML = "<p id='search-message'>Bitte mindestens 3 Buchstaben eingeben...</p>";
      return;
    }
    currentPokemon = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );

    if (currentPokemon.length === 0) {
      display.innerHTML = "<p>Keine Pokémon gefunden</p>";
    } else {
      renderAllPokemonCards(currentPokemon);
    }
  }, 300);
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
  let loadbtn = document.getElementById('load-more-button');
  currentFilter = { type, generation: null };

  try {
    const pokemonListResponse = await fetch("https://pokeapi.co/api/v2/type/" + type);
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

    renderAllPokemonCards(filteredPokemons, loadmore);
  } catch (error) {
    console.error("Fehler beim Filtern nach Typ:", error);
  } finally {
    loadbtn.setAttribute("onclick",`loadMoreTypesOrGeneration(${offset})`);
    toggleLoadingScreen(false);
  }
}

async function filterByGeneration(generation, offset = 0, limit = 15, filteredPokemons = [], loadmore = false) {
  toggleLoadingScreen(true);
  let loadbtn = document.getElementById('load-more-button');
  currentFilter = { type: null, generation };

  try {
    const generationResponse = await fetch( `https://pokeapi.co/api/v2/generation/${generation}`);
    const generationData = await generationResponse.json();

    const speciesUrls = generationData.pokemon_species.map((species) => `https://pokeapi.co/api/v2/pokemon/${species.name}`);
  
    for (let i = offset; filteredPokemons.length <= limit; i++) {
      const pokemonResponse = await fetch(speciesUrls[i]);
      const pokemonDetails = await pokemonResponse.json();
      filteredPokemons.push(pokemonDetails);
      offset++;
    }

      renderAllPokemonCards(filteredPokemons, loadmore);
  } catch (error) {
    console.error("Fehler beim Filtern nach Generation:", error);
  } finally {
    
    loadbtn.setAttribute("onclick",`loadMoreTypesOrGeneration(${offset})`);
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

function loadMoreTypesOrGeneration(offset, filteredPokemons = []) {
 
  if (currentFilter.type) {
    filterByType(currentFilter.type, offset, 15, filteredPokemons, true);
  } else if (currentFilter.generation) {
    filterByGeneration(currentFilter.generation, offset, 15, filteredPokemons, true);
  }
}


// Die Funktion filterAndShowPokemons dient dazu, Pokémon basierend auf einer Suchanfrage zu filtern und anzuzeigen.
//  Zunächst wird ein eventuell bestehender Timeout gelöscht, um sicherzustellen, dass die Suche nicht zu oft ausgeführt wird.
//   Dann wird ein neuer Timeout von 300 Millisekunden gesetzt, um die Eingabe des Benutzers abzuwarten. 
//   Innerhalb des Timeouts wird das Suchwort in Kleinbuchstaben umgewandelt und das Anzeigeelement für die Pokémon abgerufen.
//    Wenn keine Pokémon vorhanden sind, wird die Funktion beendet. Wenn das Suchwort weniger als drei Zeichen enthält,
//     wird eine Nachricht angezeigt, die den Benutzer auffordert, mindestens drei Buchstaben einzugeben.
//      Ansonsten werden die Pokémon gefiltert und entweder die gefilterten Pokémon oder eine Nachricht, 
//      dass keine Pokémon gefunden wurden, angezeigt.

// Die Funktion resetSearch setzt die Suchleiste und die Anzeige zurück. Wenn die Suchleiste leer ist,
//  wird die Anzeige geleert und die ersten 20 Pokémon werden angezeigt.

// Die Funktion filterByType filtert Pokémon nach ihrem Typ. Sie zeigt einen Ladebildschirm an und setzt den aktuellen Filter auf den angegebenen Typ.
//  Dann wird eine Liste von Pokémon-URLs basierend auf dem Typ abgerufen. Die Pokémon-Details werden nacheinander abgerufen und in eine Liste eingefügt,
//   bis das Limit erreicht ist. Schließlich werden die gefilterten Pokémon angezeigt und der Ladebildschirm wird ausgeblendet.

// Die Funktion filterByGeneration funktioniert ähnlich wie filterByType, filtert jedoch Pokémon nach ihrer Generation. 
// Sie zeigt ebenfalls einen Ladebildschirm an und setzt den aktuellen Filter auf die angegebene Generation. 
// Eine Liste von Pokémon-URLs basierend auf der Generation wird abgerufen und die Pokémon-Details werden nacheinander abgerufen und in eine Liste eingefügt,
//  bis das Limit erreicht ist. Schließlich werden die gefilterten Pokémon angezeigt und der Ladebildschirm wird ausgeblendet.

// Die Funktion fetchGenerationSpecies ruft die Arten von Pokémon einer bestimmten Generation ab.
//  Sie sendet eine Anfrage an die API und sammelt die Namen der Pokémon-Arten in einer Liste.
//  Bei einem Fehler wird eine Fehlermeldung ausgegeben und eine leere Liste zurückgegeben.

// Die Funktion loadMoreTypesOrGeneration lädt mehr Pokémon basierend auf dem aktuellen Filter (Typ oder Generation).
//  Sie ruft entweder filterByType oder filterByGeneration auf, um die nächsten Pokémon zu laden und anzuzeigen.