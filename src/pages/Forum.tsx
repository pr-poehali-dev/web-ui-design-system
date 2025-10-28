import { useState } from 'react';
import ForumCard from '@/components/ForumCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

const forumPosts = [
  {
    id: '1',
    type: 'challenge' as const,
    title: 'Челлендж: Создай портрет в стиле киберпанк',
    author: 'Мария Иванова',
    excerpt: 'Приглашаем всех художников принять участие в челлендже! Создайте портрет в стиле киберпанк с использованием неоновых цветов. Победитель получит премиум подписку на год!',
    replies: 156,
    views: 2341,
    votes: 89,
    tags: ['cyberpunk', 'portrait', 'challenge'],
    timeAgo: '2 часа назад',
    isActive: true,
  },
  {
    id: '2',
    type: 'discussion' as const,
    title: 'Как улучшить навыки работы с цветом?',
    author: 'Алекс Петров',
    excerpt: 'Всем привет! Недавно заметил, что мои работы выглядят блекло. Какие упражнения или ресурсы вы можете порекомендовать для развития навыков работы с цветом?',
    replies: 43,
    views: 892,
    tags: ['color-theory', 'tips', 'learning'],
    timeAgo: '5 часов назад',
  },
  {
    id: '3',
    type: 'challenge' as const,
    title: 'Еженедельный челлендж: Минимализм',
    author: 'София Лебедева',
    excerpt: 'Новый челлендж недели! Создайте работу в стиле минимализма, используя не более 3 цветов. Голосование начнется в воскресенье.',
    replies: 78,
    views: 1567,
    votes: 124,
    tags: ['minimal', 'weekly', 'voting'],
    timeAgo: '1 день назад',
    isActive: true,
  },
  {
    id: '4',
    type: 'discussion' as const,
    title: 'Лучшие планшеты для цифрового рисования в 2024',
    author: 'Дмитрий Ковалев',
    excerpt: 'Думаю обновить свой планшет. Что вы используете для цифрового рисования? Поделитесь опытом и рекомендациями!',
    replies: 67,
    views: 1234,
    tags: ['hardware', 'tablets', 'recommendations'],
    timeAgo: '2 дня назад',
  },
  {
    id: '5',
    type: 'discussion' as const,
    title: 'Critique: Получите фидбек на свои работы',
    author: 'Елена Смирнова',
    excerpt: 'Еженедельный тред для получения конструктивной критики. Делитесь своими работами и помогайте другим художникам расти!',
    replies: 234,
    views: 3456,
    tags: ['critique', 'feedback', 'community'],
    timeAgo: '3 дня назад',
    isActive: true,
  },
];

export default function Forum() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold gradient-text mb-2">Форум</h1>
              <p className="text-muted-foreground text-lg">
                Обсуждения, челленджи и голосования
              </p>
            </div>
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
              <Icon name="Plus" size={20} className="mr-2" />
              Создать тему
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Icon
                name="Search"
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Поиск по темам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Icon name="SlidersHorizontal" size={18} />
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
            <TabsList className="bg-muted">
              <TabsTrigger value="all">Все темы</TabsTrigger>
              <TabsTrigger value="challenges">🏆 Челленджи</TabsTrigger>
              <TabsTrigger value="discussions">💬 Обсуждения</TabsTrigger>
              <TabsTrigger value="trending">🔥 Популярное</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-4 animate-fade-in">
          {forumPosts.map((post) => (
            <ForumCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}
