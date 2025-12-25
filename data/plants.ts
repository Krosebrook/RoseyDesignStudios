
import { Plant } from '../types';

export const PLANTS: Plant[] = [
  // EXISTING PLANTS
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
  
  // NEW ADDITIONS
  {
    id: '11',
    name: 'Cherry Blossom',
    scientificName: 'Prunus serrulata',
    description: 'The ephemeral star of the Spring garden, producing clouds of delicate pink or white blossoms. Requires Full Sun and well-drained soil. It needs Moderate watering, especially when young. A quintessential focal point for Zen gardens and Formal landscapes, representing the beauty of transition. Its stunning floral display is a high-priority subject for AI visualization.',
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
    description: 'A dramatic architectural plant with large, paddle-like leaves and orange-and-blue flowers resembling a bird in flight. Thrives in Full Sun to Partial Shade and requires Moderate watering. An absolute must for Tropical escapes and Modern minimalist designs. Its unique structural form provides a fascinating challenge for AI artistic renders.',
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
    description: 'The monarch of the desert, this iconic cactus brings immense vertical structure and ancient character to the garden. Demands Full Sun and is extremely Drought-tolerant. At home in Xeriscapes and Modern arid designs. Its ridged texture and majestic silhouette are perfect for dramatic high-resolution AI renders.',
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
    description: 'A striking succulent with sharp, fleshy blue-green leaves arranged in a heavy rosette. Requires Full Sun and minimal water (Drought-tolerant). Essential for Modern architecture and high-contrast Xeriscapes. Its geometry and matte-blue tones make for stunning minimalist AI visuals.',
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
    description: 'A vigorous woody climber that produces cascading racemes of fragrant violet blossoms in late Spring. Needs Full Sun to bloom successfully and Moderate watering. A romantic choice for Cottage gardens and Formal pergolas. Its trailing floral "waterfall" is a favorite for AI-generated artistic styles like watercolor or impressionism.',
    sunlight: 'Full Sun',
    water: 'Moderate',
    seasons: ['Spring'],
    imageUrl: 'https://images.unsplash.com/photo-1558239027-d0d046f406ec?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Cottage', 'Formal']
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
    name: 'Concrete Fire Table',
    scientificName: 'Modern Accent',
    description: 'A sophisticated centerpiece for modern outdoor living, this architectural fire table combines the raw beauty of hand-cast concrete with the warmth of a clean-burning flame. Its wide top provides ample space for refreshments, making it the ultimate social hub for evening gatherings. It brings a refined, industrial edge to clean-lined gardens and poolside lounges.',
    water: 'Drought-tolerant',
    imageUrl: 'https://images.unsplash.com/photo-1621230113526-9d33261209cc?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Modern', 'Formal', 'Minimalist'],
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter']
  },
  {
    id: 'f3',
    name: 'Woven Hanging Egg Chair',
    scientificName: 'Suspended Seating',
    description: 'Effortlessly blending bohemian charm with ergonomic comfort, this suspended sanctuary features a durable resin-wicker weave that withstands the elements. The gentle swaying motion and plush weather-resistant cushions create an intimate nook for morning coffee or afternoon reading. It adds a vertical, sculptural element to tropical patios and whimsical cottage corners.',
    water: 'Drought-tolerant',
    imageUrl: 'https://images.unsplash.com/photo-1581452179124-699763784df4?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Tropical', 'Cottage', 'Zen', 'Woodland'],
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter']
  },
  {
    id: 'f4',
    name: 'Recycled Poly Adirondack Chair',
    scientificName: 'Classic Lawn Seating',
    description: 'An eco-friendly evolution of a timeless American classic, this chair is crafted from high-density recycled plastics that mimic the texture of painted wood without the maintenance. Its iconic slanted back and oversized armrests are designed for pure relaxation. Extremely durable and heavy enough to stay put in windy environments, it serves as a rugged yet stylish anchor for casual lawn spaces.',
    water: 'Drought-tolerant',
    imageUrl: 'https://images.unsplash.com/photo-1591122941067-e4ca93c0892a?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Cottage', 'Woodland', 'Xeriscape'],
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter']
  }
];
