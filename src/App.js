import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);

  // Récupère la liste des Pokémon avec leurs noms français
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        // Récupère les 151 Pokémon de l'API
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = response.data.results;

        // Pour chaque Pokémon, récupère ses détails + nom français
        const pokemonDetails = await Promise.all(
          data.map(async (pokemon) => {
            const pokemonData = await axios.get(pokemon.url);
            const speciesData = await axios.get(
              `https://pokeapi.co/api/v2/pokemon-species/${pokemonData.data.id}`
            );

            const frenchName = speciesData.data.names.find(
              (entry) => entry.language.name === "fr"
            );

            return {
              name: frenchName ? frenchName.name : pokemon.name, // Nom en français
              image: pokemonData.data.sprites.front_default,    // Image
            };
          })
        );

        setPokemons(pokemonDetails);
      } catch (error) {
        console.error("Erreur lors de la récupération des Pokémon", error);
      }
    };

    fetchPokemons();
  }, []); // Exécution une fois au montage

  // Fonction pour prononcer le nom du Pokémon
  const speakPokemonName = (name) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(name); // Texte à prononcer

      // Configuration de la langue française pour la prononciation
      utterance.lang = "fr-FR";

      synth.speak(utterance); // Déclenche la prononciation
    } else {
      console.error("La synthèse vocale n'est pas supportée par votre navigateur.");
    }
  };

  return (
    <div className="App">
      <h1>Liste des Pokémon</h1>
      
      <div className="pokemon-list">
        {pokemons.map((pokemon, index) => (
          <div key={index} className="pokemon-item">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              onClick={() => speakPokemonName(pokemon.name)} // Déclenche la prononciation
              className="pokemon-image"
              style={{ cursor: "pointer" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
