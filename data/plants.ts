
import { Plant } from '../types';

export const PLANTS: Plant[] = [
  // PLANTS
  {
    id: '1',
    name: 'Lavender',
    scientificName: 'Lavandula',
    description: 'A classic aromatic herb featuring silver foliage and purple spikes. It demands Full Sun and is highly Drought-tolerant, making it an essential addition to Xeriscape, Cottage, and Formal gardens for Spring and Summer interest.',
    sunlight: 'Full Sun',
    water: 'Drought-tolerant',
    seasons: ['Spring', 'Summer'],
    imageUrl: 'https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Cottage', 'Xeriscape', 'Formal']
  },
  {
    id: '2',
    name: 'Hydrangea',
    scientificName: 'Hydrangea macrophylla',
    description: 'Voluminous shrubs known for their large, color-changing blooms. They thrive in Partial Shade with High water requirements, serving as a dramatic focal point in Cottage or Formal gardens from Summer through Autumn.',
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
    description: 'The ultimate shade-loving foliage plant, offering lush texture in varied greens. Requiring Moderate water, they fill the lower layers of Woodland and Zen gardens beautifully during the Spring and Summer seasons.',
    sunlight: 'Full Shade',
    water: 'Moderate',
    seasons: ['Spring', 'Summer'],
    imageUrl: 'https://images.unsplash.com/photo-1596527165632-b702a5729c94?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Woodland', 'Zen', 'Cottage']
  },
  {
    id: '4',
    name: 'Sunflower',
    scientificName: 'Helianthus annuus',
    description: 'Towering annuals with radiant yellow heads that follow the sun. These heat-lovers require Full Sun and Moderate water, acting as cheerful sentinels in Cottage style gardens throughout the Summer.',
    sunlight: 'Full Sun',
    water: 'Moderate',
    seasons: ['Summer'],
    imageUrl: 'https://images.unsplash.com/photo-1470509037663-253ce7169acb?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Cottage']
  },
  {
    id: '5',
    name: 'Fern',
    scientificName: 'Polypodiopsida',
    description: 'Elegant, architectural plants with intricate fronds. Perfect for damp, Full Shade areas with High water needs, they bring a prehistoric tranquility to Woodland, Zen, and Tropical spaces.',
    sunlight: 'Full Shade',
    water: 'High',
    seasons: ['Spring', 'Summer', 'Autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1525466559287-3388282b2e82?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Woodland', 'Zen', 'Tropical']
  },
  {
    id: '6',
    name: 'Rose',
    scientificName: 'Rosa',
    description: 'The queen of flowers, offering unparalleled fragrance and beauty. Best grown in Full Sun with Moderate water, they define the aesthetic of Formal and Cottage gardens during their Spring and Summer bloom cycles.',
    sunlight: 'Full Sun',
    water: 'Moderate',
    seasons: ['Spring', 'Summer'],
    imageUrl: 'https://images.unsplash.com/photo-1496857239036-1fb137683000?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Cottage', 'Formal']
  },
  {
    id: '7',
    name: 'Succulents',
    scientificName: 'Sedum / Echeveria',
    description: 'Resilient, geometric plants that store moisture in their leaves. Ideal for Full Sun and Drought-tolerant areas, they offer structural interest to Modern, Zen, and Xeriscape designs year-round.',
    sunlight: 'Full Sun',
    water: 'Drought-tolerant',
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
    imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Xeriscape', 'Modern', 'Zen']
  },
  {
    id: '8',
    name: 'Tulip',
    scientificName: 'Tulipa',
    description: 'Vibrant spring-blooming bulbs with cup-shaped flowers. They prefer Full Sun and Moderate moisture during their growth phase, perfect for creating structured drifts in Formal or Cottage gardens.',
    sunlight: 'Full Sun',
    water: 'Moderate',
    seasons: ['Spring'],
    imageUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Cottage', 'Formal']
  },
  {
    id: '9',
    name: 'Peony',
    scientificName: 'Paeonia',
    description: 'Beloved for their extravagant, ruffled blooms and sweet fragrance. These long-lived perennials thrive in Full Sun with Moderate water, acting as a Spring highlight in Cottage and Formal borders.',
    sunlight: 'Full Sun',
    water: 'Moderate',
    seasons: ['Spring'],
    imageUrl: 'https://images.unsplash.com/photo-1559681934-a6b22c450dfc?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Cottage', 'Formal']
  },
  {
    id: '10',
    name: 'Japanese Maple',
    scientificName: 'Acer palmatum',
    description: 'A sculptural deciduous tree prized for its delicate leaves and vibrant autumn hues. It prefers Partial Shade and Moderate water, making it an exquisite specimen for Zen, Modern, and Woodland landscapes.',
    sunlight: 'Partial Shade',
    water: 'Moderate',
    seasons: ['Spring', 'Summer', 'Autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1511524040812-4160943de17b?auto=format&fit=crop&w=800&q=80',
    category: 'Plant',
    styles: ['Zen', 'Woodland', 'Modern']
  },
  
  // WATER FEATURES
  {
    id: 'w1',
    name: 'Koi Pond',
    scientificName: 'Aquatic Ecosystem',
    description: 'A peaceful water feature with swimming fish, water lilies, and surrounding rock work. Brings life and movement to any Zen or Tropical garden.',
    imageUrl: 'https://images.unsplash.com/photo-1516475429286-465d815a0df7?auto=format&fit=crop&w=800&q=80',
    category: 'Water Feature',
    styles: ['Zen', 'Tropical']
  },
  {
    id: 'w2',
    name: 'Stone Fountain',
    scientificName: 'Tiered Water Feature',
    description: 'A classic multi-tiered stone fountain that provides soothing water sounds. Serves as an elegant focal point in Formal and Cottage gardens.',
    imageUrl: 'https://images.unsplash.com/photo-1598626382552-e3629a88127e?auto=format&fit=crop&w=800&q=80',
    category: 'Water Feature',
    styles: ['Formal', 'Cottage']
  },
  {
    id: 'w3',
    name: 'Birdbath',
    scientificName: 'Ceramic / Stone',
    description: 'A charming addition that attracts local wildlife. Available in various styles, it fits perfectly in Cottage or Woodland settings.',
    imageUrl: 'https://images.unsplash.com/photo-1600675593895-722751950b0e?auto=format&fit=crop&w=800&q=80',
    category: 'Water Feature',
    styles: ['Cottage', 'Woodland']
  },

  // FURNITURE
  {
    id: 'f1',
    name: 'Teak Bench',
    scientificName: 'Wood Furniture',
    description: 'A durable, weather-resistant wooden bench that naturally weathers to a beautiful silver-grey. Complements Cottage, Modern, and Zen styles.',
    imageUrl: 'https://images.unsplash.com/photo-1560746268-9c221d7d591c?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Cottage', 'Modern', 'Formal', 'Zen']
  },
  {
    id: 'f2',
    name: 'Pergola',
    scientificName: 'Garden Structure',
    description: 'Provides shade and vertical definition to outdoor spaces. Perfect for climbing plants in Modern, Tropical, or Cottage designs.',
    imageUrl: 'https://images.unsplash.com/photo-1592330775194-3b315470b92e?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Modern', 'Cottage', 'Tropical', 'Formal']
  },
  {
    id: 'f3',
    name: 'Fire Pit',
    scientificName: 'Corten Steel',
    description: 'Create a cozy gathering spot for cool evenings. Adds warmth and ambiance to Modern, Cottage, or Xeriscape patio areas.',
    imageUrl: 'https://images.unsplash.com/photo-1632930807199-7618c2030518?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Modern', 'Cottage', 'Xeriscape']
  },
  {
    id: 'f4',
    name: 'Adirondack Chair',
    scientificName: 'Classic Seating',
    description: 'Iconic comfortable outdoor seating with wide armrests and a slanted back. Ideal for relaxing on lawns in Cottage style gardens.',
    imageUrl: 'https://images.unsplash.com/photo-1596115630706-2249490c9551?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Cottage']
  }
];
