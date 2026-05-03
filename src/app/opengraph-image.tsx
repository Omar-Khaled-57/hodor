import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #00E8A2, #00C87A)',
          color: '#060B14',
          fontSize: 320,
          fontWeight: 900,
        }}
      >
        D
      </div>
    ),
    { ...size }
  );
}
