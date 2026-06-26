// Coordenadas centrales de los estados de Venezuela para el mapa
export interface EstadoVenezuela {
  nombre: string
  lat: number
  lng: number
  municipios: string[]
}

export const ESTADOS_VENEZUELA: EstadoVenezuela[] = [
  { nombre: 'Distrito Capital', lat: 10.4880, lng: -66.8792, municipios: ['Libertador'] },
  { nombre: 'Miranda', lat: 10.2500, lng: -66.4167, municipios: ['Baruta', 'Chacao', 'El Hatillo', 'Sucre', 'Los Salias', 'Guaicaipuro', 'Plaza', 'Zamora', 'Cristóbal Rojas', 'Urdaneta', 'Brión', 'Buroz'] },
  { nombre: 'La Guaira', lat: 10.6031, lng: -66.9325, municipios: ['Vargas'] },
  { nombre: 'Aragua', lat: 10.2353, lng: -67.5911, municipios: ['Girardot', 'Santiago Mariño', 'Libertador', 'Sucre', 'Zamora', 'Lamas', 'Bolívar', 'Tovar', 'Linares Alcántara'] },
  { nombre: 'Carabobo', lat: 10.1667, lng: -68.0000, municipios: ['Valencia', 'Naguanagua', 'San Diego', 'Los Guayos', 'Libertador', 'Puerto Cabello', 'Guacara'] },
  { nombre: 'Lara', lat: 10.0678, lng: -69.3472, municipios: ['Iribarren', 'Palavecino', 'Jiménez', 'Torres', 'Morán', 'Crespo'] },
  { nombre: 'Zulia', lat: 10.6667, lng: -71.6333, municipios: ['Maracaibo', 'San Francisco', 'Cabimas', 'Lagunillas', 'Machiques', 'Mara', 'Jesús E. Lossada'] },
  { nombre: 'Táchira', lat: 7.7667, lng: -72.2333, municipios: ['San Cristóbal', 'Cárdenas', 'Junín', 'Capacho', 'Bolívar', 'Independencia'] },
  { nombre: 'Mérida', lat: 8.5897, lng: -71.1561, municipios: ['Libertador', 'Campo Elías', 'Santos Marquina', 'Sucre', 'Tovar'] },
  { nombre: 'Trujillo', lat: 9.3667, lng: -70.4333, municipios: ['Valera', 'Trujillo', 'Boconó', 'Escuque'] },
  { nombre: 'Barinas', lat: 8.6226, lng: -70.2074, municipios: ['Barinas', 'Pedraza', 'Obispos', 'Zamora'] },
  { nombre: 'Portuguesa', lat: 9.0592, lng: -69.7411, municipios: ['Guanare', 'Araure', 'Páez', 'Ospino'] },
  { nombre: 'Cojedes', lat: 9.6667, lng: -68.5833, municipios: ['San Carlos', 'Tinaco', 'Tinaquillo'] },
  { nombre: 'Yaracuy', lat: 10.3500, lng: -68.7333, municipios: ['San Felipe', 'Independencia', 'Cocorote', 'Bruzual'] },
  { nombre: 'Falcón', lat: 11.4167, lng: -69.6833, municipios: ['Coro', 'Punto Fijo', 'Tucacas', 'Miranda'] },
  { nombre: 'Guárico', lat: 8.7500, lng: -66.2333, municipios: ['San Juan de los Morros', 'Calabozo', 'Valle de la Pascua', 'Zaraza'] },
  { nombre: 'Anzoátegui', lat: 10.1333, lng: -64.6833, municipios: ['Barcelona', 'Puerto La Cruz', 'Lechería', 'El Tigre', 'Anaco'] },
  { nombre: 'Sucre', lat: 10.4600, lng: -63.2500, municipios: ['Cumaná', 'Carúpano', 'Güiria'] },
  { nombre: 'Monagas', lat: 9.7500, lng: -63.1833, municipios: ['Maturín', 'Punta de Mata', 'Temblador'] },
  { nombre: 'Nueva Esparta', lat: 11.0000, lng: -63.9167, municipios: ['Porlamar', 'Juan Griego', 'La Asunción'] },
  { nombre: 'Bolívar', lat: 8.1167, lng: -63.5500, municipios: ['Ciudad Bolívar', 'Ciudad Guayana', 'Upata', 'El Callao'] },
  { nombre: 'Amazonas', lat: 5.6667, lng: -67.6333, municipios: ['Puerto Ayacucho', 'Atures'] },
  { nombre: 'Delta Amacuro', lat: 9.0500, lng: -62.0500, municipios: ['Tucupita'] },
  { nombre: 'Apure', lat: 7.8833, lng: -69.5333, municipios: ['San Fernando de Apure', 'Guasdualito', 'Achaguas'] },
]

// Centro de Venezuela para el mapa
export const VENEZUELA_CENTER: [number, number] = [8.0, -66.0]
export const VENEZUELA_ZOOM = 7
