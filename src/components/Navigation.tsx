import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Галерея', icon: 'Home' },
    { path: '/forum', label: 'Форум', icon: 'MessageSquare' },
    { path: '/profile', label: 'Профиль', icon: 'User' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
            <Icon name="Palette" size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">ArtHub</span>
        </Link>

        <div className="flex items-center gap-2">
          {links.map((link) => (
            <Button
              key={link.path}
              variant={location.pathname === link.path ? 'default' : 'ghost'}
              asChild
            >
              <Link to={link.path} className="flex items-center gap-2">
                <Icon name={link.icon as any} size={18} />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
