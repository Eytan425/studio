import { FileCode, Wrench } from 'lucide-react';

export function CodeRemedyLogo({ size = 32, className }: { size?: number, className?: string }) {
  return (
    <div className={`flex items-center space-x-2 text-primary ${className}`}>
      <Wrench size={size} strokeWidth={2.5} />
      <FileCode size={size} strokeWidth={2.5} />
      <span 
        className="font-semibold ml-1 tracking-tight"
        style={{ fontSize: `${size * 0.75}px` }}
      >
        Code Remedy
      </span>
    </div>
  );
}
