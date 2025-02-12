import { Link } from '@tanstack/react-router';
import { MoveLeft } from 'lucide-react';

export default function HomeLink() {
  return (
    <Link to="/">
      <div className="inline-flex items-center gap-2 text-foreground/50 hover:bg-muted w-fit px-2 py-1 rounded-sm text-sm">
        <MoveLeft className="w-4" />
        Home
      </div>
    </Link>
  );
}
