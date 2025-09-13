import React, { useState, useEffect } from 'react';
import { Copy, Download, ExternalLink, Check } from 'lucide-react';
import { generateQRCode } from '../utils/qrCode';
import LoadingSpinner from './LoadingSpinner';

interface QRCodeDisplayProps {
  formId: string;
  formTitle: string;
  formUrl: string;
}

export default function QRCodeDisplay({ formId, formTitle, formUrl }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateQRCode(formUrl)
      .then(setQrCodeUrl)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [formUrl]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${formTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openForm = () => {
    window.open(formUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{formTitle}</h2>
        <p className="text-gray-600 mb-8">Share this QR code for anonymous responses</p>
        
        <div className="inline-block p-6 bg-white rounded-2xl shadow-lg mb-8">
          <img
            src={qrCodeUrl}
            alt="QR Code for form"
            className="w-64 h-64 mx-auto"
          />
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-2">Form URL:</p>
            <p className="text-sm font-mono text-gray-900 break-all">{formUrl}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
              {copied ? 'Copied!' : 'Copy URL'}
            </button>

            <button
              onClick={downloadQRCode}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all duration-200 font-medium"
            >
              <Download size={20} />
              Download QR
            </button>

            <button
              onClick={openForm}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all duration-200 font-medium"
            >
              <ExternalLink size={20} />
              Preview Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}