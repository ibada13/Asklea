'use client';
interface Input {
  width?: string;
  text: string;
    color?: string;
    className?: string; 
}

export default function TextPlaceHolder({ width, text, color , className }: Input) {
  return (
    <div
      className={`rounded-md animate-pulse min-h-screen bg-white ${className}`}
      style={{ width}}
    >
          {text && <span className="" style={{color}}>{text}</span>}
    </div>
  );
}
