import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/user';

export default function HomePage() {
  const { logout } = useAuth();

  return (
    <Button onClick={() => void logout()} size="medium" variant="destructive">
      Logout
    </Button>
  );
}
