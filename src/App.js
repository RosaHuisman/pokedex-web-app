import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Récupère la liste de Pokémon depuis l'API
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        // PokeAPI avec paginage, nous récupérons 151 Pokémon pour l'exemple
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = response.data.results;
        
        // Pour chaque Pokémon, on récupère ses détails et son image
        const pokemonDetails = await Promise.all(
          data.map(async (pokemon) => {
            const pokemonData = await axios.get(pokemon.url);
            return {
              name: pokemon.name,
              image: pokemonData.data.sprites.front_default, // L'image de chaque Pokémon
            };
          })
        );

        setPokemons(pokemonDetails);
      } catch (error) {
        console.error("Erreur lors de la récupération des Pokémon", error);
      }
    };
    
    fetchPokemons();
  }, []); // Exécution une fois au chargement du composant

  // Affiche le nom du Pokémon lorsqu'on clique sur son image
  const handleImageClick = (name) => {
    setSelectedPokemon(name);
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
              onClick={() => handleImageClick(pokemon.name)}
              className="pokemon-image"
            />
          </div>
        ))}
      </div>

      {selectedPokemon && (
        <div className="pokemon-name">
          <h2>Nom du Pokémon : {selectedPokemon}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
