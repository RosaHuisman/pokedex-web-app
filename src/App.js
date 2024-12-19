import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);

  const generateRandomIds = (count, max) => {
    const ids = new Set();
    while (ids.size < count) {
      const randomId = Math.floor(Math.random() * max) + 1;
      ids.add(randomId);
    }
    return Array.from(ids);
  };

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const randomIds = generateRandomIds(150, 1010);

        const pokemonDetails = await Promise.all(
          randomIds.map(async (id) => {
            const pokemonData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const speciesData = await axios.get(
              `https://pokeapi.co/api/v2/pokemon-species/${id}`
            );

            const frenchName = speciesData.data.names.find(
              (entry) => entry.language.name === "fr"
            );

            const types = pokemonData.data.types.map((typeInfo) => typeInfo.type.name);

            return {
              name: frenchName ? frenchName.name : pokemonData.data.name,
              image: pokemonData.data.sprites.front_default,
              types,
            };
          })
        );

        setPokemons(pokemonDetails);
      } catch (error) {
        console.error("Erreur lors de la récupération des Pokémon aléatoires", error);
      }
    };

    fetchPokemons();
  }, []);

  const speakPokemonName = (name) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.lang = "fr-FR";
      synth.speak(utterance);
    } else {
      console.error("La synthèse vocale n'est pas supportée par votre navigateur.");
    }
  };

  return (
    <div className="App">
      <h1>Pokédex</h1>

      <div className="pokemon-list">
        {pokemons.map((pokemon, index) => (
          <div 
            key={index} 
            className="pokemon-item"
            onClick={() => speakPokemonName(pokemon.name)}
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="pokemon-img"
            />
            <div className="pokemon-infos">
              <p className="pokemon-name">{pokemon.name}</p>
              <div className="pokemon-types">
                {pokemon.types.map((type, idx) => (
                  <img
                    key={idx}
                    src={`/types/${type}.png`} // Chemin relatif à votre dossier public
                    alt={type}
                    title={type} // Affiche le nom du type au survol
                    className="type-icon"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
