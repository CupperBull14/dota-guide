import { useNavigate } from 'react-router-dom';
import { Dices } from 'lucide-react';
import { HEROES } from '@/data/heroes';
import { Button } from '@/components/ui/Button';

/** Переход на страницу случайного героя. */
export function RandomHeroButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline"
      size="lg"
      icon={<Dices size={20} aria-hidden="true" />}
      onClick={() => {
        const hero = HEROES[Math.floor(Math.random() * HEROES.length)];
        if (hero) navigate(`/heroes/${hero.id}`);
      }}
    >
      Случайный герой
    </Button>
  );
}
