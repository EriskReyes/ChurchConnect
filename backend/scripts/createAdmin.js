import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const userSchema = new mongoose.Schema({
  name:         String,
  email:        String,
  password:     String,
  role:         { type: String, default: 'Member' },
  status:       { type: String, default: 'Approved' },
  authProvider: { type: String, default: 'local' },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now },
}, { strict: false });

const User = mongoose.model('User', userSchema);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const ask = (question) => new Promise(resolve => rl.question(question, resolve));

const askPassword = (question) => new Promise(resolve => {
  process.stdout.write(question);
  process.stdin.setRawMode?.(true);
  process.stdin.resume();

  let password = '';
  const onData = (ch) => {
    ch = ch.toString();
    if (ch === '\n' || ch === '\r' || ch === '') {
      process.stdin.setRawMode?.(false);
      process.stdin.pause();
      process.stdin.removeListener('data', onData);
      process.stdout.write('\n');
      resolve(password);
    } else if (ch === '') {
      process.exit();
    } else if (ch === '' || ch === '\b') {
      if (password.length > 0) {
        password = password.slice(0, -1);
        process.stdout.write('\b \b');
      }
    } else {
      password += ch;
      process.stdout.write('*');
    }
  };
  process.stdin.on('data', onData);
});

async function main() {
  console.log('\n╔════════════════════════════════════╗');
  console.log('║   ChurchConnect — Crear Admin       ║');
  console.log('╚════════════════════════════════════╝\n');

  const name  = (await ask('  Nombre (ej. Admin) : ')).trim();
  const email = (await ask('  Email  (ej. admin@example.com) : ')).trim().toLowerCase();

  let password = '';
  let confirm  = '';
  while (true) {
    password = await askPassword('  Contraseña      : ');
    if (password.length < 6) {
      console.log('  ⚠️  Mínimo 6 caracteres. Intenta de nuevo.\n');
      continue;
    }
    confirm = await askPassword('  Confirmar        : ');
    if (password !== confirm) {
      console.log('  ⚠️  Las contraseñas no coinciden. Intenta de nuevo.\n');
    } else {
      break;
    }
  }

  rl.close();

  if (!name || !email || !password) {
    console.log('\n❌ Todos los campos son requeridos.\n');
    process.exit(1);
  }

  console.log('\n🔌 Conectando a la base de datos...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Conectado\n');

  const salt   = await bcryptjs.genSalt(10);
  const hashed = await bcryptjs.hash(password, salt);

  const existing = await User.findOne({ email });

  if (existing) {
    await User.findByIdAndUpdate(existing._id, {
      name, role: 'Admin', status: 'Approved', password: hashed, updatedAt: new Date(),
    });
    console.log('✅ Cuenta existente actualizada a Admin.');
  } else {
    await User.create({ name, email, password: hashed, role: 'Admin', status: 'Approved', authProvider: 'local' });
    console.log('✅ Cuenta Admin creada.');
  }

  console.log(`\n   Nombre : ${name}`);
  console.log(`   Email  : ${email}`);
  console.log(`   Rol    : Admin\n`);
  console.log('🚀 Ya puedes iniciar sesión.\n');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('\n❌ Error:', err.message, '\n');
  process.exit(1);
});
