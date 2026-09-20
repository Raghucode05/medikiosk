const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'data', 'medikiosk.db');
console.log('Testing database connection at:', dbPath);

const db = new Database(dbPath);
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log('Tables in DB:', tables.map(t => t.name));

const patientCount = db.prepare('SELECT COUNT(*) as count FROM patients').get();
console.log('Patients count:', patientCount.count);

const queueCount = db.prepare('SELECT COUNT(*) as count FROM queue').get();
console.log('Queue count:', queueCount.count);

const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
console.log('Users count:', userCount.count);

const settings = db.prepare('SELECT * FROM clinic_settings WHERE id = ?').get('default');
console.log('Clinic settings:', settings?.name, settings?.city);

console.log('Database verification passed successfully!');
