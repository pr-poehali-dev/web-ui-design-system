import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface ArtCardProps {
  id: string;
  title: string;
  artist: string;
  artistAvatar?: string;
  image: string;
  likes: number;
  comments: number;
  tags: string[];
  onClick?: () => void;
}

export default function ArtCard({
  title,
  artist,
  artistAvatar,
  image,
  likes,
  comments,
  tags,
  onClick,
}: ArtCardProps) {
  return (
    <Card
      className="group overflow-hidden cursor-pointer hover-scale bg-card border-border"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>

        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={artistAvatar} />
            <AvatarFallback>{artist[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{artist}</span>
        </div>

        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icon name="Heart" size={16} />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="MessageCircle" size={16} />
            <span>{comments}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
