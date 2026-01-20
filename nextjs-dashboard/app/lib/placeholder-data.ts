// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Admin User',
    email: 'admin@nextmail.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: '25a60918-59ef-4dab-87bb-cb650b844126',
    name: 'Client User',
    email: 'client@nextmail.com',
    password: 'client123',
    role: 'client',
  },
];

const customers = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/customers/michael-novotny.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/customers/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/customers/balazs-orban.png',
  },
];

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  {
    customer_id: customers[4].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
  },
  {
    customer_id: customers[3].id,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10',
  },
  {
    customer_id: customers[5].id,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05',
  },
  {
    customer_id: customers[2].id,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16',
  },
  {
    customer_id: customers[0].id,
    amount: 666,
    status: 'pending',
    date: '2023-06-27',
  },
  {
    customer_id: customers[3].id,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09',
  },
  {
    customer_id: customers[4].id,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17',
  },
  {
    customer_id: customers[5].id,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07',
  },
  {
    customer_id: customers[1].id,
    amount: 500,
    status: 'paid',
    date: '2023-08-19',
  },
  {
    customer_id: customers[5].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03',
  },
  {
    customer_id: customers[2].id,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05',
  },
];


const products = [
  {
    id: '1f13c7cd-a9b9-4ff5-93a4-d2cb962c5ef5',
    nombre: 'Laptop Gamer',
    descripcion: 'Laptop potente con GPU dedicada',
    precio: 1500,
    imagen: '/products/laptop-gamer.png',
    stock: 12,
    caracteristicas: [
      {label: 'Categoria', value: 'Computación'},
      {label: 'Peso', value: '3.5kg'},
      {label: 'Color', value: 'Negro'},
      {label: 'Pantalla', value: '15"'}
    ]
  },
  {
    id: '2d51b2f4-0c89-4e36-8c87-1c3fd75c812c',
    nombre: 'Mouse',
    descripcion: 'Mouse ergonómico recargable',
    precio: 35,
    imagen: '/products/mouse.png',
    stock: 80,
    caracteristicas:[
      {label: 'Categoria', value: 'Computacion - Accesorio'},
      {label: 'Peso', value: '0.1kg'},
      {label: 'Color', value: 'Negro'},
      {label: 'Tipo', value: 'Gamer'}
    ]
  },
  {
    id: '94b3c9cc-bad1-43ff-9dcb-55ac35f785bc',
    nombre: 'Teclado Mecánico',
    descripcion: 'Teclado con switches rojos',
    precio: 90,
    imagen: '/products/keyboard.png',
    stock: 32,
    caracteristicas: [
      {label: 'Categoria', value: 'Computacion - Accesorio'},
      {label: 'Peso', value: '0.2kg'},
      {label: 'Tipo', value: 'Gamer'}
    ]
  },
  {
    id: 'a7e5f4c2-3d6e-4f8b-9f4e-2b8e5f6c9d3a',
    nombre: 'Monitor 4K',
    descripcion: 'Monitor UHD de 27 pulgadas',
    precio: 400,
    imagen: '/products/monitor-4k.png',
    stock: 15,
    caracteristicas: [
      {label: 'Categoria', value: 'Computacion'},
      {label: 'Marca', value: 'Samsung'},
      {label: 'Pulgadas', value: '22"'}
    ]
  },
  {
    id: 'c3f9e8b1-5f4a-4d2e-9c3b-7e6f8d9a0b2c',
    nombre: 'Auriculares Inalambricos',
    descripcion: 'Auriculares con cancelacion de sonido',
    precio: 120,
    imagen:'/products/auriculares.png',
    stock: 45,
    caracteristicas: [
      {label: 'Categoria', value: 'Accesorio - Audio'},
      {label: 'Conectividad', value: 'Bluetooth'},
      {label: 'Funciones', value: 'Cancelacion de ruido'}
    ]
  },
  {
    id: '4d2e6f7a-8b9c-4d5e-9f0a-1b2c3d4e5f6a',
    nombre: 'Tablet',
    descripcion: 'Tablet de 10 pulgadas con alta resolucion',
    precio: 300,
    imagen: '/products/tablet.png',
    stock: 25,
    caracteristicas: [
      {label: 'Categoria', value: 'Electronica'},
      {label: 'Marca', value: 'Hitachi'},
      {label: 'Pulgadas', value: '12"'}
    ]
  },
  {
    id: 'e5f6a7b8-c9d0-4e1f-8a2b-3c4d5e6f7a8b',
    nombre: 'Smartphone',
    descripcion: 'Telefono smat con camara de 48MP',
    precio: 800,
    imagen: '/products/smartphone.png',
    stock: 50,
    caracteristicas: [
      {label: 'Categoria', value: 'Telefonia'},
      {label: 'Marca', value: 'Samsung'},
      {label: 'Color', value: 'Blanco'},
      {label: 'Camara', value: '48MP'}
    ]
  },
  {
    id: 'f6a7b8e9-d071-2a3b-4c5d-6e7f8d9b0a10',
    nombre: 'Disco Duro Externo',
    descripcion: 'Disco duro de 1TB USB-C',
    precio: 100,
    imagen: '/products/disco-duro.png',
    stock: 60,
    caracteristicas: [
      {label: 'Categoria', value: 'Accesorios - Almacenamiento'},
      {label: 'Capacidad', value: '1TB - 2TB USB-C'},
      {label: 'Marca', value: 'Western Digital'}
    ]
  },
  {
    id: '0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
    nombre: 'Cargador Portatil',
    descripcion: 'Bateria externa de Litio de 20000mAh',
    precio: 50,
    imagen: '/products/bateria.png',
    stock: 100,
    caracteristicas: [
      {label: 'Categoria', value: 'Computacion - Accesorio'},
      {label: 'Potencia', value: '25W'},
      {label: 'Conector', value: 'USB-C'}
    ]
  },
  {
    id: '1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
    nombre: 'smartwatch',
    descripcion: 'Reloj inteligente con monitor de ritmo cardiaco',
    precio: 200,
    imagen: '/products/smartwatch.png',
    stock: 40,
    caracteristicas: [
      {label: 'Categoria', value: 'Accesoria - Wearable'},
      {label: 'Funciones', value: 'Smartphone, Ritmo Cardiaco'},
      {label: 'Conectividad', value: 'Bluetooth, GPS incorporado'}
    ]
  },
  {
    id: '2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f',
    nombre: 'Impresora Multifuncion',
    descripcion: 'Impresora con escaner y copiadora integrada',
    precio: 250,
    imagen: '/products/impresora.png',
    stock: 20,
    caracteristicas: [
      {label: 'Categoria', value: 'Impresion . Oficina'},
      {label: 'Marca', value: 'HP'},
      {label: 'Caracteristicas', value: 'Impresora, Scaner, Copiadora'}
    ]
  },
  {
    id: '3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a',
    nombre: 'Gabinete PC',
    descripcion: 'Gabinete ATX con ventilacion avanzada',
    precio: 130,
    imagen: '/products/gabinete.png',
    stock: 30,
    caracteristicas: [
      {label: 'Categoria', value: 'Hardware Inerno - PC'},
      {label: 'Materiales', value: 'Acero, Aluminio, Plastico'},
      {label: 'Caracteristica', value: 'Panel lateral de vidrio templado, iluminacion LED RGB'}
    ]
  }
];



const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

export { users, customers, invoices, revenue, products };
