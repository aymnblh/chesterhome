require('dotenv').config();
const { db } = require('./firebase');
const bcrypt = require('bcryptjs');

const wilayasData = [
  {code: 1, name: 'Adrar', homeDelivery: 800, agencyDelivery: 500},
  {code: 2, name: 'Chlef', homeDelivery: 500, agencyDelivery: 300},
  {code: 3, name: 'Laghouat', homeDelivery: 600, agencyDelivery: 400},
  {code: 4, name: 'Oum El Bouaghi', homeDelivery: 500, agencyDelivery: 300},
  {code: 5, name: 'Batna', homeDelivery: 500, agencyDelivery: 300},
  {code: 6, name: 'Béjaïa', homeDelivery: 500, agencyDelivery: 300},
  {code: 7, name: 'Biskra', homeDelivery: 600, agencyDelivery: 400},
  {code: 8, name: 'Béchar', homeDelivery: 800, agencyDelivery: 500},
  {code: 9, name: 'Blida', homeDelivery: 400, agencyDelivery: 200},
  {code: 10, name: 'Bouira', homeDelivery: 500, agencyDelivery: 300},
  {code: 11, name: 'Tamanrasset', homeDelivery: 900, agencyDelivery: 600},
  {code: 12, name: 'Tébessa', homeDelivery: 600, agencyDelivery: 400},
  {code: 13, name: 'Tlemcen', homeDelivery: 600, agencyDelivery: 400},
  {code: 14, name: 'Tiaret', homeDelivery: 500, agencyDelivery: 300},
  {code: 15, name: 'Tizi Ouzou', homeDelivery: 500, agencyDelivery: 300},
  {code: 16, name: 'Alger', homeDelivery: 400, agencyDelivery: 200},
  {code: 17, name: 'Djelfa', homeDelivery: 500, agencyDelivery: 300},
  {code: 18, name: 'Jijel', homeDelivery: 500, agencyDelivery: 300},
  {code: 19, name: 'Sétif', homeDelivery: 500, agencyDelivery: 300},
  {code: 20, name: 'Saïda', homeDelivery: 600, agencyDelivery: 400},
  {code: 21, name: 'Skikda', homeDelivery: 500, agencyDelivery: 300},
  {code: 22, name: 'Sidi Bel Abbès', homeDelivery: 600, agencyDelivery: 400},
  {code: 23, name: 'Annaba', homeDelivery: 500, agencyDelivery: 300},
  {code: 24, name: 'Guelma', homeDelivery: 500, agencyDelivery: 300},
  {code: 25, name: 'Constantine', homeDelivery: 400, agencyDelivery: 200},
  {code: 26, name: 'Médéa', homeDelivery: 500, agencyDelivery: 300},
  {code: 27, name: 'Mostaganem', homeDelivery: 500, agencyDelivery: 300},
  {code: 28, name: 'M\'Sila', homeDelivery: 500, agencyDelivery: 300},
  {code: 29, name: 'Mascara', homeDelivery: 500, agencyDelivery: 300},
  {code: 30, name: 'Ouargla', homeDelivery: 700, agencyDelivery: 500},
  {code: 31, name: 'Oran', homeDelivery: 400, agencyDelivery: 200},
  {code: 32, name: 'El Bayadh', homeDelivery: 700, agencyDelivery: 500},
  {code: 33, name: 'Illizi', homeDelivery: 900, agencyDelivery: 600},
  {code: 34, name: 'Bordj Bou Arréridj', homeDelivery: 500, agencyDelivery: 300},
  {code: 35, name: 'Boumerdès', homeDelivery: 400, agencyDelivery: 200},
  {code: 36, name: 'El Tarf', homeDelivery: 500, agencyDelivery: 300},
  {code: 37, name: 'Tindouf', homeDelivery: 900, agencyDelivery: 600},
  {code: 38, name: 'Tissemsilt', homeDelivery: 500, agencyDelivery: 300},
  {code: 39, name: 'El Oued', homeDelivery: 600, agencyDelivery: 400},
  {code: 40, name: 'Khenchela', homeDelivery: 500, agencyDelivery: 300},
  {code: 41, name: 'Souk Ahras', homeDelivery: 500, agencyDelivery: 300},
  {code: 42, name: 'Tipaza', homeDelivery: 400, agencyDelivery: 200},
  {code: 43, name: 'Mila', homeDelivery: 500, agencyDelivery: 300},
  {code: 44, name: 'Aïn Defla', homeDelivery: 500, agencyDelivery: 300},
  {code: 45, name: 'Naâma', homeDelivery: 700, agencyDelivery: 500},
  {code: 46, name: 'Aïn Témouchent', homeDelivery: 500, agencyDelivery: 300},
  {code: 47, name: 'Ghardaïa', homeDelivery: 700, agencyDelivery: 500},
  {code: 48, name: 'Relizane', homeDelivery: 500, agencyDelivery: 300},
  {code: 49, name: 'Timimoun', homeDelivery: 800, agencyDelivery: 500},
  {code: 50, name: 'Bordj Badji Mokhtar', homeDelivery: 900, agencyDelivery: 600},
  {code: 51, name: 'Ouled Djellal', homeDelivery: 600, agencyDelivery: 400},
  {code: 52, name: 'Béni Abbès', homeDelivery: 800, agencyDelivery: 500},
  {code: 53, name: 'In Salah', homeDelivery: 900, agencyDelivery: 600},
  {code: 54, name: 'In Guezzam', homeDelivery: 900, agencyDelivery: 600},
  {code: 55, name: 'Touggourt', homeDelivery: 600, agencyDelivery: 400},
  {code: 56, name: 'Djanet', homeDelivery: 900, agencyDelivery: 600},
  {code: 57, name: 'El M\'Ghair', homeDelivery: 600, agencyDelivery: 400},
  {code: 58, name: 'El Meniaa', homeDelivery: 700, agencyDelivery: 500},
  {code: 59, name: 'Hassi Messaoud', homeDelivery: 700, agencyDelivery: 500},
  {code: 60, name: 'Bir El Ater', homeDelivery: 600, agencyDelivery: 400},
  {code: 61, name: 'Ain Bida', homeDelivery: 500, agencyDelivery: 300},
  {code: 62, name: 'Barika', homeDelivery: 500, agencyDelivery: 300},
  {code: 63, name: 'Mecheria', homeDelivery: 700, agencyDelivery: 500},
  {code: 64, name: 'Bou Saada', homeDelivery: 500, agencyDelivery: 300},
  {code: 65, name: 'Ain Oussera', homeDelivery: 500, agencyDelivery: 300},
  {code: 66, name: 'El Eulma', homeDelivery: 500, agencyDelivery: 300},
  {code: 67, name: 'Maghnia', homeDelivery: 600, agencyDelivery: 400},
  {code: 68, name: 'Oued Rhiou', homeDelivery: 500, agencyDelivery: 300},
  {code: 69, name: 'Sedrata', homeDelivery: 500, agencyDelivery: 300}
].map(w => ({ ...w, isActive: true }));

async function seed() {
  try {
    if (!db) {
      console.error("Database not initialized. Please ensure serviceAccountKey.json is correct.");
      process.exit(1);
    }

    console.log("Seeding wilayas...");
    const wilayasSnapshot = await db.collection('wilayas').limit(1).get();
    if (wilayasSnapshot.empty) {
      const batch = db.batch();
      wilayasData.forEach(wilaya => {
        const ref = db.collection('wilayas').doc(wilaya.code.toString());
        batch.set(ref, wilaya);
      });
      await batch.commit();
      console.log('Seeded 69 wilayas into Firestore.');
    } else {
      console.log('Wilayas already exist in Firestore.');
    }

    console.log("Seeding admin...");
    const adminsSnapshot = await db.collection('admins').limit(1).get();
    if (adminsSnapshot.empty) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.collection('admins').add({
        username: 'fouziblh',
        password: hashedPassword,
        createdAt: new Date().toISOString()
      });
      console.log('Seeded default admin (fouziblh) into Firestore.');
    } else {
      console.log('Admin already exists in Firestore.');
    }

    console.log("Seed complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
