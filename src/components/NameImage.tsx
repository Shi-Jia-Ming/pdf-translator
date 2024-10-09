import { useRef, useEffect } from 'react';

function NameImage({ name, size = 100, color = '#3f51b5' }: { name: string, size?: number, color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');

    // 获取设备像素比
    const dpr = window.devicePixelRatio || 1;

    // 设置实际分辨率
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    // 设置CSS样式大小
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    if (!context) {
      return;
    }
    // 背景颜色
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 文字颜色
    context.fillStyle = '#FFFFFF';
    context.font = `bold ${Math.floor(size * 0.6 * dpr)}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // 获取名字的第一个字母
    const firstLetter = name.charAt(0).toUpperCase();

    // 在画布上绘制文本
    context.fillText(firstLetter, canvas.width / 2, canvas.height / 2);
  }, [name, size]);

  return (
    <canvas ref={canvasRef} className={"rounded"}></canvas>
  );
}

export default NameImage;