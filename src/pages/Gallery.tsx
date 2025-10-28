import { useState } from 'react';
import ArtCard from '@/components/ArtCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  artistAvatar?: string;
  image: string;
  likes: number;
  comments: number;
  tags: string[];
  description: string;
}

const artworks: Artwork[] = [
  {
    id: '1',
    title: 'Космическая одиссея',
    artist: 'Мария Иванова',
    image: '/placeholder.svg',
    likes: 342,
    comments: 28,
    tags: ['digital', 'space', 'sci-fi'],
    description: 'Исследование бесконечности космоса через цифровое искусство',
  },
  {
    id: '2',
    title: 'Неоновый город',
    artist: 'Алекс Петров',
    image: '/placeholder.svg',
    likes: 521,
    comments: 45,
    tags: ['cyberpunk', 'neon', 'urban'],
    description: 'Футуристический взгляд на городскую жизнь',
  },
  {
    id: '3',
    title: 'Абстрактные эмоции',
    artist: 'София Лебедева',
    image: '/placeholder.svg',
    likes: 289,
    comments: 19,
    tags: ['abstract', 'emotions', 'colors'],
    description: 'Визуализация человеческих эмоций через абстракцию',
  },
  {
    id: '4',
    title: 'Портрет будущего',
    artist: 'Дмитрий Ковалев',
    image: '/placeholder.svg',
    likes: 678,
    comments: 92,
    tags: ['portrait', 'futuristic', 'digital'],
    description: 'Слияние классического портрета с футуризмом',
  },
  {
    id: '5',
    title: 'Природа 2.0',
    artist: 'Елена Смирнова',
    image: '/placeholder.svg',
    likes: 445,
    comments: 34,
    tags: ['nature', 'digital', 'surreal'],
    description: 'Переосмысление природы в цифровую эпоху',
  },
  {
    id: '6',
    title: 'Геометрия света',
    artist: 'Артем Волков',
    image: '/placeholder.svg',
    likes: 512,
    comments: 41,
    tags: ['geometric', 'light', 'minimal'],
    description: 'Игра света и геометрических форм',
  },
];

export default function Gallery() {
  const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);
  const [filter, setFilter] = useState('all');

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-8 space-y-4">
          <h1 className="text-5xl font-bold gradient-text">Галерея работ</h1>
          <p className="text-muted-foreground text-lg">
            Исследуйте творчество талантливых художников
          </p>

          <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
            <TabsList className="bg-muted">
              <TabsTrigger value="all">Все работы</TabsTrigger>
              <TabsTrigger value="trending">🔥 Популярное</TabsTrigger>
              <TabsTrigger value="new">✨ Новинки</TabsTrigger>
              <TabsTrigger value="featured">⭐ Избранное</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {artworks.map((art) => (
            <ArtCard
              key={art.id}
              {...art}
              onClick={() => setSelectedArt(art)}
            />
          ))}
        </div>

        <Dialog open={!!selectedArt} onOpenChange={() => setSelectedArt(null)}>
          <DialogContent className="max-w-4xl">
            {selectedArt && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-lg overflow-hidden bg-muted">
                  <img
                    src={selectedArt.image}
                    alt={selectedArt.title}
                    className="w-full h-auto"
                  />
                </div>

                <div className="space-y-4">
                  <DialogHeader>
                    <DialogTitle className="text-3xl">{selectedArt.title}</DialogTitle>
                  </DialogHeader>

                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedArt.artistAvatar} />
                      <AvatarFallback>{selectedArt.artist[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedArt.artist}</p>
                      <p className="text-sm text-muted-foreground">Художник</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{selectedArt.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {selectedArt.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 pt-4 border-t">
                    <Button variant="default" className="flex-1">
                      <Icon name="Heart" size={18} className="mr-2" />
                      {selectedArt.likes}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Icon name="MessageCircle" size={18} className="mr-2" />
                      {selectedArt.comments}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Icon name="Share2" size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
