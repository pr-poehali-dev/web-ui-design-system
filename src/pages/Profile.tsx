import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArtCard from '@/components/ArtCard';
import Icon from '@/components/ui/icon';

const userArtworks = [
  {
    id: '1',
    title: 'Космическая одиссея',
    artist: 'Вы',
    image: 'https://cdn.poehali.dev/projects/0095dfac-c173-43fc-84c4-f46b99709bfc/files/c110ee33-1ae5-4cb0-af5f-f04ddad23bd0.jpg',
    likes: 342,
    comments: 28,
    tags: ['digital', 'space', 'sci-fi'],
  },
  {
    id: '2',
    title: 'Неоновый город',
    artist: 'Вы',
    image: 'https://cdn.poehali.dev/projects/0095dfac-c173-43fc-84c4-f46b99709bfc/files/ce2ffa48-d81e-4537-a5cf-f5cca98e1987.jpg',
    likes: 521,
    comments: 45,
    tags: ['cyberpunk', 'neon', 'urban'],
  },
];

const achievements = [
  { id: '1', title: 'Первая работа', icon: '🎨', date: 'Янв 2024' },
  { id: '2', title: '100 лайков', icon: '❤️', date: 'Фев 2024' },
  { id: '3', title: 'Победитель челленджа', icon: '🏆', date: 'Мар 2024' },
  { id: '4', title: 'Активный участник', icon: '⭐', date: 'Апр 2024' },
];

export default function Profile() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <Card className="p-8 mb-8 bg-gradient-to-br from-card to-muted border-border">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-32 h-32 border-4 border-primary">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-4xl">МИ</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Мария Иванова</h1>
                <p className="text-muted-foreground text-lg">
                  Цифровой художник • Москва
                </p>
              </div>

              <p className="text-muted-foreground max-w-2xl">
                Создаю футуристические миры через цифровое искусство. Люблю
                экспериментировать с цветом и светом. Участница множества
                международных выставок.
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Icon name="Palette" size={14} className="mr-1" />
                  Digital Art
                </Badge>
                <Badge variant="secondary">
                  <Icon name="Sparkles" size={14} className="mr-1" />
                  Sci-Fi
                </Badge>
                <Badge variant="secondary">
                  <Icon name="Zap" size={14} className="mr-1" />
                  Cyberpunk
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
                <Icon name="Settings" size={18} className="mr-2" />
                Редактировать
              </Button>
              <Button variant="outline" size="lg">
                <Icon name="Share2" size={18} className="mr-2" />
                Поделиться
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">42</p>
              <p className="text-sm text-muted-foreground">Работ</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">1.2K</p>
              <p className="text-sm text-muted-foreground">Подписчиков</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">8.5K</p>
              <p className="text-sm text-muted-foreground">Лайков</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">12</p>
              <p className="text-sm text-muted-foreground">Достижений</p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="works" className="w-full">
          <TabsList className="bg-muted mb-6">
            <TabsTrigger value="works">Работы</TabsTrigger>
            <TabsTrigger value="achievements">Достижения</TabsTrigger>
            <TabsTrigger value="activity">Активность</TabsTrigger>
          </TabsList>

          <TabsContent value="works" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userArtworks.map((art) => (
                <ArtCard key={art.id} {...art} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="p-6 text-center hover-scale bg-card border-border"
                >
                  <div className="text-5xl mb-3">{achievement.icon}</div>
                  <h3 className="font-semibold mb-1">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {achievement.date}
                  </p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="animate-fade-in">
            <Card className="p-6 bg-card border-border">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 pb-4 border-b border-border last:border-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="Heart" size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Алекс Петров</span>{' '}
                        оценил вашу работу{' '}
                        <span className="font-medium">
                          "Космическая одиссея"
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {i} час назад
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}