export function Logo({ className = "", width = 200, height = 100 }: { className?: string; width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="180" cy="140" rx="130" ry="100" fill="#EF4444" transform="rotate(-25 180 140)" />
      <ellipse cx="380" cy="120" rx="160" ry="130" fill="#F5A524" transform="rotate(-20 380 120)" />
      <text x="140" y="170" fontFamily="Arial, Helvetica, sans-serif" fontSize="48" fontWeight="900" fill="white" fontStyle="italic">THE</text>
      <text x="50" y="340" fontFamily="Arial, Helvetica, sans-serif" fontSize="140" fontWeight="900" fill="white" letterSpacing="-5">WANS</text>
    </svg>
  );
}
