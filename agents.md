# agents.md - Deployment & Configuration Guide

Este archivo documenta todas las variables de entorno y configuraciones necesarias para deployar la aplicación **Experience Collection** en diferentes plataformas.

---

## 📋 Variables de Entorno

### Firestore REST API (Obligatorio)

```env
# Firebase Project ID
VITE_FIREBASE_PROJECT_ID=catallog-experiences

# Firebase REST API Key (read-only, protegido por Security Rules)
VITE_FIREBASE_API_KEY=AIzaSyB7Q-zNPFBeHwRXCtv6-aWghTMExXh_GDI
```

**Nota**: Estas variables son PÚBLICAS y SEGURAS. La API key está protegida por Firestore Security Rules que solo permiten lectura.

### Opcionales

```env
# Firebase Hosting URL
VITE_FIREBASE_HOSTING_URL=https://catallog-experiences.web.app

# Ambiente (development/staging/production)
VITE_ENV=development
```

---

## 🚀 Deployment por Plataforma

### 1. Firebase Hosting + Cloud Functions (Recomendado)

**Ventajas**:
- ✅ Included con Firebase
- ✅ SSR nativo
- ✅ Auto-scaling
- ✅ CDN global
- ✅ Free tier generoso

**Setup**:

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login a Firebase
firebase login

# 3. Inicializar proyecto (si no lo hiciste)
firebase init

# 4. Configurar .env.local
cp .env.example .env.local
# Edita con tus variables

# 5. Build
npm run build

# 6. Deploy
npm run deploy
# O manual:
firebase deploy
```

**Archivo de configuración**: `firebase.json`

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "function": "server"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  }
}
```

**Variables en Firebase Console**:
```
Firebase Console > Project Settings > Environment Variables

VITE_FIREBASE_PROJECT_ID=catallog-experiences
VITE_FIREBASE_API_KEY=AIzaSyB7Q-zNPFBeHwRXCtv6-aWghTMExXh_GDI
```

---

### 2. Netlify

**Ventajas**:
- ✅ Fácil integración con GitHub
- ✅ Pre-rendering automático
- ✅ Form handling built-in
- ✅ Edge functions

**Setup**:

```bash
# 1. Conectar repo a Netlify
# Dashboard > Add new site > Import an existing project

# 2. Configurar variables
Netlify > Project > Site settings > Build & Deploy > Environment

VITE_FIREBASE_PROJECT_ID=catallog-experiences
VITE_FIREBASE_API_KEY=AIzaSyB7Q-zNPFBeHwRXCtv6-aWghTMExXh_GDI
```

**netlify.toml**:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "functions"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"
    
