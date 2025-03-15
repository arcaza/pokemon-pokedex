import React, { useState, useEffect } from "react";

function App() {
  const [pokemon, setPokemon] = useState("");
  const [pokemonData, setPokemonData] = useState(null);

  const [randomPokemon, setRandomPokemon] = useState([]);

  useEffect(() => {
    fetchRandomPokemons();
  }, []);

  const fetchPokemonData = async (pokemon) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`
      );
      if (!response.ok) {
        throw new Error("No pokemon found");
      }
      const data = await response.json();
      setPokemonData(data);
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchRandomPokemons = async () => {
    const randomIds = Array.from(
      { length: 10 },
      () => Math.floor(Math.random() * 898) + 1
    );
    const promises = randomIds.map((id) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json())
    );

    try {
      const data = await Promise.all(promises);
      setRandomPokemon(data);
    } catch (error) {
      console.log("Error in fetching random pokemon", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pokemon.trim() === "") return;
    fetchPokemonData(pokemon);
  };

  const handleChange = (value) => {
    setPokemon(value);
  };

  const handleClick = (value) => {
    setPokemon(value);
    fetchPokemonData(value);
    setPokemon("");
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          value={pokemon}
          onChange={(e) => handleChange(e.target.value)}
        />
        <button type="submit">Get Pokemon Data</button>
      </form>
      {pokemonData && (
        <div>
          <h2>
            {pokemonData.name.charAt(0).toUpperCase() +
              pokemonData.name.slice(1)}
          </h2>
          <img src={pokemonData.sprites.front_default} />
          <p>
            {pokemonData.abilities.length === 1 ? "Ability: " : "Abilities: "}{" "}
            {pokemonData.abilities
              .map(
                (ability) =>
                  ability.ability.name.charAt(0).toUpperCase() +
                  ability.ability.name.slice(1)
              )
              .join(", ")}
          </p>
          <p>
            {pokemonData.types.length === 1 ? "Type: " : "Types: "}{" "}
            {pokemonData.types
              .map(
                (type) =>
                  type.type.name.charAt(0).toUpperCase() +
                  type.type.name.slice(1)
              )
              .join(", ")}
          </p>
          <p>Height: {pokemonData.height / 10} meters</p>
          <p>Weight: {pokemonData.weight / 10} kilograms</p>
          <p>
            Stats:
            <div>
              {pokemonData.stats
                .map(
                  (stat) =>
                    `${
                      stat.stat.name.charAt(0).toUpperCase() +
                      stat.stat.name.slice(1)
                    }: ${stat.base_stat}`
                )
                .join(", ")}
            </div>
          </p>
        </div>
      )}

      <div>
        <button onClick={() => fetchRandomPokemons()}>
          Get Random Pokemon
        </button>
        {randomPokemon.map((pokemon, idx) => (
          <li key={idx}>
            <button onClick={() => handleClick(pokemon.name)}>
              <p>
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </p>
              <img src={pokemon.sprites.front_default} />
            </button>
          </li>
        ))}
      </div>
    </div>
  );
}

export default App;
