
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, LogIn, AlertCircle, ExternalLink, UserPlus, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage() {
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [error, setError] = useState<{title: string, message: string, showBootstrap?: boolean, pendingUser?: FirebaseUser} | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (user && !isAuthenticating && !error) {
      router.push('/dashboard');
    }
  }, [user, isAuthenticating, router, error]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsAuthenticating(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;

      const userDocRef = doc(db, 'users', loggedUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Se o usuário não existe, mantemos o estado da conta mas mostramos o erro com opção de bootstrap
        setError({
          title: "Acesso Negado",
          message: "Você não está registrado na lista da Equipe do Projeto. Como este é um ambiente de desenvolvimento, você pode inicializar seu perfil como Administrador abaixo.",
          showBootstrap: true,
          pendingUser: loggedUser
        });
        setIsAuthenticating(false);
        return;
      }

      const userData = userDoc.data();
      if (!userData.isActive) {
        await signOut(auth);
        setError({
          title: "Conta Inativa",
          message: "Sua conta está inativa no momento. Entre em contato com seu administrador."
        });
        setIsAuthenticating(false);
        return;
      }

      router.push('/dashboard');
    } catch (err: any) {
      console.error("Sign-in error:", err);
      
      if (err.code === 'auth/operation-not-allowed') {
        setError({
          title: "Configuração Necessária",
          message: "O provedor 'Google' precisa ser ativado no Console do Firebase (Authentication > Sign-in method)."
        });
      } else {
        setError({
          title: "Falha na Autenticação",
          message: err.message || "Ocorreu um erro inesperado durante o login."
        });
      }
      setIsAuthenticating(false);
    }
  };

  const handleBootstrapAdmin = async () => {
    if (!error?.pendingUser || !db) return;
    
    setIsAuthenticating(true);
    try {
      const userRef = doc(db, 'users', error.pendingUser.uid);
      await setDoc(userRef, {
        id: error.pendingUser.uid,
        email: error.pendingUser.email,
        displayName: error.pendingUser.displayName || "Admin User",
        role: "admin",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      setError(null);
      router.push('/dashboard');
    } catch (err: any) {
      setError({
        title: "Erro ao Criar Perfil",
        message: "Não foi possível criar seu perfil no banco de dados. Verifique as regras de segurança do Firestore."
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Flame className="w-12 h-12 text-primary fill-primary" />
          <span className="text-primary font-bold">Verificando Sessão...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex aspect-square size-16 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Flame className="size-10 fill-current" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-headline font-extrabold tracking-tighter text-primary">
              FORGE<span className="text-accent">CRM</span>
            </CardTitle>
            <CardDescription className="font-medium text-muted-foreground uppercase text-[10px] tracking-widest">
              Sales Intelligence SSO
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant={error.showBootstrap ? "default" : "destructive"} className={error.showBootstrap ? "bg-accent/10 border-accent/20 text-primary" : "bg-destructive/10 border-destructive/20 text-destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{error.title}</AlertTitle>
              <AlertDescription className="text-xs font-medium space-y-3">
                <p>{error.message}</p>
                {error.title === "Configuração Necessária" && (
                  <a 
                    href="https://console.firebase.google.com/project/_/authentication/providers" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 underline hover:text-destructive/80 transition-colors"
                  >
                    Abrir Console do Firebase <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {error.showBootstrap && (
                  <Button 
                    onClick={handleBootstrapAdmin} 
                    className="w-full mt-2 bg-accent hover:bg-accent/90 text-white font-bold text-[10px] h-8 gap-2"
                    disabled={isAuthenticating}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    INICIALIZAR MEU PERFIL ADMIN
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {!error?.showBootstrap && (
              <Button 
                className="w-full h-12 bg-white hover:bg-muted text-foreground border border-input shadow-sm flex items-center justify-center gap-3 font-bold"
                onClick={handleGoogleSignIn}
                disabled={isAuthenticating}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>
            )}

            {error?.showBootstrap && (
              <Button 
                variant="ghost" 
                className="w-full text-[10px] font-bold text-muted-foreground uppercase hover:bg-transparent"
                onClick={() => {
                  signOut(auth);
                  setError(null);
                }}
              >
                Tentar com outra conta
              </Button>
            )}
            
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
              Restricted Access for Team Members Only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
