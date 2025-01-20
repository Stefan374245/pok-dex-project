function renderStatsBars(pokemon, allPokemonStats) {
    const chartContainer = document.querySelector('.stats-bar-chart');
    chartContainer.innerHTML = '';
  
    const labels = ['HP', 'Angriff', 'Verteidigung', 'Spez. Angriff', 'Spez. Verteidigung', 'Initiative'];
    const colors = ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff', '#ff9f40'];
 
    const maxStats = calculateMaxStats(allPokemonStats);
  
    let maxScale = 0;
    for (let i = 0; i < maxStats.length; i++) {
      if (maxStats[i] > maxScale) {
        maxScale = maxStats[i];
      }
    }
  
    let chartHTML = '';
    for (let i = 0; i < labels.length; i++) {
      chartHTML += createStatGroupHTML(
        labels[i],
        pokemon.stats[i]?.base_stat || 0,
        maxStats[i],
        maxScale,
        colors[i]
      );
    }
    chartContainer.innerHTML = chartHTML;
  }
  
  // Hilfs Functions

  function createStatGroupHTML(labelText, statValue, maxValue, maxScale, color) {
    const pokemonBarWidth = (statValue / maxScale) * 100;
  
    return `
      <div class="stat-group">
        <div class="stat-label">${labelText}</div>
        <div class="stat-bar-container">
          <div class="stat-bar max-bar" title="Stärkstes Pokémon: ${maxValue}"></div>
          <div class="stat-bar pokemon-bar" style="--pokemon-bar-width: ${pokemonBarWidth}%; --pokemon-bar-color: ${color};" title="${labelText}: ${statValue}"></div>
        </div>
      </div>
    `;
  }

  function renderEmptyStatsBars(labels) {
    let emptyStatsHTML = '';
    for (let i = 0; i < labels.length; i++) {
      emptyStatsHTML += `
        <div class="stat-group">
          <div class="stat-label">${labels[i]}</div>
          <div class="stat-bar-container">
            <div class="stat-bar empty-bar" title="Keine Daten">???</div>
          </div>
        </div>
      `;
    }
    return emptyStatsHTML;
  }

  function calculateAverageStats(allPokemonStats) {
    const totalStats = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < allPokemonStats.length; i++) {
      for (let j = 0; j < totalStats.length; j++) {
        totalStats[j] += allPokemonStats[i].stats[j].base_stat;
      }
    }
    const averages = [];
    for (let i = 0; i < totalStats.length; i++) {
      averages.push(Math.floor(totalStats[i] / allPokemonStats.length));
    }
    return averages;
  }

  function calculateMaxStats(allPokemonStats) {
    const maxStats = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < allPokemonStats.length; i++) {
      for (let j = 0; j < maxStats.length; j++) {
        if (allPokemonStats[i].stats[j].base_stat > maxStats[j]) {
          maxStats[j] = allPokemonStats[i].stats[j].base_stat;
        }
      }
    }
    return maxStats;
  }


