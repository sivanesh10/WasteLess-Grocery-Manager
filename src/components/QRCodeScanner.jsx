import { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

const QRCodeScanner = ({ onScan }) => {
  const [error, setError] = useState('');
  const [scanned, setScanned] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      {error && <p className="text-red-500">{error}</p>}
      {!scanned ? (
        <BarcodeScannerComponent
          width={300}
          height={300}
          onUpdate={(err, result) => {
            if (result && !scanned) {
              setScanned(true);
              onScan(result.text);
            } else if (err) {
              console.error(err);
              setError('Camera error or no QR code detected');
            }
          }}
          style={{ width: '100%' }}
        />
      ) : (
        <p className="text-green-600 font-semibold">QR Code Scanned!</p>
      )}
    </div>
  );
};

export default QRCodeScanner;
