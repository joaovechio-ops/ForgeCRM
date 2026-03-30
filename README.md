# Forge CRM - Sales Intelligence

This is a Next.js 15 CRM application built with ShadCN UI, Tailwind CSS, and Firebase.

## Getting Started

1. **Local Development**:
   ```bash
   npm run dev
   ```
2. **Firebase Configuration**:
   The Firebase config is located in `src/firebase/config.ts`.

## Connecting to GitHub & Deploying with App Hosting

Para conectar este projeto ao seu repositório e ativar o deploy automático, execute os seguintes comandos no terminal desta workstation:

### 1. Push para o GitHub
```bash
git init
git add .
git commit -m "Initial commit: Forge CRM with AI and Quota Management"
git remote add origin https://github.com/marcelomartins-ops/ForgeCRM
git branch -M main
git push -u origin main
```

### 2. Configurar o App Hosting no Console do Firebase
1. Vá para o [Console do Firebase](https://console.firebase.google.com/).
2. Selecione seu projeto: `studio-5678031647-5ea4d`.
3. No menu à esquerda, navegue até **Build** > **App Hosting**.
4. Clique em **Começar**.
5. Conecte sua conta do GitHub e selecione o repositório `marcelomartins-ops/ForgeCRM`.
6. Siga o assistente de configuração (o arquivo `apphosting.yaml` já está presente no projeto).
7. Clique em **Finalizar e Implantar**.

O Firebase agora irá buildar e implantar sua aplicação automaticamente toda vez que você fizer um push para a branch `main`.
