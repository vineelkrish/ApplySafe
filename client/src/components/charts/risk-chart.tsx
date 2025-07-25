import { useEffect, useRef } from "react";

export default function RiskChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const canvas = chartRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const data = [35, 25, 20, 15, 5];
    const labels = ['Payment Scams', 'Identity Theft', 'MLM Schemes', 'Fake Companies', 'Other'];
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#8b5cf6', '#6b7280'];

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    let currentAngle = -Math.PI / 2;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw segments
    data.forEach((value, index) => {
      const sliceAngle = (value / 100) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = colors[index];
      ctx.fill();
      
      currentAngle += sliceAngle;
    });

    // Draw legend
    const legendY = rect.height - 100;
    const legendItemWidth = rect.width / labels.length;
    
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    labels.forEach((label, index) => {
      const x = (index + 0.5) * legendItemWidth;
      
      // Draw color box
      ctx.fillStyle = colors[index];
      ctx.fillRect(x - 6, legendY - 6, 12, 12);
      
      // Draw label
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(label, x, legendY + 20);
      ctx.fillText(`${data[index]}%`, x, legendY + 35);
    });
  }, []);

  return (
    <div className="h-[300px] w-full">
      <canvas 
        ref={chartRef} 
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
