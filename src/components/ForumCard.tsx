import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ForumCardProps {
  id: string;
  type: 'discussion' | 'challenge';
  title: string;
  author: string;
  authorAvatar?: string;
  excerpt: string;
  replies: number;
  views: number;
  votes?: number;
  tags: string[];
  timeAgo: string;
  isActive?: boolean;
}

export default function ForumCard({
  type,
  title,
  author,
  authorAvatar,
  excerpt,
  replies,
  views,
  votes,
  tags,
  timeAgo,
  isActive,
}: ForumCardProps) {
  return (
    <Card className="p-6 hover-scale bg-card border-border">
      <div className="flex gap-4">
        {type === 'challenge' && votes !== undefined && (
          <div className="flex flex-col items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon name="ChevronUp" size={20} />
            </Button>
            <span className="text-lg font-bold text-primary">{votes}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon name="ChevronDown" size={20} />
            </Button>
          </div>
        )}

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={type === 'challenge' ? 'default' : 'secondary'}>
                  {type === 'challenge' ? '🏆 Челлендж' : '💬 Обсуждение'}
                </Badge>
                {isActive && (
                  <Badge variant="outline" className="border-accent text-accent">
                    Активно
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
                {title}
              </h3>
              <p className="text-muted-foreground line-clamp-2">{excerpt}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={authorAvatar} />
                <AvatarFallback>{author[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{author}</span>
              <span className="text-sm text-muted-foreground">• {timeAgo}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Icon name="MessageSquare" size={16} />
                <span>{replies}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Eye" size={16} />
                <span>{views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
