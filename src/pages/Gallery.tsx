import { useState, useEffect } from 'react';
import ArtCard from '@/components/ArtCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth-context';
import { artworksAPI, interactionsAPI, type Artwork } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

export default function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      const data = await artworksAPI.getAll();
      setArtworks(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить работы',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (artworkId: number) => {
    if (!user) {
      toast({
        title: 'Войдите в систему',
        description: 'Чтобы ставить лайки, нужно войти',
      });
      return;
    }

    try {
      await interactionsAPI.like(artworkId, user.id);
      await loadArtworks();
      toast({
        title: 'Лайк поставлен',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось поставить лайк',
        variant: 'destructive',
      });
    }
  };

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

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка работ...</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Работы пока не загружены. Станьте первым!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {artworks.map((art) => (
              <ArtCard
                key={art.id}
                id={String(art.id)}
                title={art.title}
                artist={art.username}
                artistAvatar={art.artist_avatar}
                image={art.image_url}
                likes={art.likes}
                comments={art.comments}
                tags={art.tags}
                onClick={() => setSelectedArt(art)}
              />
            ))}
          </div>
        )}

        <Dialog open={!!selectedArt} onOpenChange={() => setSelectedArt(null)}>
          <DialogContent className="max-w-4xl">
            {selectedArt && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-lg overflow-hidden bg-muted">
                  <img
                    src={selectedArt.image_url}
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
                      <AvatarImage src={selectedArt.artist_avatar} />
                      <AvatarFallback>{selectedArt.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedArt.username}</p>
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
                    <Button 
                      variant="default" 
                      className="flex-1"
                      onClick={() => handleLike(selectedArt.id)}
                    >
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