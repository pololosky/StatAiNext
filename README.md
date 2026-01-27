This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# pour lancer la base de donne a votre niveau (PostGresSql)
1- npm install prisma tsx @types/pg --save-dev
2- npm install @prisma/client @prisma/adapter-pg dotenv pg
3- creer une base de données postgres du nom de statAi
4- creer un fichier .env et mettez : DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/statAi?schema=public"
   en remplacant johndoe->par le nom de votre server; randompassword->par le mot de passe.
   s'il y'a une erreur verifier que le nom statAi est bien celui que vous avez mis pour la base de donne
5- npx prisma migrate
6- npx prisma generate
7- npx tsx seed.ts
8- npx prisma studio