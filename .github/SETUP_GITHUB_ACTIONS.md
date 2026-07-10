# Setup GitHub Actions para Auto-Deploy

El workflow `.github/workflows/deploy.yml` está configurado para auto-deploy a Firebase Hosting cuando haces push a `main`.

## ✅ Lo que está hecho

- ✅ Workflow YAML configurado
- ✅ Secrets `VITE_FIREBASE_PROJECT_ID` y `VITE_FIREBASE_API_KEY` ya agregados
- ✅ Build & TypeCheck automático

## 🔧 Lo que falta

Necesitas agregar **1 secret más** en GitHub para el deploy a Firebase:

### 1. Generar Firebase Service Account

Ejecuta este comando en tu terminal local:

```bash
firebase login:ci
```

Esto abrirá un navegador para que inicies sesión con tu cuenta de Google/Firebase.

Después, verás un token como este:

```
✔  Success! Use this token to login on a CI server:

1//0gJ-...rest-of-token...
```

### 2. Copiar el token

Copia todo el token (la parte que empieza con `1//0gJ-...`)

### 3. Agregar a GitHub Secrets

```bash
# Opción 1: Con gh CLI
gh secret set FIREBASE_SERVICE_ACCOUNT --body "1//0gJ-...rest-of-token..."

# Opción 2: Manual en GitHub UI
# GitHub > Settings > Secrets and variables > Actions > New repository secret
# Name: FIREBASE_SERVICE_ACCOUNT
# Value: (pegar el token)
```

### 4. Verificar

```bash
# Ver los secrets
gh secret list
```

Debería mostrar:

```
FIREBASE_SERVICE_ACCOUNT       2026-07-10T01:25:00Z
VITE_FIREBASE_API_KEY         2026-07-10T01:22:18Z
VITE_FIREBASE_PROJECT_ID      2026-07-10T01:22:14Z
```

## 🚀 Una vez configurado

Cada vez que hagas push a `main`:

1. ✅ GitHub Actions se ejecuta automáticamente
2. ✅ Instala dependencias (`npm ci`)
3. ✅ Corre type checking (`npm run build.types`)
4. ✅ Corre lint (`npm run lint`)
5. ✅ Build del proyecto (`npm run build`)
6. ✅ Deploy a Firebase Hosting
7. ✅ Tu app está en: https://catallog-experiences.web.app

## 📊 Ver logs del workflow

1. GitHub > Actions
2. Selecciona el último workflow
3. Haz clic en "Build & Deploy to Firebase"
4. Ver logs en tiempo real

## ❌ Si el deploy falla

```
Error: "FIREBASE_SERVICE_ACCOUNT not found"
→ Ejecuta `firebase login:ci` y agrega el token a GitHub Secrets

Error: "Build failed"
→ Ver logs en GitHub Actions > Job output
→ Verificar que .env.example tiene variables correctas

Error: "Permission denied"
→ Verificar que tu cuenta tiene acceso al proyecto "catallog-experiences" en Firebase
```

## 🔒 Security Notes

- El token de `firebase login:ci` es solo para **deploy**, no para read production data
- Está protegido como secret en GitHub (no visible en logs)
- Puedes revocar el token cuando quieras con `firebase logout`

## 📚 Próximos pasos (Opcional)

### Agregar notificaciones a Slack

```bash
gh secret set SLACK_WEBHOOK --body "https://hooks.slack.com/services/..."
```

Luego editar `.github/workflows/deploy.yml` para agregar:

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "✅ Deploy to Firebase successful!",
        "channel": "#deployments"
      }
```

### Agregar staging deploy

Crear rama `staging` y otro workflow que haga preview deploy.

### Agregar revisión de Lighthouse

Agregar `lighthouse-ci-action` para verificar performance antes de deploy.

---

**Status**: ⏳ Pendiente de agregar `FIREBASE_SERVICE_ACCOUNT`
**Ver**: `.github/workflows/deploy.yml`
