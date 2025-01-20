let allPokemon = [];
let offset = 0;
let isLoading = false;
let currentPokemon = [];
let globalEvolutions = [];
let pokemonTypes = [];
let pokemonGenerations = [];

const typeColors = {
    fire: "linear-gradient(135deg, #ff4500, #ff8c00, #ffd700, #ffffff)",
    water: "linear-gradient(135deg, #2196F3, #90CAF9, #BBDEFB)",
    electric: "linear-gradient(135deg, #FFEB3B, #FFC107, #FFD54F)",
    poison: "linear-gradient(135deg, #A040A0, #D580D8, #E0BFE0)",
    grass: "linear-gradient(135deg, #4CAF50, #81C784, #C8E6C9)",
    ground: "linear-gradient(135deg, #8B4513, #DEB887, #FFE4C4)",
    psychic: "linear-gradient(135deg, #FF4081, #F48FB1, #FCE4EC)",
    rock: "linear-gradient(135deg, #A0522D, #D2B48C, #EEDAC7)",
    ghost: "linear-gradient(135deg, #6A5ACD, #BDB3F5, #E6E0FF)",
    dragon: "linear-gradient(135deg, #004170, #5DADE2, #A9CCE3)",
    normal: "linear-gradient(135deg, #E0E0E0, #F5F5F5, #FFFFFF)",
    fairy: "linear-gradient(135deg, #FFC0CB, #F8BBD0, #FFEBEE)",
};

const typeIcons = {
    fire: "./assets/typeIcons/Battrio_Fire_type.png",
    water: "./assets/typeIcons/Battrio_Water_type.png",
    electric: "./assets/typeIcons/Battrio_Electric_type.png",
    grass: "./assets/typeIcons/Battrio_Grass_type.png",
    poison: "./assets/typeIcons/Battrio_Poison_type.png",
    ground: "./assets/typeIcons/Battrio_Ground_type.png",
    psychic: "./assets/typeIcons/Battrio_Psychic_type.png",
    rock: "./assets/typeIcons/Battrio_Rock_type.png",
    ghost: "./assets/typeIcons/Battrio_Ghost_type.png",
    dragon: "./assets/typeIcons/Battrio_Dragon_type.png",
    dark: "./assets/typeIcons/Battrio_Dark_type.png",
    steel: "./assets/typeIcons/Battrio_Steel_type.png",
    fairy: "./assets/typeIcons/Battrio_Fairy_type.png",
    normal: "./assets/typeIcons/Battrio_Normal_type.png",
    fighting: "./assets/typeIcons/Battrio_Fighting_type.png",
    ice: "./assets/typeIcons/Battrio_Ice_type.png",
    flying: "./assets/typeIcons/Battrio_Flying_type.png",
    bug: "./assets/typeIcons/Battrio_Bug_type.png",
};

const colors = ['#ff4d4d', '#4d94ff', '#ffd24d', '#4dff88', '#a64dff', '#ffa64d'];
