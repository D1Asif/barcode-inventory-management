import React, { useEffect, useRef, useState } from 'react';

const BarcodeScanner = () => {
  const scannerRef = useRef(null);
  const [scannedCode, setScannedCode] = useState(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [quaggaInitialized, setQuaggaInitialized] = useState(false);

  // Safe Quagga cleanup function
  const safeQuaggaStop = () => {
    try {
      if (window.Quagga && quaggaInitialized) {
        window.Quagga.stop();
        setQuaggaInitialized(false);
      }
    } catch (error) {
      console.warn('Error stopping Quagga:', error);
    }
  };

  // Safe Quagga event removal
  const safeQuaggaOffDetected = () => {
    try {
      if (window.Quagga && quaggaInitialized) {
        window.Quagga.offDetected(handleDetected);
      }
    } catch (error) {
      console.warn('Error removing Quagga event listener:', error);
    }
  };

  useEffect(() => {
    if (isScanning && !scannedCode) {
      // Check if Quagga is available
      if (!window.Quagga) {
        setError('Barcode scanner library not loaded. Please refresh the page.');
        setIsScanning(false);
        return;
      }

      // Initialize Quagga when scanning starts
      try {
        window.Quagga.init({
          inputStream: {
            type: 'LiveStream',
            target: scannerRef.current,
            constraints: {
              facingMode: 'environment',
              width: { min: 640 },
              height: { min: 480 },
            },
          },
          decoder: {
            readers: [
              'code_128_reader',
              'ean_reader',
              'ean_8_reader',
              'upc_reader',
              'upc_e_reader'
            ],
          },
          locate: true,
        }, (err) => {
          if (err) {
            console.error('Quagga init failed:', err);
            setError('Failed to initialize camera. Please try manual input.');
            setIsScanning(false);
            return;
          }
          
          try {
            window.Quagga.start();
            setQuaggaInitialized(true);
            window.Quagga.onDetected(handleDetected);
          } catch (startError) {
            console.error('Quagga start failed:', startError);
            setError('Failed to start camera. Please try manual input.');
            setIsScanning(false);
          }
        });
      } catch (initError) {
        console.error('Quagga initialization error:', initError);
        setError('Failed to initialize barcode scanner. Please try manual input.');
        setIsScanning(false);
      }
    }

    return () => {
      safeQuaggaOffDetected();
      safeQuaggaStop();
    };
  }, [isScanning, scannedCode]);

  const handleDetected = (result) => {
    if (result.codeResult && result.codeResult.code) {
      const code = result.codeResult.code;
      setScannedCode(code);
      setIsScanning(false);
      safeQuaggaStop();
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      setScannedCode(manualBarcode.trim());
      setShowManualInput(false);
      setManualBarcode('');
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setScannedCode(null);
    setError('');
    setShowManualInput(false);
  };

  const handleRescan = () => {
    setScannedCode(null);
    setError('');
    setIsScanning(true);
  };

  const handleCancel = () => {
    setIsScanning(false);
    setScannedCode(null);
    setError('');
    setShowManualInput(false);
    safeQuaggaStop();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          📱 Barcode Scanner
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!isScanning && !scannedCode && !showManualInput && (
          <div className="text-center">
            <div className="bg-blue-50 p-8 rounded-lg border-2 border-dashed border-blue-200 mb-6">
              <div className="text-4xl mb-4">📷</div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Ready to Scan
              </h3>
              <p className="text-blue-700 mb-4">
                Choose how you'd like to scan a barcode
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleStartScan}
                  className="btn-primary"
                >
                  📱 Scan Barcode
                </button>
                <button
                  onClick={() => setShowManualInput(true)}
                  className="btn-secondary"
                >
                  ⌨️ Manual Input
                </button>
              </div>
            </div>
          </div>
        )}

        {showManualInput && (
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Manual Barcode Input
              </h3>
              <p className="text-yellow-700">
                Enter the barcode number manually
              </p>
            </div>
            
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label htmlFor="manualBarcode" className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode Number
                </label>
                <input
                  id="manualBarcode"
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="Enter barcode number"
                  className="input-field"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!manualBarcode.trim()}
                  className="btn-primary flex-1"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualInput(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isScanning && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg overflow-hidden relative">
              <div
                ref={scannerRef}
                className="w-full h-64"
              />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-white rounded-lg"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Point your camera at a barcode
              </p>
              <button
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel Scanning
              </button>
            </div>
          </div>
        )}

        {scannedCode && (
          <div className="space-y-4">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Barcode Scanned Successfully!
              </h3>
              <p className="text-green-700 font-mono text-2xl font-bold">
                {scannedCode}
              </p>
              <p className="text-green-600 text-sm mt-2">
                Barcode type: {scannedCode.length === 13 ? 'EAN-13' : 
                               scannedCode.length === 8 ? 'EAN-8' : 
                               scannedCode.length === 12 ? 'UPC' : 'Unknown'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRescan}
                className="btn-primary flex-1"
              >
                📱 Scan Another
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex-1"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner; 