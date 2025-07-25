import { useEffect, useRef } from "react";

export default function DetectionChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Simple line chart implementation without external dependencies
    const canvas = chartRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const data = [45, 52, 38, 67, 73, 41, 59];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set styles
    ctx.strokeStyle = '#f97316';
    ctx.fillStyle = 'rgba(249, 115, 22, 0.1)';
    ctx.lineWidth = 2;

    // Calculate points
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    const stepX = (width - 2 * padding) / (data.length - 1);
    const stepY = (height - 2 * padding) / range;

    const points = data.map((value, index) => ({
      x: padding + index * stepX,
      y: height - padding - (value - minValue) * stepY,
    }));

    // Draw filled area
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#f97316';
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    labels.forEach((label, index) => {
      ctx.fillText(label, padding + index * stepX, height - 10);
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
