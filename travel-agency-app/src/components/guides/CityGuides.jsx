import React, { useState } from 'react';

const CityGuides = () => {
  const [selectedCity, setSelectedCity] = useState(null);

  const guides = [
    {
      id: "NYC",
      name: "New York City",
      description: "The city that never sleeps, offering endless entertainment and culture.",
      history: "Founded in 1624 by colonists from the Dutch Republic, it has grown to become the premier cultural and financial center of the United States. Its five boroughs are home to some of the world's most recognizable landmarks.",
      attractions: [
        { name: "Statue of Liberty", detail: "A colossal neoclassical sculpture on Liberty Island, a gift from the people of France." },
        { name: "Central Park", detail: "An urban park situated between the Upper West and Upper East Sides of Manhattan." },
        { name: "Times Square", detail: "A major commercial intersection, tourist destination, and entertainment center." },
        { name: "Empire State Building", detail: "A 102-story Art Deco skyscraper in Midtown Manhattan." },
        { name: "Brooklyn Bridge", detail: "A hybrid cable-stayed/suspension bridge spanning the East River." }
      ],
      dining: [
        { name: "Joe's Pizza", type: "Italian", review: "Classic NY slice since 1975." },
        { name: "Katz's Delicatessen", type: "Jewish Deli", review: "World-famous pastrami sandwiches." },
        { name: "Le Bernardin", type: "French Seafood", review: "Elite dining experience with exquisite dishes." }
      ],
      transportation: "The MTA operates the subways and buses 24/7, making it easy to navigate the city at any hour."
    },
    {
      id: "PAR",
      name: "Paris",
      description: "The city of light, love, and incredible gastronomy.",
      history: "With a history dating back to the 3rd century BC, Paris is known for its Gothic, Renaissance, and neoclassical architecture, as well as its profound influence on art, fashion, and culture.",
      attractions: [
        { name: "Eiffel Tower", detail: "A wrought-iron lattice tower on the Champ de Mars." },
        { name: "Louvre Museum", detail: "The world's largest art museum and a historic monument in Paris." },
        { name: "Notre-Dame Cathedral", detail: "A medieval Catholic cathedral on the Ile de la Cite." },
        { name: "Arc de Triomphe", detail: "One of the most famous monuments in Paris, honoring those who fought for France." },
        { name: "Sacré-Cœur", detail: "A Roman Catholic church and minor basilica dedicated to the Sacred Heart of Jesus." }
      ],
      dining: [
        { name: "Le Jules Verne", type: "French", review: "Outstanding dining with a view of the Eiffel Tower." },
        { name: "L'As du Fallafel", type: "Middle Eastern", review: "The best falafel in the Marais district." },
        { name: "Bistrot Paul Bert", type: "French Bistro", review: "Classic steak frites and traditional ambiance." }
      ],
      transportation: "The Paris Métro is fast, efficient, and deeply integrated into the city's fabric."
    },
    {
      id: "TYO",
      name: "Tokyo",
      description: "A bustling metropolis that seamlessly blends the ultramodern and the traditional.",
      history: "Originally a small fishing village named Edo, Tokyo became the seat of the Tokugawa shogunate in 1603 and evolved into one of the most populous and technologically advanced cities in the world.",
      attractions: [
        { name: "Senso-ji", detail: "An ancient Buddhist temple located in Asakusa." },
        { name: "Tokyo Skytree", detail: "A broadcasting and observation tower, the tallest structure in Japan." },
        { name: "Shibuya Crossing", detail: "The busiest pedestrian crossing in the world, surrounded by neon signs." },
        { name: "Meiji Shrine", detail: "A Shinto shrine dedicated to the deified spirits of Emperor Meiji and his wife." },
        { name: "Tsukiji Outer Market", detail: "A district of retail shops and restaurants renowned for fresh seafood." }
      ],
      dining: [
        { name: "Sukiyabashi Jiro", type: "Sushi", review: "Legendary, masterfully crafted sushi." },
        { name: "Ichiran", type: "Ramen", review: "Famous for its tonkotsu ramen and private dining booths." },
        { name: "Robot Restaurant", type: "Entertainment Dining", review: "A wild, neon-lit dinner show." }
      ],
      transportation: "Tokyo's public transportation network is arguably the best in the world, characterized by extreme punctuality and extensive coverage."
    },
    {
      id: "ROM",
      name: "Rome",
      description: "The Eternal City, an open-air museum of ancient history.",
      history: "Founded in 753 BC, Rome was the capital of the Roman Kingdom, Republic, and Empire. Its unparalleled historical heritage spans over two and a half millennia.",
      attractions: [
        { name: "Colosseum", detail: "An oval amphitheatre in the centre of the city, the largest ever built." },
        { name: "Pantheon", detail: "A former Roman temple, now a Catholic church, known for its massive dome." },
        { name: "Trevi Fountain", detail: "A historic fountain and true masterpiece of Baroque architecture." },
        { name: "Vatican Museums", detail: "Public museums within Vatican City displaying immense collections of art." },
        { name: "Roman Forum", detail: "A rectangular forum surrounded by the ruins of several important ancient government buildings." }
      ],
      dining: [
        { name: "Roscioli", type: "Italian", review: "Exceptional carbonara and local deli products." },
        { name: "Da Enzo al 29", type: "Roman", review: "Authentic Roman cuisine in the heart of Trastevere." },
        { name: "Giolitti", type: "Gelato", review: "One of the oldest and most famous gelaterias in the city." }
      ],
      transportation: "While the metro has only three lines due to archaeological constraints, buses and trams cover the rest of the city."
    }
  ];

  return (
    <div className="city-guides-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Explore Our City Guides</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Select a destination below to discover history, attractions, and dining options.</p>
      
      <div className="city-list" style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {guides.map(city => (
          <div 
            key={city.id} 
            className="city-card" 
            onClick={() => setSelectedCity(city.id)}
            style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '15px', 
              width: '250px', 
              cursor: 'pointer',
              backgroundColor: selectedCity === city.id ? '#f0f8ff' : '#fff',
              boxShadow: '0 4px 6px 
