export const LOCATIONS = {
  "Brasil": {
    "São Paulo": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "Guarulhos"],
    "Rio de Janeiro": ["Rio de Janeiro", "Niterói", "Petrópolis", "Nova Iguaçu", "Duque de Caxias"],
    "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Montes Claros"],
    "Bahia": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari"],
    "Paraná": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
    "Rio Grande do Sul": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
    "Pernambuco": ["Recife", "Caruaru", "Petrolina", "Olinda", "Paulista"],
    "Ceará": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú"],
    "Goiás": ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde"],
    "Santa Catarina": ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó"]
  },
  "México": {
    "Ciudad de México": ["Ciudad de México", "Álvaro Obregón", "Iztapalapa", "Coyoacán", "Tlalpan"],
    "Jalisco": ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Puerto Vallarta"],
    "Nuevo León": ["Monterrey", "Guadalupe", "San Nicolás de los Garza", "Apodaca"],
    "Puebla": ["Puebla", "Tehuacán", "Atlixco", "San Martín Texmelucan"],
    "Guanajuato": ["León", "Irapuato", "Celaya", "Salamanca", "Guanajuato"],
    "Veracruz": ["Veracruz", "Xalapa", "Coatzacoalcos", "Boca del Río"],
    "Chihuahua": ["Chihuahua", "Ciudad Juárez", "Delicias", "Cuauhtémoc"],
    "Oaxaca": ["Oaxaca de Juárez", "Salina Cruz", "Juchitán de Zaragoza"],
    "Yucatán": ["Mérida", "Valladolid", "Progreso", "Tizimín"],
    "Baja California": ["Tijuana", "Mexicali", "Ensenada", "Rosarito"]
  },
  "Colombia": {
    "Antioquia": ["Medellín", "Bello", "Envigado", "Itagüí", "Rionegro", "Sabaneta"],
    "Cundinamarca": ["Bogotá", "Soacha", "Facatativá", "Zipaquirá", "Chía"],
    "Valle del Cauca": ["Cali", "Palmira", "Buenaventura", "Tuluá", "Buga"],
    "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Sabanalarga"],
    "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta"],
    "Bolívar": ["Cartagena", "Magangué", "Turbaco", "Arjona"],
    "Nariño": ["Pasto", "Tumaco", "Ipiales", "Túquerres"],
    "Córdoba": ["Montería", "Cereté", "Lorica", "Sahagún"],
    "Tolima": ["Ibagué", "Espinal", "Melgar", "Honda"],
    "Cauca": ["Popayán", "Santander de Quilichao", "Puerto Tejada"]
  },
  "Argentina": {
    "Buenos Aires": ["Buenos Aires", "La Plata", "Mar del Plata", "Quilmes", "Lanús", "Lomas de Zamora"],
    "Córdoba": ["Córdoba", "Villa María", "Río Cuarto", "San Francisco"],
    "Santa Fe": ["Rosario", "Santa Fe", "Rafaela", "Venado Tuerto"],
    "Mendoza": ["Mendoza", "San Rafael", "Godoy Cruz", "Guaymallén"],
    "Tucumán": ["San Miguel de Tucumán", "Tafí Viejo", "Yerba Buena", "Banda del Río Salí"],
    "Entre Ríos": ["Paraná", "Concordia", "Gualeguaychú", "Concepción del Uruguay"],
    "Salta": ["Salta", "Orán", "Tartagal", "Metán"],
    "Misiones": ["Posadas", "Oberá", "Eldorado", "Puerto Iguazú"],
    "Chaco": ["Resistencia", "Barranqueras", "Presidencia Roque Sáenz Peña"],
    "Santiago del Estero": ["Santiago del Estero", "La Banda", "Termas de Río Hondo"]
  },
  "Chile": {
    "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio"],
    "Biobío": ["Concepción", "Talcahuano", "Hualpén", "Chiguayante", "Los Ángeles"],
    "La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Pucón"],
    "Los Lagos": ["Puerto Montt", "Osorno", "Castro", "Puerto Varas"],
    "Coquimbo": ["La Serena", "Coquimbo", "Ovalle", "Illapel"],
    "O'Higgins": ["Rancagua", "San Fernando", "Rengo", "Machalí"],
    "Maule": ["Talca", "Curicó", "Linares", "Constitución"],
    "Los Ríos": ["Valdivia", "La Unión", "Panguipulli", "Río Bueno"],
    "Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Mejillones"]
  },
  "Perú": {
    "Lima": ["Lima", "Callao", "San Juan de Lurigancho", "Villa El Salvador", "Ate"],
    "Arequipa": ["Arequipa", "Cayma", "Cerro Colorado", "Paucarpata"],
    "La Libertad": ["Trujillo", "Víctor Larco Herrera", "El Porvenir", "La Esperanza"],
    "Piura": ["Piura", "Castilla", "Sullana", "Talara"],
    "Lambayeque": ["Chiclayo", "Lambayeque", "José Leonardo Ortiz", "Ferreñafe"],
    "Cusco": ["Cusco", "Wanchaq", "San Sebastián", "San Jerónimo"],
    "Junín": ["Huancayo", "El Tambo", "Chilca", "Tarma"],
    "Áncash": ["Huaraz", "Chimbote", "Nuevo Chimbote", "Casma"],
    "Loreto": ["Iquitos", "Belén", "San Juan Bautista", "Punchana"],
    "Puno": ["Puno", "Juliaca", "Ilave", "Azángaro"]
  }
};