// Variables
var pokemonTeams = [];
const teamcontainer = document.getElementsByClassName("teams-container")[0];
var currentTeamIndex = null;
const searchInput = document.getElementById("pokemon-search");
let debounceTimeout;

// Utility Functions
function searchPokemon(searchTerm) {
  if (searchTerm === "") {
    document.getElementById("search-results").innerHTML = "";
  } else {
    fetch(`https://pokeapi.co/api/v2/pokemon-species?limit=1025`)
      .then((response) => response.json())
      .then((data) => {
        let results = data.results;
        let filteredResults = results.filter((result) =>
          result.name.includes(searchTerm.toLowerCase())
        );
        renderSearchResults(filteredResults);
      });
  }
}

function renderSearchResults(results) {
  let searchResults = document.getElementById("search-results");
  searchResults.innerHTML = "";
  results.forEach((result) => {
    let pokemonResult = document.createElement("div");
    pokemonResult.classList.add("pokemon-result");
    fetch(result.url.replace("-species", ""))
      .then((response) => response.json())
      .then((data) => {
        let pokemon = data;
        let pokemonSprite = pokemon.sprites.front_default;
        let pokemonName = pokemon.name;
        let pokemonTypes = pokemon.types.map((type) => type.type.name);
        pokemonResult.innerHTML = `
            <img src="${pokemonSprite}" alt="${pokemonName}" />
            <span>${
              pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
            }</span>
            <div class="types">
            ${pokemonTypes
              .map((type) => `<span class="type ${type}">${type}</span>`)
              .join("")}
            </div>
            `;
      });
    pokemonResult.addEventListener("click", () => {
      if (
        currentTeamIndex !== null &&
        pokemonTeams[currentTeamIndex].pokemon.length < 6
      ) {
        const pokemon = {
          name: result.name,
          url: result.url,
        };
        addPokemon(pokemon, currentTeamIndex);
        currTeamPKMN(currentTeamIndex);
      } else {
        alert(
          "Please select a team or remove a Pokemon from the current team."
        );
      }
    });
    searchResults.appendChild(pokemonResult);
  });
}

function editTeamName(teamIndex) {
  currentTeamIndex = teamIndex;
  document
    .getElementsByClassName("team-creation-form")[0]
    .classList.add("Active");
  document.getElementsByClassName("edit-team-name")[0].classList.add("Active");
  document.getElementsByClassName("tcf-part-1")[0].classList.remove("Active");
  document.getElementsByClassName("tcf-part-2")[0].classList.remove("Active");
}

function saveTeamName() {
  let teamName = document.getElementById("new-team-name").value;
  if (teamName) {
    pokemonTeams[currentTeamIndex].name = teamName;
    document
      .getElementsByClassName("team-creation-form")[0]
      .classList.remove("Active");
    document
      .getElementsByClassName("edit-team-name")[0]
      .classList.remove("Active");
    document.getElementById("new-team-name").value = "";
    renderTeams();
  } else {
    alert("Please enter a team name.");
  }
}

function renderTeams() {
  teamcontainer.innerHTML = "";
  pokemonTeams.forEach((team, teamIndex) => {
    let teamElement = document.createElement("div");
    teamElement.classList.add("team");
    teamElement.innerHTML = `
        <h3>${team.name}</h3>
        <div class="team-pokemon"></div>
        <div class="team-actions">
            <button onclick="addPokemonButton(${teamIndex})">Add Pokemon</button>
            <button onclick="editTeamName(${teamIndex})">Edit Team Name</button>
            <button onclick="removeTeam(${teamIndex})">Delete Team</button>
        </div>
        `;
    let teamPokemon = teamElement.getElementsByClassName("team-pokemon")[0];
    team.pokemon.forEach((pokemon, pokemonIndex) => {
      let pokemonElement = document.createElement("div");
      pokemonElement.classList.add("pokemon");
      fetch(pokemon.url.replace("-species", ""))
        .then((response) => response.json())
        .then((data) => {
          let pokemonSprite = data.sprites.front_default;
          let pokemonName = data.name;
          let pokemonTypes = data.types.map((type) => type.type.name);
          pokemonElement.innerHTML = `
                <img src="${pokemonSprite}" alt="${pokemonName}" />
                <span>${
                  pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
                }</span>
                <div class="types">
                ${pokemonTypes
                  .map((type) => `<span class="type ${type}">${type}</span>`)
                  .join("")}
                </div>
                `;
          pokemonElement.addEventListener("click", () => {
            removePokemon(pokemonIndex, teamIndex);
          });
        });
      teamPokemon.appendChild(pokemonElement);
    });
    teamcontainer.appendChild(teamElement);
  });
}

