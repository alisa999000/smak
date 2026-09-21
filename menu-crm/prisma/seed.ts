import { PrismaClient } from "@prisma/client";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const prisma = new PrismaClient();
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

const COMPANY = {
  name: "ИП Хулуп Виктор Юрьевич",
  inn: "781449116450",
  ogrnip: "322784700346810",
  account: "40802810632510002225",
  bank: 'ФИЛИАЛ "САНКТ-ПЕТЕРБУРГСКИЙ" АО "АЛЬФА-БАНК"',
  bik: "044030786",
  corrAccount: "30101810600000000786",
  addressActual: "ул. Планерная, дом 59А, ТК ЛеоМолл, пом. 461, 4 этаж",
  addressLegal: "ул. Туристская, дом 23, корпус 5, кв. 97",
};

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      companyJson: JSON.stringify(COMPANY),
    },
    update: {
      companyJson: JSON.stringify(COMPANY),
    },
  });

  const pages = [
    {
      slug: "menyu",
      legacyModxId: 2,
      pagetitle: "Меню",
      isfolder: true,
      template: 1,
      menuindex: 1,
      content: "",
    },
    {
      slug: "kontakty",
      legacyModxId: 29,
      pagetitle: "Контакты",
      introtext: "Связаться с «Смачной точкой»",
      content: `<p>Телефон: <strong>+7 (911) 792-48-29</strong></p>
<p>Email: <a href="mailto:smachnayatochka@mail.ru">smachnayatochka@mail.ru</a></p>
<p>Адрес: ул. Планерная, дом 59А, ТК ЛеоМолл, пом. 461, 4 этаж</p>
<p>Режим работы: ежедневно, без выходных. Заказы до 16:00.</p>`,
    },
    {
      slug: "company",
      legacyModxId: 30,
      pagetitle: "О компании",
      introtext: "Организация питания для предприятий Санкт-Петербурга с 2011 года",
      content: `<p><strong>ИП Хулуп Виктор Юрьевич</strong> — организация комплексного питания для производств и офисов.</p>
<p>ИНН 781449116450 · ОГРНИП 322784700346810</p>
<p>Мы не просто поставщик еды — мы партнёр в заботе о здоровье сотрудников вашей компании.</p>`,
    },
    {
      slug: "akcii",
      legacyModxId: 31,
      pagetitle: "Акции",
      content: "<p>Спецпредложения и акции для корпоративных клиентов. Следите за обновлениями.</p>",
    },
    {
      slug: "chasto-zadavaemy-voprosy",
      legacyModxId: 32,
      pagetitle: "Часто задаваемые вопросы",
      content: `<h2>Как оформить заказ?</h2><p>Через личный кабинет на lk.smachnaya.ru или по телефону.</p>
<h2>До какого времени принимаются заказы?</h2><p>Заказы на следующий день — до 16:00.</p>
<h2>Можно ли заказать дегустацию?</h2><p>Да, оставьте заявку на главной странице сайта.</p>`,
    },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      create: p,
      update: p,
    });
  }

  await prisma.banner.deleteMany();
  await prisma.banner.createMany({
    data: [
      { image: "/assets/images/banner1.jpg", title: "Наша компания", text: "Комплексное питание", link: "/company", sortOrder: 0 },
      { image: "/assets/images/banner2.jpg", title: "Комплексный обед", text: "Вкусно и сбалансированно", link: "/menyu", sortOrder: 1 },
    ],
  });

  // Удаляем демо-блюда и пустые seed-категории (реальные категории приходят из import:weekly-json)
  await prisma.product.deleteMany({ where: { slug: { in: ["utinyj-okorok", "kurinyj-sup"] } } });
  for (const slug of ["goryachee", "salaty", "garniry", "zakuski"]) {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (!cat) continue;
    const count = await prisma.product.count({ where: { categoryId: cat.id } });
    if (count === 0) {
      await prisma.category.delete({ where: { id: cat.id } });
    }
  }

  const demoUserPass = await hashPassword("demo123456");
  await prisma.siteUser.upsert({
    where: { email: "demo@smachnaya.ru" },
    create: {
      username: "demo",
      email: "demo@smachnaya.ru",
      passwordHash: demoUserPass,
      fullname: "Демо Пользователь",
      phone: "+791117924829",
      legacyModxId: 1001,
    },
    update: {},
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
