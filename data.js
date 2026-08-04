window.DECKLED_DATA = {
  brand: {
    name: "DECK LED",
    tagline: "Fabricamos experiencias visuales",
    whatsapp: "", // Agregá tu número con código de país, ej: 54911XXXXXXXX
    instagram: "@deckled"
  },
  categories: [
    { id: "pixel", name: "Pixel LED", description: "Tubos, figuras, cabinas y estructuras direccionables.", image: "assets/page-6.jpg" },
    { id: "neon", name: "Neón LED", description: "Cartelería personalizada sobre acrílico.", image: "assets/page-3.jpg" },
    { id: "corporeos", name: "Corpóreos", description: "Frente acrílico, impresión 3D y estructura liviana.", image: "assets/page-16.jpg" },
    { id: "rental", name: "Alquileres", description: "Armados para eventos, ingresos LED, mapping y stands.", image: "assets/page-10.jpg" }
  ],
  products: [
    {
      id: "tubos-25",
      category: "pixel",
      name: "Pack Tubos Pixel LED",
      subtitle: "25 tubos de 1 metro",
      price: 672500,
      priceLabel: "Desde",
      image: "assets/page-6.jpg",
      badge: "Configurable",
      description: "Pack estándar con tubos translúcidos, cableado, fuente y controladora. Permite crear matrices y reproducir efectos sincronizados.",
      features: ["25 tubos de 1 m", "Diámetro 4 cm", "Control por celular o PC", "Entrada y salida en cada tubo"],
      options: { medida: ["1 metro", "Otra medida"], control: ["App celular", "USB para Jinx!"], disponibilidad: ["Fabricación a pedido"] },
      simulator: true
    },
    {
      id: "figuras-pixel",
      category: "pixel",
      name: "Figuras Pixel LED",
      subtitle: "Aros, estrellas, hexágonos y diseños personalizados",
      price: 59900,
      priceLabel: "Desde",
      image: "assets/page-12.jpg",
      badge: "Personalizable",
      description: "Figuras fabricadas en impresión 3D con funciones Pixel LED, cableado, fuente e interfaz.",
      features: ["Medida estándar 50 cm", "Opciones hasta 120 cm", "Espesor aproximado 3 cm", "Diseños personalizados"],
      options: { forma: ["Aro", "Estrella", "Hexágono", "Cuadrado", "Triángulo", "Personalizada"], medida: ["50 cm", "90 cm", "Consultar"], control: ["App celular", "USB"] }
    },
    {
      id: "cabina-dj",
      category: "pixel",
      name: "Cabina DJ Pixel LED",
      subtitle: "Tres paneles interactivos",
      price: 689700,
      priceLabel: "Desde",
      image: "assets/page-13.jpg",
      badge: "Show en vivo",
      description: "Cabina con control USB mediante Jinx!, efectos editables, texto, vúmetro y reproducción de visuales.",
      features: ["3 paneles plegables", "Texto y visuales", "Vúmetro en vivo", "24 efectos editables"],
      options: { paneles: ["3 paneles", "Configuración personalizada"], control: ["USB / Jinx!"] }
    },
    {
      id: "neon-personalizado",
      category: "neon",
      name: "Cartel Neón Personalizado",
      subtitle: "Diseño sobre acrílico",
      price: 35000,
      priceLabel: "Referencia por letra",
      image: "assets/page-3.jpg",
      badge: "A medida",
      description: "Cartelería Neón LED sobre base acrílica, lista para instalar con fuente de 12 V.",
      features: ["Diseño personalizado", "Base acrílica", "Fuente incluida", "Interior y eventos"],
      options: { tamaño: ["20 cm por letra", "Medida personalizada"], color: ["Blanco", "Cálido", "Rojo", "Azul", "Rosa", "Otro"] }
    },
    {
      id: "corporeo",
      category: "corporeos",
      name: "Corpóreo LED",
      subtitle: "Cartelería para interior y exterior",
      price: null,
      priceLabel: "Solicitar presupuesto",
      image: "assets/page-16.jpg",
      badge: "Proyecto especial",
      description: "Corpóreos realizados con impresión 3D, frente acrílico y estructura fina de hierro para facilitar montaje y traslado.",
      features: ["Frente acrílico", "Impresión 3D", "Estructura liviana", "Diseño a medida"],
      options: { uso: ["Interior", "Exterior"], iluminación: ["LED fijo", "Pixel LED"], tamaño: ["A cotizar"] }
    },
    {
      id: "alquiler-ingreso",
      category: "rental",
      name: "Ingreso Pixel LED",
      subtitle: "Alquiler para eventos",
      price: null,
      priceLabel: "Consultar fecha",
      image: "assets/page-7.jpg",
      badge: "Rental",
      description: "Montaje de ingresos LED para eventos con estructuras modulares, operación y configuración visual.",
      features: ["Estructuras modulares", "Armado y desarmado", "Programación de efectos", "Opciones según espacio"],
      options: { formato: ["Hexagonal", "Triangular", "Rectangular", "Personalizado"], servicio: ["Solo alquiler", "Alquiler + montaje", "Producción integral"], fecha: ["Indicar fecha por WhatsApp"] }
    },
    {
      id: "alquiler-cabina",
      category: "rental",
      name: "Cabina y Escenografía LED",
      subtitle: "Alquiler con configuración personalizada",
      price: null,
      priceLabel: "Cotizar evento",
      image: "assets/page-10.jpg",
      badge: "Evento",
      description: "Propuestas visuales para DJs, fiestas, activaciones y stands. Se adapta el diseño al espacio y al tipo de evento.",
      features: ["Cabinas LED", "Fondos y estructuras", "Contenido personalizado", "Asistencia técnica opcional"],
      options: { tipo: ["Cabina DJ", "Fondo LED", "Stand", "Armado integral"], ubicación: ["Indicar localidad"], fecha: ["Indicar fecha"] }
    }
  ]
};