function currTeamPKMN(teamIndex) {
  let formTeam = document.getElementsByClassName("pokemon-team")[0];
  formTeam.innerHTML = "";
  let team = pokemonTeams[teamIndex];
  let currentTeam = document.createElement("div");
  currentTeam.classList.add("current-team");
  team.pokemon.forEach((pokemon, pokemonIndex) => {
    let pokemonElement = document.createElement("div");
    pokemonElement.classList.add("pokemon");
    fetch(pokemon.url.replace("-species", ""))
      .then((response) => response.json())
      .then((data) => {
        let pokemonSprite = data.sprites.front_default;
        let pokemonName = data.name;
        let pokemonTypes = data.types.map((type) => type.type.name);
        pokemonElement.innerHTML = `
                    <img src="${pokemonSprite}" alt="${pokemonName}" />
                    <span>${
                      pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
                    }</span>
                    <div class="types">
                    ${pokemonTypes
                      .map(
                        (type) => `<span class="type ${type}">${type}</span>`
                      )
                      .join("")}
                    </div>
                    `;
        pokemonElement.addEventListener("click", () => {
          removePokemon(pokemonIndex, teamIndex);
        });
      });
    currentTeam.appendChild(pokemonElement);
  });
  formTeam.appendChild(currentTeam);
}

// Event Listeners
searchInput.addEventListener("keyup", (e) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    searchPokemon(e.target.value);
  }, 300);
});

// DOM Manipulation Functions
function createTeamButton() {
  document.getElementById("team-name").value = "";
  document
    .getElementsByClassName("team-creation-form")[0]
    .classList.add("Active");
  document.getElementsByClassName("tcf-part-1")[0].classList.add("Active");
  document.getElementsByClassName("tcf-part-2")[0].classList.remove("Active");
  document
    .getElementsByClassName("edit-team-name")[0]
    .classList.remove("Active");
}

function closeTeamCreation() {
  document
    .getElementsByClassName("team-creation-form")[0]
    .classList.remove("Active");
  document.getElementById("pokemon-search").value = "";
  searchPokemon("");
  renderTeams();
  document.getElementsByClassName("tcf-part-1")[0].classList.remove("Active");
  document.getElementsByClassName("tcf-part-2")[0].classList.remove("Active");
  document
    .getElementsByClassName("edit-team-name")[0]
    .classList.remove("Active");
  document.getElementById("new-team-name").value = "";
}

// Team Management Functions
function addPokemon(pokemon, teamIndex) {
  pokemonTeams[teamIndex].pokemon.push(pokemon);
  renderTeams();
  currTeamPKMN(teamIndex);
}

function removePokemon(pokemonIndex, teamIndex) {
  pokemonTeams[teamIndex].pokemon.splice(pokemonIndex, 1);
  renderTeams();
  currTeamPKMN(teamIndex);
}

function createTeam() {
  let teamName = document.getElementById("team-name").value;
  if (teamName) {
    let team = {
      name: teamName,
      pokemon: [],
    };
    pokemonTeams.push(team);
    currentTeamIndex = pokemonTeams.length - 1;
    document.getElementsByClassName("tcf-part-1")[0].classList.remove("Active");
    document.getElementById("team-name").value = "";
    currTeamPKMN(currentTeamIndex);
    document.getElementById("pokemon-search").value = "";
    document.getElementsByClassName("tcf-part-2")[0].classList.add("Active");
  } else {
    alert("Please enter a team name.");
  }
}

function finishTeam() {
  document.getElementsByClassName("tcf-part-1")[0].classList.remove("Active");
  document.getElementsByClassName("tcf-part-2")[0].classList.remove("Active");
  document
    .getElementsByClassName("team-creation-form")[0]
    .classList.remove("Active");
  document.getElementById("pokemon-search").value = "";
  searchPokemon("");
  renderTeams();
  document.getElementById("new-team-name").value = "";
  document
    .getElementsByClassName("edit-team-name")[0]
    .classList.remove("Active");
}

function addPokemonButton(teamIndex) {
  currentTeamIndex = teamIndex;
  document
    .getElementsByClassName("team-creation-form")[0]
    .classList.add("Active");
  document.getElementsByClassName("tcf-part-1")[0].classList.remove("Active");
  document.getElementsByClassName("tcf-part-2")[0].classList.add("Active");
  document
    .getElementsByClassName("edit-team-name")[0]
    .classList.remove("Active");
}

function removeTeam(teamIndex) {
  pokemonTeams.splice(teamIndex, 1);
  renderTeams();
}