[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Deploy**:

```bash
# Manual
npm run build
netlify deploy --prod --dir=dist

# O automático desde GitHub
# Netlify detecta cambios y redeploya automáticamente
```

---

### 3. Vercel

**Ventajas**:
- ✅ Next.js/Qwik optimizado
- ✅ Muy rápido
- ✅ Analytics automático
- ✅ A/B testing

**Setup**:

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Configurar proyecto
vercel link

# 4. Agregar variables
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_API_KEY

# 5. Deploy
vercel --prod
```

**vercel.json**:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_FIREBASE_PROJECT_ID": "@firebase_project_id",
    "VITE_FIREBASE_API_KEY": "@firebase_api_key"
  },
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

### 4. Cloudflare Pages

**Ventajas**:
- ✅ Global CDN
- ✅ Workers para edge functions
- ✅ DDoS protection
- ✅ Precio competitivo

**Setup**:

```bash
# 1. Connect repo a Cloudflare Pages
# Cloudflare Dashboard > Pages > Connect to Git

# 2. Configurar build
Build command: npm run build
Build output directory: dist

# 3. Variables de entorno
Cloudflare > Pages > Project > Settings > Environment variables

VITE_FIREBASE_PROJECT_ID=catallog-experiences
VITE_FIREBASE_API_KEY=AIzaSyB7Q-zNPFBeHwRXCtv6-aWghTMExXh_GDI
```

**_routes.json** (para Qwik):

```json
{
  "version": 1,
  "include": ["/"],
  "exclude": ["/images/*", "/fonts/*", "/_routes.json"]
}
```

---

### 5. AWS Amplify

**Ventajas**:
- ✅ AWS infrastructure
- ✅ Scalable
- ✅ Integrated con servicios AWS
- ✅ Pull request previews

**Setup**:

```bash
# 1. Instalar Amplify CLI
npm install -g @aws-amplify/cli

# 2. Configurar proyecto
amplify configure
amplify init

# 3. Agregar hosting
amplify add hosting

# 4. Env variables
amplify env add

# 5. Deploy
amplify publish
```

---

## 🔐 Security Best Practices

### ✅ Qué SÍ subir a GitHub

```
✅ .env.example (con valores de ejemplo)
✅ .env.local.example (template)
✅ Documentación de variables
✅ Scripts de configuración
✅ GitHub Actions workflows
```

### ❌ Qué NO subir a GitHub

```
❌ .env.local (con valores reales)
❌ .env.production (con API keys reales)
❌ Firebase service account keys
❌ Private keys o secrets
❌ Database credentials
```

### Usar Secrets en CI/CD

**GitHub Actions**:
```yaml
env:
  VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
  VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
```

**Netlify/Vercel/Cloudflare**:
- Dashboard > Settings > Environment Variables (Secrets)
- Usar UI para agregar (no commitear)

---

## 📦 Build & Deploy Checklist

```
Pre-Deploy:
☐ npm install
☐ npm run lint
☐ npm run build.types
☐ npm run build
☐ Verificar dist/ generado
☐ Test en preview local: npm run preview

Environment:
☐ VITE_FIREBASE_PROJECT_ID configurado
☐ VITE_FIREBASE_API_KEY configurado
☐ .env.local en .gitignore
☐ .env.example actualizado

Deployment:
☐ Seleccionar plataforma (Firebase/Netlify/Vercel/etc)
☐ Conectar repo a platform
☐ Agregar variables de entorno
☐ Configurar build command
☐ Deploy inicial
☐ Test production URL
☐ Verificar Firestore queries
```

---

## 🔗 Variables por Plataforma

| Plataforma | Ubicación Variables | Método Recomendado |
|-----------|-------------------|------------------|
| **Firebase** | Project Settings > Env Vars | UI Console |
| **Netlify** | Site Settings > Build & Deploy | UI Dashboard |
| **Vercel** | Project Settings > Env Vars | CLI o UI |
| **Cloudflare** | Pages > Settings > Env Vars | UI Console |
| **AWS Amplify** | App Settings > Environment Variables | Amplify CLI |
| **Local Dev** | .env.local | Manual (gitignore) |

---

## 🧪 Testing Deployment

```bash
# Build production
npm run build

# Preview producción localmente
npm run preview

# Check tipo
npm run build.types

# Check lint
npm run lint

# Deploy específica plataforma
npm run deploy  # Firebase
# o manual para otras
```

---

## 🆘 Troubleshooting

### Variables no se cargan

```bash
# Verificar .env.local existe
ls .env.local

# Verificar valores
cat .env.local | grep VITE_

# Restart dev server
npm start

# Check en browser console
console.log(import.meta.env)
```

### Firestore API errors

```
❌ "API key not valid"
→ Verificar VITE_FIREBASE_API_KEY en .env.local
→ Verificar proyecto ID correcto

❌ "Quota exceeded"
→ Check Firebase quotas
→ Aumentar si es necesario

❌ "Permission denied"
→ Verificar Firestore Security Rules
→ Rules deben permitir lectura pública
```

### Build fails

```bash
# Limpiar caché
rm -rf dist node_modules
npm install

# Rebuild
npm run build

# Check errores TypeScript
npm run build.types
```

---

## 📚 Referencias

- [Qwik Deployment](https://qwik.dev/docs/deployments/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Netlify Deployment](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [AWS Amplify](https://docs.amplify.aws/)

---

**Last Updated**: 2026-07-09
**Status**: ✅ Completo
