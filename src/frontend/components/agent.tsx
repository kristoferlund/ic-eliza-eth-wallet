import { Skeleton } from './ui/skeleton';
import { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import useSetAgent from '@/hooks/useSetAgent';
import { Link } from '@tanstack/react-router';
import { Cog } from 'lucide-react';
import { Button } from './ui/button';
import useGetAgent from '@/hooks/useGetAgent';

export function Agent() {
  const { data: agent, isPending } = useGetAgent();
  const { mutate: setAgent, isPending: isSetAgentPending } = useSetAgent();

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    setValue(agent || '');
    setEditing(true);
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  if (editing) {
    return (
      <Input
        ref={inputRef}
        type="text"
        className="border w-full border-muted-foreground rounded-md px-2 py-1"
        placeholder="Allowed agent principal"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setAgent(value);
            setEditing(false);
          }
          if (e.key === 'Escape') {
            setEditing(false);
          }
        }}
      />
    );
  }

  if (isPending || isSetAgentPending) {
    return <Skeleton className="h-[19px] w-[125px] inline-block" />;
  }

  if (!agent) {
    return (
      <div className="text-muted-foreground inline-block" onClick={handleClick}>
        &lt;Set allowed agent&gt;
      </div>
    );
  }

  return (
    <div
      className="text-muted-foreground inline-flex w-full justify-between items-center"
      onClick={handleClick}
    >
      <div>
        {agent.slice(0, 5)}...{agent.slice(-5)}
      </div>
      <Link to="/agent-rules">
        <Button variant="ghost" className="w-12">
          <Cog />
        </Button>
      </Link>
    </div>
  );
}
