export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML or Markdown content
  date: string;
  author: string;
  coverImage: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Renaissance of Gin',
    slug: 'renaissance-of-gin',
    excerpt: 'How a 17th-century spirit conquered the modern cocktail world.',
    content: `
      <p>Gin has come a long way from "Mother's Ruin" in 18th-century London to the premium, botanical-rich spirit we know today.</p>
      <h3>The Botanical Revolution</h3>
      <p>Modern distillers are experimenting with everything from seaweed to saffron, creating gins that are complex enough to be sipped neat.</p>
      <p>The "Gin & Tonic" itself has evolved into a Spanish-style "Gin Tonica", served in large goblet glasses with specific garnishes that enhance the spirit's unique botanicals.</p>
    `,
    date: '2023-10-15',
    author: 'DrinkingMan',
    coverImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Gin', 'History', 'Trends']
  },
  {
    id: '2',
    title: 'Ice: The Forgotten Ingredient',
    slug: 'ice-forgotten-ingredient',
    excerpt: 'Why the quality and shape of your ice matters more than you think.',
    content: `
      <p>You wouldn't cook a steak in lukewarm water, so why dilute a premium whiskey with cloudy, fast-melting ice?</p>
      <h3>Clarity is Key</h3>
      <p>Clear ice melts slower because it lacks air bubbles and impurities. This keeps your drink cold without watering it down essentially.</p>
      <p>Large cubes for Old Fashioneds, spears for Highballs, and crushed ice for Tikis - understanding ice geometry is Mixology 101.</p>
    `,
    date: '2023-11-02',
    author: 'DrinkingMan',
    coverImage: 'https://images.unsplash.com/photo-1497534446932-c925b4587081?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Technique', 'Ice', 'Essentials']
  },
  {
    id: '3',
    title: 'Sustainable Mixology',
    slug: 'sustainable-mixology',
    excerpt: 'Zero-waste cocktails and eco-friendly bar practices.',
    content: `
      <p>The modern bar is going green. From citrus husks turned into oleo-saccharum to biodegradable straws, sustainability is the new standard.</p>
      <h3>Root-to-Flower</h3>
      <p>Just like nose-to-tail cooking, root-to-flower bartending ensures every part of an ingredient is used. Herb stems for syrups, fruit skins for garnishes, and leftover wine for reductions.</p>
    `,
    date: '2023-12-10',
    author: 'DrinkingMan',
    coverImage: 'https://images.unsplash.com/photo-1574056156972-76fa4c4d516d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Sustainability', 'Trends', 'Eco']
  }
];
