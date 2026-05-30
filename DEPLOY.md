# Instrucciones de Deploy — La Mona Trading Base de Proveedores

---

## 1. Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta (o inicia sesión).
2. Clic en **New Project**.
   - Nombre: `la-mona-trading`
   - Contraseña de base de datos: guárdala en un lugar seguro
   - Región: elige la más cercana (ej. South America)
3. Espera que el proyecto se cree (~2 minutos).

### Crear las tablas

4. Ve a **SQL Editor → New query**.
5. Copia y pega el contenido de `supabase/schema.sql`.
6. Haz clic en **Run** (▶).

### Desactivar registro público

7. Ve a **Authentication → Providers → Email**.
8. Desactiva **"Allow new users to sign up"** ← MUY IMPORTANTE.
9. Para invitar usuarios: **Authentication → Users → Invite user** → ingresa el email.

### Obtener las keys

10. Ve a **Settings → API**.
11. Copia:
    - `Project URL` → es tu `NEXT_PUBLIC_SUPABASE_URL`
    - `anon public` key → es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Obtener API Key de Anthropic

1. Ve a [https://console.anthropic.com](https://console.anthropic.com).
2. **API Keys → Create Key**.
3. Copia la key → es tu `ANTHROPIC_API_KEY`.

---

## 3. Configurar variables de entorno locales

```bash
cd la-mona-trading
cp .env.local.example .env.local
```

Edita `.env.local` con tus valores reales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

## 4. Instalar y correr localmente

```bash
cd la-mona-trading
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 5. Deploy en Vercel

### Opción A: desde GitHub (recomendado)

1. Sube el proyecto a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU_USUARIO/la-mona-trading.git
   git push -u origin main
   ```

2. Ve a [https://vercel.com](https://vercel.com) → **New Project**.
3. Importa el repositorio de GitHub.
4. En **Environment Variables**, agrega las 3 variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
5. Clic en **Deploy**.

### Opción B: con Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Cuando pida las env vars, ingrésalas manualmente o usa:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add ANTHROPIC_API_KEY
```

---

## 6. Apuntar app.lamonatrading.com desde Hostinger

### En Vercel

1. Ve a tu proyecto en Vercel → **Settings → Domains**.
2. Clic en **Add Domain**.
3. Escribe: `app.lamonatrading.com`
4. Vercel te mostrará un registro DNS — cópialo (será tipo `CNAME` apuntando a `cname.vercel-dns.com`).

### En Hostinger

1. Inicia sesión en [https://hpanel.hostinger.com](https://hpanel.hostinger.com).
2. Ve a **Dominios → lamonatrading.com → Administrar → DNS / Servidores de nombres**.
3. En la sección **Registros DNS**, agrega:
   - **Tipo:** CNAME
   - **Nombre/Host:** `app`
   - **Apunta a:** `cname.vercel-dns.com`
   - **TTL:** 3600 (o el mínimo disponible)
4. Guarda los cambios.
5. Espera 5-30 minutos para propagación DNS.
6. En Vercel, haz clic en **Verify** — cuando el dominio se verifique, el SSL se activa automáticamente.

### Resultado

Tu app estará disponible en: **https://app.lamonatrading.com**

---

## Resumen de variables de entorno

| Variable | Dónde obtenerla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |

---

## Gestión de usuarios

- Solo el **administrador** puede invitar usuarios.
- En Supabase: **Authentication → Users → Invite user**.
- El usuario invitado recibe un email con un link para establecer su contraseña.
- Después usa el login normal con email y contraseña.
