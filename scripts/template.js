function pokemonCardTemplate(pokemon) {
  const pokemonType = pokemon.types[0].type.name || "Unbekannt";
  const cardColor =
    typeColors[pokemonType] || "linear-gradient(135deg, #e0e0e0, #ffffff)";
  const artworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  const typeIcon = typeIcons[pokemonType] || "";

  return `
        <div class="card pokemon-card text-center" style="background: ${cardColor}">
          <div class="card-header bg-light">
            <span class="card-title"><b>${
              pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
            }</b></span>
          <span class="card-hp">
          KP ${pokemon.stats[0].base_stat}
          <img src="${typeIcon}" alt="${pokemonType}" class="type-icon ms-2">
        </span>
        </div>
        <div class="card-body">
          <img onclick="openPokemonOverlay(${
            pokemon.id
          })" class="card-image img-fluid" src="${artworkUrl}" alt="${
    pokemon.name
  }">
        </div>
        <div class="card-body card-info">
        <hr>
          <p class="text-muted">${getTypeText(pokemon.types)} </p>
          <div class ="card-hp">
           <img onclick="openPokemonOverlay(${
             pokemon.id
           })" src="${typeIcon}" alt="${pokemonType}" class="type-icon ms-2 ">
           </div>
          <hr>
          <button onclick="openPokemonOverlay(${
            pokemon.id
          })" type="button" class="btn btn-danger">Info</button>
        </div>
      </div>
`;
}

function overlayTemplate(pokemon, evolutions) {
  const artworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  const typeNames = getTypeText(pokemon.types);

  return `
  <div class="overlay-content">
    <button onclick="closePokemonOverlay()" class="btn-close-white btn-close"></button>
        <button class="carousel-control-prev">
          <span onclick="navigatePokemon(-1)" class="carousel-control-prev-icon prev-btn-pkmn"></span>
          <span  class="visually-hidden">Vorherige</span>
        </button>
        <button class="carousel-control-next">
          <span onclick="navigatePokemon(1)" class="carousel-control-next-icon next-btn-pkmn"></span>
          <span class="visually-hidden">Nächste</span>
        </button>
        
      <h1>${ pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }</h1>
      <img src="${artworkUrl}" alt="${pokemon.name}" class="img-fluid overlay-img" />
      <p>${typeNames}</p>

  <div id="pokemonCarousel" class="carousel slide mt-4" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button
        type="button"
        data-bs-target="#pokemonCarousel"
        data-bs-slide-to="0"
        class="active"
        aria-current="true"
        aria-label="Main"
      ></button>
      <button
        type="button"
        data-bs-target="#pokemonCarousel"
        data-bs-slide-to="1"
        aria-label="Stats"
      ></button>
      <button
        type="button"
        data-bs-target="#pokemonCarousel"
        data-bs-slide-to="2"
        aria-label="Evolutions"
      ></button>
    </div>
    <div class="carousel-inner">
      <div class="carousel-item active show">
        <div class="carousel-caption d-md-block">
          <h5>Statistik</h5>
          <div class="stats-bar-chart"></div>
          <div class="stat-legend">
            <span
              ><div class="legend-box max"></div>
              Stärkstes Pokémon</span
            >
          </div>
        </div>
      </div>
      <div class="carousel-item show">
        <div class="carousel-caption d-md-block">
          <h5>Basis-Attribute</h5>
          <p>Größe: ${(pokemon.height / 10).toFixed(1)} m</p>
          <p>Gewicht: ${(pokemon.weight / 10).toFixed(1)} kg</p>
          <div class="card-moves">
            <h3>
              ${ pokemon.moves[0]?.move.name ?
              pokemon.moves[0].move.name.charAt(0).toUpperCase() +
              pokemon.moves[0].move.name.slice(1) : "Unbekannt" }
              <span class="badge bg-danger damage"
                >Damage ${ pokemon.moves[0]?.move.name ?
                Math.floor(Math.random() * 50 + 10) : "?" }</span
              >
            </h3>
            <h3>
              ${ pokemon.moves[1]?.move.name ?
              pokemon.moves[1].move.name.charAt(0).toUpperCase() +
              pokemon.moves[1].move.name.slice(1) : "Unbekannt" }
              <span class="badge bg-danger damage"
                >Damage ${ pokemon.moves[1]?.move.name ?
                Math.floor(Math.random() * 50 + 10) : "?" }</span
              >
            </h3>
          </div>
        </div>
      </div>
      <div class="carousel-item show">
        <div
          class="carousel-caption carousel-caption-evo d-md-block evolution-imgs"
        >
          <h5>Evolution</h5>

          ${renderEvolutionCard(evolutions)}
        </div>
      </div>
    </div>
    <div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#pokemonCarousel"
        data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Vorherige</span>
      </button>
      <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#pokemonCarousel"
          data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Nächste</span>
        </button>
    </div>
  </div>
  `;
}

function evolutionHtmlTemplate(evo) {
  return `
      <div class="text-center">
      <div class="evolution-section">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
            evo.id
          }.png" alt="${evo.name}" class="img-fluid evo-img">
          <p>${evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}</p>
      </div>
          </div>
  `;
}

function getTypeText(types) {
  let typeText = "";
  for (let i = 0; i < types.length; i++) {
    typeText += `<span class="pokemon-type">${types[
      i
    ].type.name.toUpperCase()}</span>`;
    if (i < types.length - 1) {
      typeText += " / ";
    }
  }
  return typeText;
}

function filterTemplate() {
  const typeOptions = generateTypeOptions(pokemonTypes);
  const generationOptions = generateGenerationOptions(pokemonGenerations);
  const bestOfOptions = generateBestOfOptions();

  return `
    <div id="filter-controls" class="filter-controls">
      <div class="dropdown">
        <button class="btn btn-warning custom-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Filter nach Typ
        </button>
        <ul class="dropdown-menu">
          ${typeOptions}
        </ul>
      </div>
      <div class="dropdown">
        <button class="btn btn-warning custom-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Filter nach Generation
        </button>
        <ul class="dropdown-menu">
          ${generationOptions}
        </ul>
      </div>
      <div class="dropdown">
        <button class="btn btn-warning custom-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Best-of
        </button>
        <ul class="dropdown-menu">
          ${bestOfOptions}
        </ul>
      </div>
    </div>
  `;
}

function generateTypeOptions(types) {
  let options = "";
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    options += `<li><button class="dropdown-item" onclick="filterByType('${type.name}')">${capitalize(type.name)}</button></li>`;
  }
  return options;
}

function generateGenerationOptions(generations) {
  let options = "";
  for (let i = 0; i < generations.length; i++) {
    const displayName = `Generation ${i + 1}`;
    options += `<li><button class="dropdown-item" onclick="filterByGeneration(${i + 1})">${displayName}</button></li>`;
  }
  return options;
}

function generateBestOfOptions() {
  let options = "";
  const bestOfCategories = [
    { label: "Höchste Werte", action: "showBestStats()" },
    { label: "Stärkster Angreifer", action: "showHighestAttack()" },
    { label: "Schnellstes Pokémon", action: "showHighestSpeed()" },
  ];

  for (let i = 0; i < bestOfCategories.length; i++) {
    const category = bestOfCategories[i];
    options += `<li><button class="dropdown-item" onclick="${category.action}">${category.label}</button></li>`;
  }
  return options;
}