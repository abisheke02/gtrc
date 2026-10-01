import { readFileSync } from 'node:fs'
import bcrypt from 'bcryptjs'
import { PrismaClient, type ItemType } from '@prisma/client'

const prisma = new PrismaClient()
const catalog = JSON.parse(readFileSync(new URL('../../shared/catalog.json', import.meta.url), 'utf8'))

async function upsertItems(type: ItemType, items: Array<{ slug: string; name: string; priceInr: number } & Record<string, unknown>>) {
  for (const [i, { slug, name, priceInr, ...data }] of items.entries()) {
    // Never overwrite admin edits: only create missing items.
    await prisma.catalogItem.upsert({
      where: { type_slug: { type, slug } },
      update: {},
      create: { type, slug, name, priceInr, sortOrder: i, data: data as object },
    })
  }
}

async function main() {
  await upsertItems('PROGRAM', catalog.programs)
  await upsertItems('PLAN', catalog.plans)
  await upsertItems('EVENT', catalog.events)

  const email = process.env.ADMIN_SEED_EMAIL
  const password = process.env.ADMIN_SEED_PASSWORD
  if (email && password) {
    await prisma.adminUser.upsert({
      where: { email },
      update: {},
      create: { email, name: 'GTRC Admin', passwordHash: await bcrypt.hash(password, 12) },
    })
    console.log(`Admin user ready: ${email}`)
  } else {
    console.log('ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD not set: skipped admin user')
  }
  console.log('Seed complete')
}

main().finally(() => prisma.$disconnect())
