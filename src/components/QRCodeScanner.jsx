import { useState } from 'react';
import { QrReader } from '@blackbox-vision/react-qr-reader';

const QRCodeScanner = ({ onScan }) => {
  const [error, setError] = useState('');
  const [scanned, setScanned] = useState(false);

  const handleScan = (result) => {
    if (result?.text && !scanned) {
      setScanned(true);
      onScan(result.text);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Camera access error. Please check permissions.');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {error && <p className="text-red-500">{error}</p>}
      {!scanned ? (
        <QrReader
          constraints={{ facingMode: 'environment' }}
          onResult={(result, error) => {
            if (result) handleScan(result);
            if (error) handleError(error);
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
