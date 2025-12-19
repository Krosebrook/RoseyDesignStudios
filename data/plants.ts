
import { Plant } from '../types';

export const PLANTS: Plant[] = [
  // PLANTS
  {
    id: '1',
    name: 'Lavender',
    scientificName: 'Lavandula',
    description: 'A fragrant Mediterranean staple featuring aromatic purple flower spikes and silver-green foliage. It demands at least 6-8 hours of direct sunlight (Full Sun) and exceptionally well-draining soil. Once established, it is highly Drought-tolerant, making it a hero for water-wise designs. While peak color is late Spring through Summer, it provides silver structure year-round. It is the quintessential choice for Cottage borders, rocky Xeriscapes, and structured Formal low hedging.',
    sunlight: 'Full Sun',
    water: 'Drought-tolerant',
    seasons: ['Spring', 'Summer'],
    imageUrl: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Cottage', 'Xeriscape', 'Formal']
  },
  {
    id: '2',
    name: 'Hydrangea',
    scientificName: 'Hydrangea macrophylla',
    description: 'Celebrated for their massive "mophead" blooms that transform from blue to pink based on soil pH. These lush shrubs prefer bright morning light but require protection from harsh afternoon heat (Partial Shade). They have High water requirements and will wilt quickly without consistent moisture, especially during the peak Summer heat. Blooming from early Summer into Autumn, they anchor romantic Cottage garden corners and add voluminous texture to Formal garden boundaries.',
    sunlight: 'Partial Shade',
    water: 'High',
    seasons: ['Summer', 'Autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1505235625736-ab01447a851d?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Cottage', 'Formal']
  },
  {
    id: '3',
    name: 'Hostas',
    scientificName: 'Hosta',
    description: 'Prized for their bold, heart-shaped leaves ranging from chartreuse to deep blue-green, Hostas are the kings of the shade. They thrive in dappled or Full Shade, as direct afternoon sun can scorch their delicate foliage. They require Moderate, steady moisture to maintain their lush appearance. At their best in Spring and Summer, they provide cooling texture to Woodland paths, Zen sanctuaries, and moist Cottage garden corners.',
    sunlight: 'Full Shade',
    water: 'Moderate',
    seasons: ['Spring', 'Summer'],
    imageUrl: 'https://images.unsplash.com/photo-1572085313466-6710de8d7ba9?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Woodland', 'Zen', 'Cottage']
  },
  {
    id: '4',
    name: 'Sunflower',
    scientificName: 'Helianthus annuus',
    description: 'Iconic, statuesque annuals known for their solar-tracking flower heads and cheerful yellow petals. As absolute sun-worshippers (Full Sun), they need ample space and Moderate water to fuel their rapid vertical growth. Most vibrant during mid-to-late Summer, they are essential for rustic Cottage gardens and bird-friendly landscape designs. Their bold height and texture anchor informal garden plans and organic vegetable plots.',
    sunlight: 'Full Sun',
    water: 'Moderate',
    seasons: ['Summer'],
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Cottage']
  },
  {
    id: '5',
    name: 'Fern',
    scientificName: 'Polypodiopsida',
    description: 'Ancient, non-flowering plants that bring delicate, feathery texture to damp, cool locations. They prefer consistent Full Shade and humid environments, requiring High water levels to prevent their intricate fronds from browning. Growing lushly from Spring through Autumn, ferns are perfect for creating a primal feel in Woodland retreats, Tropical escapes, and moisture-rich Zen gardens.',
    sunlight: 'Full Shade',
    water: 'High',
    seasons: ['Spring', 'Summer', 'Autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1596326233475-7b1981cb287d?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Woodland', 'Zen', 'Tropical']
  },
  {
    id: '6',
    name: 'Peony',
    scientificName: 'Paeonia',
    description: 'Opulent perennials prized for their immense, fragrant blossoms and lush, dark green foliage. They require at least 6 hours of Full Sun to bloom properly and need Moderate water to support their heavy flowers. A classic herald of late Spring, they offer high-impact luxury to Formal perennial borders and romantic Cottage designs. Though their bloom season is short, they remain as spectcular foliage anchors throughout Summer.',
    sunlight: 'Full Sun',
    water: 'Moderate',
    seasons: ['Spring'],
    imageUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be025f?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Cottage', 'Formal']
  },
  {
    id: '7',
    name: 'Japanese Maple',
    scientificName: 'Acer palmatum',
    description: 'A graceful small tree with delicate, lacy foliage that provides dramatic seasonal changes from bright Spring greens to fiery Autumn reds. It thrives in Partial Shade to protect its thin leaves from heat scorch and requires Moderate, consistent moisture in well-drained soil. A sculptural focal point essential for meditative Zen gardens, Modern minimalist courtyards, and naturalistic Woodland landscapes.',
    sunlight: 'Partial Shade',
    water: 'Moderate',
    seasons: ['Spring', 'Summer', 'Autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1603816654763-71887e5967b5?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Zen', 'Woodland', 'Modern']
  },
  {
    id: '8',
    name: 'Japanese Forest Grass',
    scientificName: 'Hakonechloa macra',
    description: 'A stunning, slow-growing ornamental grass that creates cascading mounds of arching, golden foliage. It thrives in Partial to Full Shade, as afternoon sun can fade its vibrant color or scorch its tips. Requires Moderate, steady water to maintain its waterfall-like habit. Beautiful from Spring through late Autumn, it is a must-have for Zen gardens, Woodland edges, and contemporary Modern containers.',
    sunlight: 'Full Shade',
    water: 'Moderate',
    seasons: ['Spring', 'Summer', 'Autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1620849184323-289520e5e03e?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Zen', 'Woodland', 'Modern']
  },
  {
    id: '9',
    name: 'Bougainvillea',
    scientificName: 'Bougainvillea spectabilis',
    description: 'A vigorous tropical climber known for its papery, vibrant bracts that cloak the plant in neon hues. It demands Full Sun to produce its iconic floral display and is remarkably Drought-tolerant once established. Its peak performance is in Summer and Autumn. Ideal for adding vertical drama to Mediterranean courtyards, Tropical escapes, and walls or pergolas in high-heat environments.',
    sunlight: 'Full Sun',
    water: 'Drought-tolerant',
    seasons: ['Summer', 'Autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1589123053646-4e8990666986?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Tropical', 'Modern']
  },
  {
    id: '10',
    name: 'Russian Sage',
    scientificName: 'Perovskia atriplicifolia',
    description: 'A resilient, airy sub-shrub with silver-gray stems and spires of tiny lavender-blue flowers. It is a champion of Full Sun and is highly Drought-tolerant, thriving in poor, well-drained soil. Clouds of blue appear from mid-Summer through Autumn. Its misty, ethereal texture provides a perfect backdrop for Modern minimalist designs, water-wise Xeriscapes, and breezy Cottage garden borders.',
    sunlight: 'Full Sun',
    water: 'Drought-tolerant',
    seasons: ['Summer', 'Autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1620216503991-6f49980d96d7?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Xeriscape', 'Modern', 'Cottage']
  },

  // WATER FEATURES
  {
    id: 'w1',
    name: 'Koi Pond',
    scientificName: 'Aquatic Ecosystem',
    description: 'A living aquatic feature combining motion, reflection, and vibrant color. Best situated in Partial Shade to prevent excessive algae growth and maintain stable water temperatures for the fish. Requires High maintenance to balance filtration and water levels. Active and serene through Spring, Summer, and Autumn. A cornerstone of meditative Zen designs and lush Tropical sanctuaries seeking permanent water presence.',
    sunlight: 'Partial Shade',
    water: 'High',
    imageUrl: 'https://images.unsplash.com/photo-1544865126-7d2d31215886?auto=format&fit=crop&w=800&q=80',
    category: 'Water Feature',
    styles: ['Zen', 'Tropical'],
    seasons: ['Spring', 'Summer', 'Autumn']
  },
  {
    id: 'w16',
    name: 'Glass Spillway Trough',
    scientificName: 'Laminar Flow Trough',
    description: 'A stunning contemporary water feature where a sheet of crystal-clear water spills over a polished glass edge. Best positioned in Full Sun to catch light refractions and create shimmering patterns, though it works in Partial Shade. Requires High maintenance to ensure glass clarity. Functional year-round in mild climates. Its minimal silhouette and transparency are perfectly suited for Modern minimalist landscapes and high-end Formal courtyards.',
    sunlight: 'Full Sun',
    water: 'High',
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
    imageUrl: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=800&q=80',
    category: 'Water Feature',
    styles: ['Modern', 'Formal']
  },
  {
    id: 'w17',
    name: 'Mist Rock Garden',
    scientificName: 'Fog-Enshrouded Rocks',
    description: 'A sensory installation of weathered volcanic rocks with integrated misting systems that create a low-lying, mystical fog. Thrives in Partial to Full Shade where the mist lingers longest and creates a cooling microclimate. Requires High water and electrical maintenance for the nozzles. Breathtaking from Spring through Autumn. An essential atmosphere-builder for Zen meditation spaces, Tropical retreats, and naturalistic Woodland gardens.',
    sunlight: 'Partial Shade',
    water: 'High',
    seasons: ['Spring', 'Summer', 'Autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    category: 'Water Feature',
    styles: ['Zen', 'Tropical', 'Woodland']
  },

  // FURNITURE
  {
    id: 'f1',
    name: 'Teak Bench',
    scientificName: 'Wood Furniture',
    description: 'Durable, weather-resistant hardwood seating that ages beautifully to a silver patina. While it works in any sunlight, it lasts longest and stays coolest in Partial Shade. Low maintenance (Drought-tolerant care) with occasional cleaning. A year-round resting spot that suits the natural materials of Cottage, Modern, and Zen gardens alike with its timeless, sturdy form.',
    water: 'Drought-tolerant',
    imageUrl: 'https://images.unsplash.com/photo-1592742967168-5e5c707d8894?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Cottage', 'Modern', 'Formal', 'Zen'],
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter']
  },
  {
    id: 'f2',
    name: 'Pergola',
    scientificName: 'Garden Structure',
    description: 'A large overhead structure that provides dappled shade and structural support for vertical climbers. Best in Full Sun to support blooming vines like roses or wisteria, creating a shaded retreat underneath. Provides year-round architectural interest. Defines social zones in Modern, Cottage, and Formal landscapes, especially useful during sunny Spring and Summer days.',
    water: 'Drought-tolerant',
    imageUrl: 'https://images.unsplash.com/photo-1632599723708-5915d38397a5?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Modern', 'Cottage', 'Tropical', 'Formal'],
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter']
  },
  {
    id: 'f18',
    name: 'Wrought Iron Arbor',
    scientificName: 'Metal Archway',
    description: 'An elegant, arched structure designed to support climbing plants like ivy or jasmine. It flourishes in Full Sun when covered in greenery and is highly Drought-tolerant as a standalone feature. Provides year-round architectural height. Essential for creating romantic transitions in Cottage gardens and adding classical symmetry to Formal garden paths.',
    water: 'Drought-tolerant',
    sunlight: 'Full Sun',
    imageUrl: 'https://images.unsplash.com/photo-1590456108151-5079a49c952b?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Cottage', 'Formal', 'Woodland'],
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter']
  },
  {
    id: 'f19',
    name: 'L-Shaped Teak Sectional',
    scientificName: 'Modular Outdoor Sofa',
    description: 'A sprawling, modular seating solution crafted from premium weather-resistant teak. Best positioned in Partial Shade for comfort during Summer social gatherings. Low maintenance (Drought-tolerant care) with cushions to be stored in Winter. Its clean lines and modular nature anchor large Modern patios and lush Tropical outdoor living rooms.',
    water: 'Drought-tolerant',
    sunlight: 'Partial Shade',
    imageUrl: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Modern', 'Tropical'],
    seasons: ['Spring', 'Summer', 'Autumn']
  },
  {
    id: 'f20',
    name: 'Granite Meditation Bench',
    scientificName: 'Stone Seating',
    description: 'A massive, hand-finished slab of natural gray granite that offers a cool, permanent seat for reflection. Indestructible in any sunlight and requires zero maintenance (Drought-tolerant). A permanent fixture for all seasons. Its raw, organic presence is a cornerstone for Zen rock gardens and naturalistic Woodland retreats.',
    water: 'Drought-tolerant',
    sunlight: 'Full Shade',
    imageUrl: 'https://images.unsplash.com/photo-1610444569527-b089c8369522?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Zen', 'Woodland'],
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter']
  }
];
