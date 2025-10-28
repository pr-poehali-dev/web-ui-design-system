import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { authAPI } from '@/lib/api';
import Icon from '@/components/ui/icon';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const data = await authAPI.login(email, password);
      
      if (data.error) {
        toast({
          title: 'Ошибка входа',
          description: data.error,
          variant: 'destructive',
        });
      } else {
        login(data.user, data.token);
        toast({
          title: 'Добро пожаловать!',
          description: `Вы вошли как ${data.user.username}`,
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось войти в систему',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('reg-email') as string;
    const password = formData.get('reg-password') as string;
    const username = formData.get('name') as string;

    try {
      const data = await authAPI.register(email, password, username);
      
      if (data.error) {
        toast({
          title: 'Ошибка регистрации',
          description: data.error,
          variant: 'destructive',
        });
      } else {
        login(data.user, data.token);
        toast({
          title: 'Аккаунт создан!',
          description: `Добро пожаловать, ${data.user.username}!`,
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать аккаунт',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-muted/20 to-background">
      <Card className="w-full max-w-md p-8 bg-card border-border animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent mb-4">
            <Icon name="Palette" size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">ArtHub</h1>
          <p className="text-muted-foreground">
            Платформа для творческих людей
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="art@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary"
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    или продолжить с
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" type="button">
                  <Icon name="Github" size={18} className="mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" type="button">
                  <Icon name="Chrome" size={18} className="mr-2" />
                  Google
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Иван Иванов"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  name="reg-email"
                  type="email"
                  placeholder="art@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Пароль</Label>
                <Input
                  id="reg-password"
                  name="reg-password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary"
                disabled={isLoading}
              >
                {isLoading ? 'Создание...' : 'Создать аккаунт'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}