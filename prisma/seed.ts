// Datos de ejemplo de Claudette. Se cargan con: npx prisma db seed
// Cumple el punto E del TP 9: mínimo 5 registros por tabla.
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  // Vacía todas las tablas y reinicia los ids, así siempre empiezan en 1.
  // Por eso abajo podemos usar ids fijos (categoriaId: 2, usuarioId: 3, etc.).
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "ItemCarrito", "Carrito", "Contacto", "Producto", "Talle", "Categoria", "Usuario" RESTART IDENTITY CASCADE',
  );

  // categoorias
  await prisma.categoria.createMany({
    data: [
      { slug: 'remeras', nombre: 'Remeras' },       // 1
      { slug: 'vestidos', nombre: 'Vestidos' },     // 2
      { slug: 'pantalones', nombre: 'Pantalones' }, // 3
      { slug: 'abrigos', nombre: 'Abrigos' },       // 4
      { slug: 'calzados', nombre: 'Calzado' },      // 5
      { slug: 'accesorios', nombre: 'Accesorios' }, // 6
    ],
  });

  // Talles (ids 1 a 9) 
  await prisma.talle.createMany({
    data: [
      { nombre: 'S' },  { nombre: 'M' },  { nombre: 'L' },                      // 1, 2, 3
      { nombre: '36' }, { nombre: '37' }, { nombre: '38' }, { nombre: '39' }, { nombre: '40' }, // 4 a 8
      { nombre: 'Único' },                                                      // 9
    ],
  });

  // Productos (ids 1 a 6, uno por categoría) 
  // Los talles se conectan con "connect" porque es una relación de muchos a muchos.
  const ropa = [{ id: 1 }, { id: 2 }, { id: 3 }];                         // S, M, L
  const calzado = [{ id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }]; // 36 a 40

  const productos = [
    { nombre: 'Vestido Floral', precio: 45900, imagen: '/img/ui/claudete-vestido.jpg', descripcion: 'Vestido floral de temporada, ideal para ocasiones especiales.', stock: 8, destacado: true, categoriaId: 2, talles: { connect: ropa } },
    { nombre: 'Blusa Elegance', precio: 32500, imagen: '/img/productos/Remera.jpeg', descripcion: 'Blusa elegante y cómoda para combinar con diferentes prendas.', stock: 12, destacado: true, categoriaId: 1, talles: { connect: ropa } },
    { nombre: 'Jean Classic', precio: 52900, imagen: '/img/productos/Pantalon.jpeg', descripcion: 'Jean clásico de corte moderno y cómodo.', stock: 10, destacado: true, categoriaId: 3, talles: { connect: ropa } },
    { nombre: 'Campera Urbana', precio: 78900, imagen: '/img/ui/campera-jean-claudette.jpg', descripcion: 'Campera urbana para los días fríos.', stock: 5, destacado: true, categoriaId: 4, talles: { connect: ropa } },
    { nombre: 'Sandalias de verano', precio: 29000, imagen: '/img/productos/calzado.jpg', descripcion: 'Sandalias cómodas y livianas para la temporada cálida.', stock: 6, categoriaId: 5, talles: { connect: calzado } },
    { nombre: 'Cartera Mini', precio: 34900, descripcion: 'Cartera chica de mano con correa desmontable.', stock: 6, categoriaId: 6, talles: { connect: [{ id: 9 }] } },
  ];
  // createMany no permite conectar relaciones, por eso se crean de a uno.
  for (const producto of productos) {
    await prisma.producto.create({ data: producto });
  }

  //Usuarios (ids 1 a 7): 2 admin y 5 clientas
  //Las contraseñas se guardan encriptadas con bcrypt, igual que en /auth/register.
  const admin = await bcrypt.hash('admin123', 10);
  const cliente = await bcrypt.hash('cliente123', 10);
  await prisma.usuario.createMany({
    data: [
      { nombre: 'Claudia', email: 'claudia@claudette.com', password: admin, rol: 'admin' },     // 1
      { nombre: 'Admin Ventas', email: 'ventas@claudette.com', password: admin, rol: 'admin' }, // 2
      { nombre: 'Sofía Martínez', email: 'sofia.martinez@email.com', password: cliente },       // 3
      { nombre: 'Lucía Fernández', email: 'lucia.f@email.com', password: cliente },             // 4
      { nombre: 'Camila Gómez', email: 'camila.gomez@email.com', password: cliente },           // 5
      { nombre: 'Valentina Rossi', email: 'vale.rossi@email.com', password: cliente },          // 6
      { nombre: 'Martina López', email: 'martina.lopez@email.com', password: cliente },         // 7
    ],
  });

  // Carritos (ids 1 a 5, uno por clienta)
  await prisma.carrito.createMany({
    data: [
      { usuarioId: 3, estado: 'activo' },     // 1 Sofía
      { usuarioId: 4, estado: 'activo' },     // 2 Lucía
      { usuarioId: 5, estado: 'confirmado' }, // 3  Camila
      { usuarioId: 6, estado: 'activo' },     // 4  Valentina
      { usuarioId: 7, estado: 'cancelado' },  // 5 Martina
    ],
  });

  //  Productos dentro de cada carrito 
  // precioUnitario = precio del producto al momento de agregarlo
  await prisma.itemCarrito.createMany({
    data: [
      { carritoId: 1, productoId: 1, talleId: 2, cantidad: 1, precioUnitario: 45900 }, // Vestido M
      { carritoId: 1, productoId: 2, talleId: 1, cantidad: 2, precioUnitario: 32500 }, // Blusa S
      { carritoId: 2, productoId: 3, talleId: 3, cantidad: 1, precioUnitario: 52900 }, // Jean L
      { carritoId: 3, productoId: 5, talleId: 6, cantidad: 1, precioUnitario: 29000 }, // Sandalias 38
      { carritoId: 3, productoId: 6, talleId: 9, cantidad: 1, precioUnitario: 34900 }, // Cartera Único
      { carritoId: 4, productoId: 4, talleId: 2, cantidad: 1, precioUnitario: 78900 }, // Campera M
      { carritoId: 5, productoId: 2, talleId: 1, cantidad: 3, precioUnitario: 32500 }, // Blusa S
    ],
  });

  
  await prisma.contacto.createMany({
    data: [
      { usuarioId: 3, nombre: 'Sofía Martínez', email: 'sofia.martinez@email.com', motivo: 'talles', mensaje: '¿El Vestido Floral viene en talle L?' },
      { usuarioId: 4, nombre: 'Lucía Fernández', email: 'lucia.f@email.com', motivo: 'envios', mensaje: '¿Hacen envíos a Yerba Buena?' },
      { usuarioId: 5, nombre: 'Camila Gómez', email: 'camila.gomez@email.com', motivo: 'cambios', mensaje: 'Quiero cambiar las sandalias por un talle más.' },
      { usuarioId: 3, nombre: 'Sofía Martínez', email: 'sofia.martinez@email.com', motivo: 'consulta', mensaje: '¿Cuándo llegan los abrigos de temporada?' },
      { nombre: 'Ana Ruiz', email: 'ana.ruiz@email.com', motivo: 'consulta', mensaje: '¿Cuál es el horario del local?' },
      { nombre: 'Paula Díaz', email: 'paula.diaz@email.com', telefono: '+54 9 381 777-8888', motivo: 'consulta', mensaje: '¿Aceptan transferencia?' },
    ],
  });

  // Muestra cuántos registros quedaron en cada tabla 
  console.table({
    categorias: await prisma.categoria.count(),
    talles: await prisma.talle.count(),
    productos: await prisma.producto.count(),
    usuarios: await prisma.usuario.count(),
    carritos: await prisma.carrito.count(),
    itemsCarrito: await prisma.itemCarrito.count(),
    contactos: await prisma.contacto.count(),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
