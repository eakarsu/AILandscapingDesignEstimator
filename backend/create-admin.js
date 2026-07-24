require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const sequelize = require('./src/config/database');

async function main() {
  if (process.env.ALLOW_SCHEMA_MIGRATION !== 'true') throw new Error('Admin provisioning requires ALLOW_SCHEMA_MIGRATION=true');
  const email = process.env.PROVISION_ADMIN_EMAIL;
  const password = process.env.PROVISION_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('PROVISION_ADMIN_EMAIL and PROVISION_ADMIN_PASSWORD are required');
  const passwordHash = await bcrypt.hash(password, 10);
  await sequelize.query(
    `INSERT INTO users (name, email, password, company, role, "createdAt", "updatedAt")
     VALUES ('Runtime Administrator', :email, :password, 'Runtime Verification', 'admin', NOW(), NOW())
     ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, password=EXCLUDED.password, company=EXCLUDED.company, role='admin', "updatedAt"=NOW()`,
    { replacements: { email, password: passwordHash } }
  );
  await sequelize.close();
}

main().catch(async (error) => {
  console.error(`Admin provisioning failed: ${error.message}`);
  try { await sequelize.close(); } catch {}
  process.exit(1);
});
