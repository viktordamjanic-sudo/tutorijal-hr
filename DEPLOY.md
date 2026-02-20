# 🚀 GitHub + Vercel Deploy Guide

## Korak 1: Kreiraj GitHub repo

1. Idi na https://github.com/new
2. **Repository name**: `tutorijal-hr`
3. **Description**: "AI tutorijal - Nauči AI riješiti stvarne probleme"
4. Ostavi **Public**
5. NE dodavati README (već imamo)
6. Klikni **Create repository**

## Korak 2: Poveži lokalni repo s GitHub

Kopiraj ove naredbe u terminal:

```bash
cd ~/Code/tutorijal

# Dodaj GitHub remote (ZAMIJENI 'tvoj-username' s tvojim GitHub usernameom)
git remote add origin https://github.com/tvoj-username/tutorijal-hr.git

# Push na GitHub
git branch -M main
git push -u origin main
```

## Korak 3: Poveži s Vercel

1. Idi na https://vercel.com/new
2. Klikni **Import Git Repository**
3. Odaberi `tutorijal-hr` repo
4. **Framework Preset**: Astro
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. U **Environment Variables** (Vercel Settings -> Environment Variables) OBAVEZNO dodaj:
   - `PUBLIC_CONVEX_URL` = `https://efficient-antelope-653.convex.cloud`
   - `PUBLIC_CLERK_PUBLISHABLE_KEY` = (tvoj Clerk Publishable Key, kreće s pk_test ili pk_live)
   - `CLERK_SECRET_KEY` = (tvoj Clerk Secret Key, kreće s sk_test ili sk_live)
   - `PUBLIC_CLERK_SIGN_IN_URL` = `/sign-in`
   - `PUBLIC_CLERK_SIGN_UP_URL` = `/sign-up`
8. Odi na karticu **Deployments** u Vercelu i napravi **Redeploy** da server povuče nove ključeve.

## ✅ Gotovo!

Vercel će automatski:
- Buildati projekt pri svakom pushu na GitHub
- Deployati na produkciju
- Dati ti besplatni SSL certifikat
- Pružiti analitiku

## 🔄 Automatski deploy

Svaki put kad napraviš:
```bash
git add .
git commit -m "Nove promjene"
git push
```

Vercel će **automatski** rebuildati i redeployati! 🎉

## 📋 Potrebno za deploy:

| Servis | Status |
|--------|--------|
| GitHub repo | ⏳ Čeka kreiranje |
| Vercel project | ⏳ Čeka import |
| Convex backend | ✅ Spreman |
| Kod | ✅ Commitan |

---

**Kad završiš, javi mi URL pa testiramo!** 🔗
