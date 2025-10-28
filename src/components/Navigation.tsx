import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const links = [
    { path: '/', label: 'Галерея', icon: 'Home' },
    { path: '/forum', label: 'Форум', icon: 'MessageSquare' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

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

          {isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="text-xs">
                      {user?.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user?.username}</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <Icon name="LogOut" size={18} />
              </Button>
            </>
          ) : (
            <Button variant="default" asChild>
              <Link to="/auth">
                <Icon name="LogIn" size={18} className="mr-2" />
                <span className="hidden sm:inline">Войти</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}