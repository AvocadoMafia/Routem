'use client';

import { FC } from 'react';

/**
 * FootprintsBackground コンポーネント
 * ウィンドウ上部中央（左寄り）から右端中央にかけて足跡が並ぶ背景を表示します。
 * z-index を低く設定し、MapViewer 等のコンテンツの下に配置されるようにします。
 */
const FootprintsBackground: FC = () => {
  // 足跡の座標と角度を定義 (相対位置 %)
  // 上部真ん中より少し左 (x: 40, y: 0) から 右端の真ん中 (x: 100, y: 50) に向けて配置
  const footprints = [
    { x: 42, y: 5, rotate: 30 },
    { x: 45, y: 12, rotate: 35 },
    { x: 48, y: 18, rotate: 30 },
    { x: 52, y: 24, rotate: 35 },
    { x: 57, y: 29, rotate: 40 },
    { x: 62, y: 33, rotate: 45 },
    { x: 68, y: 36, rotate: 40 },
    { x: 74, y: 39, rotate: 45 },
    { x: 80, y: 42, rotate: 50 },
    { x: 87, y: 45, rotate: 45 },
    { x: 94, y: 48, rotate: 50 },
  ];

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <div className="w-full h-full opacity-20 text-foreground-1">
        {footprints.map((fp, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${fp.x}%`,
              top: `${fp.y}%`,
              transform: `rotate(${fp.rotate}deg) scale(1.5)`,
            }}
          >
            <svg width="20" height="30" viewBox="-5 -5 10 15" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M-1.5,-2.5 C-2.5,-2.5 -3,-2 -3,-1 C-3,-0.5 -2.5,0 -1.5,0 C-0.5,0 0,-0.5 0,-1 C0,-2 -0.5,-2.5 -1.5,-2.5 Z M1.5,-2 C1,-2 0.5,-1.5 0.5,-1 C0.5,0 1,0.5 1.5,0.5 C2,0.5 2.5,0 2.5,-1 C2.5,-1.5 2,-2 1.5,-2 Z M-0.5,0.5 C-1,0.5 -1.5,1 -1.5,2 C-1.5,3 -1,3.5 -0.5,3.5 C0,3.5 0.5,3 0.5,2 C0.5,1 0,0.5 -0.5,0.5 Z M1,2.5 C0.5,2.5 0,3 0,4 C0,5 0.5,5.5 1,5.5 C1.5,5.5 2,5 2,4 C2,3 1.5,2.5 1,2.5 Z M-2,4 C-2.5,4 -3,4.5 -3,5.5 C-3,6.5 -2.5,7 -2,7 C-1.5,7 -1,6.5 -1,5.5 C-1,4.5 -1.5,4 -2,4 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FootprintsBackground;
