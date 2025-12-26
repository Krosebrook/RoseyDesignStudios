
import { Plant } from '../types';

export const PLANTS: Plant[] = [
  {
    id: '1',
    name: 'Lavender',
    scientificName: 'Lavandula',
    description: 'A fragrant Mediterranean perennial prized for its aromatic purple flower spikes and silver-green foliage. It thrives in Full Sun, requiring at least 6-8 hours of direct light daily. Once established, it is highly Drought-tolerant and prefers well-draining, slightly alkaline soil. Peak color arrives in late Spring and persists through Summer. It is the quintessential choice for Cottage borders, rocky Xeriscapes, and structured Formal hedging.',
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
    description: 'A lush deciduous shrub famous for its large "mophead" clusters that shift from blue to pink depending on soil acidity. It flourishes in Partial Shade, enjoying gentle morning light but requiring protection from intense afternoon heat. It has High water requirements, needing consistently moist soil to prevent wilting. Blooming from early Summer to late Autumn, it anchors romantic Cottage gardens and adds significant volume to Formal garden boundaries.',
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
    description: 'Prized for their bold, heart-shaped leaves ranging from chartreuse to deep blue-green, Hostas are the kings of the shade. They thrive in dappled light or Full Shade, as direct sun can scorch their delicate foliage. They require Moderate, steady moisture to maintain their lush, wax-like appearance. At their best in Spring and Summer, they provide cooling texture to Woodland paths, Zen sanctuaries, and moist Cottage garden corners.',
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
    description: 'Iconic, statuesque annuals known for their solar-tracking flower heads and cheerful yellow petals. As absolute sun-worshippers (Full Sun), they need ample space and Moderate water to fuel their rapid vertical growth. Most vibrant during mid-to-late Summer, they are essential for rustic Cottage gardens and bird-friendly landscapes. Their bold height anchors informal garden plans and organic vegetable plots.',
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
    description: 'Ancient, non-flowering plants that bring feathery texture to damp, cool locations. They prefer consistent Full Shade and humid environments, requiring High water levels to prevent their intricate fronds from browning. Growing lushly from Spring through Autumn, ferns are perfect for creating a primal feel in Woodland retreats, Tropical escapes, and moisture-rich Zen gardens.',
    sunlight: 'Full Shade',
    water: 'High',
    seasons: ['Spring', 'Summer', 'Autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1596326233475-7b1981cb287d?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Woodland', 'Zen', 'Tropical']
  },
  {
    id: '11',
    name: 'Cherry Blossom',
    scientificName: 'Prunus serrulata',
    description: 'The ephemeral star of the Spring garden, producing clouds of delicate pink or white blossoms. It requires Full Sun and well-drained soil to flourish and prevent root rot. It needs Moderate watering, especially when young or during dry spells. A quintessential focal point for Zen gardens and Formal landscapes, representing the beauty of transition and renewal.',
    sunlight: 'Full Sun',
    water: 'Moderate',
    seasons: ['Spring'],
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Zen', 'Formal', 'Woodland']
  },
  {
    id: '12',
    name: 'Bird of Paradise',
    scientificName: 'Strelitzia reginae',
    description: 'A dramatic architectural plant with large, paddle-like leaves and orange-and-blue flowers resembling a bird in flight. It thrives in Full Sun to Partial Shade and requires Moderate watering once established. An absolute must for Tropical escapes and Modern minimalist designs, providing a bold vertical element and exotic flair.',
    sunlight: 'Full Sun',
    water: 'Moderate',
    seasons: ['Spring', 'Summer'],
    imageUrl: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Tropical', 'Modern']
  },
  {
    id: '13',
    name: 'Saguaro Cactus',
    scientificName: 'Carnegiea gigantea',
    description: 'The monarch of the desert, this iconic cactus brings immense vertical structure and ancient character to the garden. It demands Full Sun and is extremely Drought-tolerant, thriving in arid conditions with minimal intervention. Primarily active in Summer, it is the centerpiece of Xeriscapes and Modern arid designs.',
    sunlight: 'Full Sun',
    water: 'Drought-tolerant',
    seasons: ['Summer'],
    imageUrl: 'https://images.unsplash.com/photo-1551016043-05953047249a?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Xeriscape', 'Modern']
  },
  {
    id: '14',
    name: 'Blue Agave',
    scientificName: 'Agave tequilana',
    description: 'A striking succulent with sharp, fleshy blue-green leaves arranged in a heavy rosette. It requires Full Sun and minimal water (Drought-tolerant) to maintain its rigid form. Providing structural interest through all four seasons (Spring, Summer, Autumn, Winter), it is essential for Modern architecture and high-contrast Xeriscapes.',
    sunlight: 'Full Sun',
    water: 'Drought-tolerant',
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
    imageUrl: 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Xeriscape', 'Modern']
  },
  {
    id: '15',
    name: 'Wisteria',
    scientificName: 'Wisteria sinensis',
    description: 'A vigorous woody climber that produces cascading racemes of fragrant violet blossoms in late Spring. It needs Full Sun to bloom successfully and Moderate watering to support its rapid growth. A romantic and dramatic choice for Cottage gardens and Formal pergolas, offering unmatched vertical beauty.',
    sunlight: 'Full Sun',
    water: 'Moderate',
    seasons: ['Spring'],
    imageUrl: 'https://images.unsplash.com/photo-1558239027-d0d046f406ec?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Cottage', 'Formal']
  },
  {
    id: 'f1',
    name: 'Teak Garden Bench',
    scientificName: 'Tectona grandis',
    description: 'A classic, robust garden seat crafted from sustainable teak hardwood. It is highly weather-resistant and Drought-tolerant in its maintenance needs, aging into a beautiful silver-grey patina over time. Best suited for Cottage, Formal, and Zen garden styles, providing a quiet spot for reflection throughout the year.',
    water: 'Drought-tolerant',
    imageUrl: 'https://images.unsplash.com/photo-1592742967168-5e5c707d8894?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Cottage', 'Formal', 'Zen']
  },
  {
    id: 'f2',
    name: 'Modern Fire Pit Table',
    scientificName: 'Geometric Concrete',
    description: 'A sleek, low-profile fire table that serves as a sophisticated social hub. Combining minimalist industrial design with cozy functionality, its concrete build is effectively Drought-tolerant. Its clean lines anchor Modern and Minimalist landscapes, offering warmth during cooler Autumn and Winter evenings.',
    water: 'Drought-tolerant',
    imageUrl: 'https://images.unsplash.com/photo-1621230113526-9d33261209cc?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Modern', 'Minimalist']
  },
  {
    id: 'f3',
    name: 'Woven Egg Swing Chair',
    scientificName: 'Synthetic Rattan',
    description: 'An iconic hanging retreat that adds a touch of bohemian luxury to lush garden nooks. Its protective cocoon-like shape is perfect for relaxation. It requires Moderate protection from extreme weather. Best suited for Tropical and Cottage styles where comfort is paramount during Spring and Summer.',
    water: 'Moderate',
    imageUrl: 'https://images.unsplash.com/photo-1581452179124-699763784df4?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Tropical', 'Cottage']
  },
  {
    id: 'w1',
    name: 'Koi Pond',
    scientificName: 'Aquatic Ecosystem',
    description: 'A living aquatic feature combining motion, reflection, and vibrant color. It is best situated in Partial Shade to prevent excessive algae growth and maintain stable water temperatures. It requires High maintenance to balance filtration and water levels. A spiritual anchor for Zen gardens and a lush centerpiece for Tropical designs.',
    sunlight: 'Partial Shade',
    water: 'High',
    imageUrl: 'https://images.unsplash.com/photo-1544865126-7d2d31215886?auto=format&fit=crop&w=800&q=80',
    category: 'Water Feature',
    styles: ['Zen', 'Tropical'],
    seasons: ['Spring', 'Summer', 'Autumn']
  }
];
