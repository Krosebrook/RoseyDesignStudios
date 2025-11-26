
import { Plant } from '../types';

export const PLANTS: Plant[] = [
  // PLANTS
  {
    id: '1',
    name: 'Lavender',
    scientificName: 'Lavandula',
    description: 'A fragrant herb with purple flowers and silvery-green foliage. Perfect for borders and sensory gardens.',
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
    description: 'Showy shrubs with large, globe-shaped flower heads. Flower color can change based on soil pH.',
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
    description: 'Shade-loving perennials grown primarily for their beautiful foliage which comes in a range of greens, blues, and variegations.',
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
    description: 'Tall, iconic annuals with massive yellow flower heads that follow the sun. Great for pollinators.',
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
    description: 'Ancient plants with feathery fronds. Excellent for adding texture to shady woodland gardens.',
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
    description: 'Classic woody perennials known for their fragrant and stunning blooms. Available in countless varieties.',
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
    description: 'Fleshy plants that store water, making them incredibly low maintenance and perfect for rock gardens.',
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
    description: 'Bright, cup-shaped flowers that signal the arrival of spring. Plant bulbs in the fall for best results.',
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
    description: 'Lush, fragrant flowers that bloom in late spring. Known for their longevity and massive blooms.',
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
    description: 'Small deciduous trees known for their graceful habit and stunning fall color.',
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
    description: 'A peaceful water feature with swimming fish, water lilies, and surrounding rock work. Brings life and movement to any garden.',
    imageUrl: 'https://images.unsplash.com/photo-1516475429286-465d815a0df7?auto=format&fit=crop&w=800&q=80',
    category: 'Water Feature',
    styles: ['Zen', 'Tropical']
  },
  {
    id: 'w2',
    name: 'Stone Fountain',
    scientificName: 'Tiered Water Feature',
    description: 'A classic multi-tiered stone fountain that provides soothing water sounds and serves as an elegant focal point.',
    imageUrl: 'https://images.unsplash.com/photo-1598626382552-e3629a88127e?auto=format&fit=crop&w=800&q=80',
    category: 'Water Feature',
    styles: ['Formal', 'Cottage']
  },
  {
    id: 'w3',
    name: 'Birdbath',
    scientificName: 'Ceramic / Stone',
    description: 'A charming addition that attracts local wildlife. Available in various styles from rustic stone to glazed ceramic.',
    imageUrl: 'https://images.unsplash.com/photo-1600675593895-722751950b0e?auto=format&fit=crop&w=800&q=80',
    category: 'Water Feature',
    styles: ['Cottage', 'Woodland']
  },

  // FURNITURE
  {
    id: 'f1',
    name: 'Teak Bench',
    scientificName: 'Wood Furniture',
    description: 'A durable, weather-resistant wooden bench that naturally weathers to a beautiful silver-grey.',
    imageUrl: 'https://images.unsplash.com/photo-1560746268-9c221d7d591c?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Cottage', 'Modern', 'Formal', 'Zen']
  },
  {
    id: 'f2',
    name: 'Pergola',
    scientificName: 'Garden Structure',
    description: 'Provides shade and definition to outdoor spaces. Perfect for climbing plants like vines or roses.',
    imageUrl: 'https://images.unsplash.com/photo-1592330775194-3b315470b92e?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Modern', 'Cottage', 'Tropical', 'Formal']
  },
  {
    id: 'f3',
    name: 'Fire Pit',
    scientificName: 'Corten Steel',
    description: 'Create a cozy gathering spot for cool evenings. Adds warmth and ambiance to the patio area.',
    imageUrl: 'https://images.unsplash.com/photo-1632930807199-7618c2030518?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Modern', 'Cottage', 'Xeriscape']
  },
  {
    id: 'f4',
    name: 'Adirondack Chair',
    scientificName: 'Classic Seating',
    description: 'Iconic comfortable outdoor seating with wide armrests and a slanted back. Ideal for relaxing on lawns or patios.',
    imageUrl: 'https://images.unsplash.com/photo-1596115630706-2249490c9551?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    styles: ['Cottage']
  }
];
