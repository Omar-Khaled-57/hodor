import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
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
          fontSize: 22,
          fontWeight: 900,
          borderRadius: '8px',
        }}
      >
        D
      </div>
    ),
    { ...size }
  );
}
