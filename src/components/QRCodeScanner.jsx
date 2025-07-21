import { useState } from 'react';
import { QrReader } from 'react-qr-reader';


const QRCodeScanner = ({ onScan }) => {
  const [error, setError] = useState('');

  const handleScan = (data) => {
    if (data) onScan(data);
  };

  const handleError = (err) => {
    console.error(err);
    setError('Camera error');
  };

  return (
    <div>
      {showScanner && !scannedRef.current && (
  <QrReader
    constraints={{ facingMode: 'environment' }}
    onResult={(result, error) => {
      if (!!result?.text) handleQRScan(result.text);
    }}
    style={{ width: '100%' }}
  />
)}

    </div>
  );
};

export default QRCodeScanner;
