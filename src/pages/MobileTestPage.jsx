import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Smartphone, Monitor, Bug, RotateCcw } from 'lucide-react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { resetTestCredits } from '@/lib/services/creditsSystem';

const MobileTestPage = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);
  const [userAgent, setUserAgent] = useState(navigator.userAgent);
  const [isMobile, setIsMobile] = useState(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  const testElementRef = useRef(null);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev, { message, type, timestamp }]);
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  const testWebShareAPI = () => {
    addLog('Testing Web Share API availability...', 'info');
    
    if (navigator.share) {
      addLog('✅ Web Share API is available', 'success');
      
      // Test if files can be shared
      const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      if (navigator.canShare && navigator.canShare({ files: [testFile] })) {
        addLog('✅ File sharing is supported', 'success');
      } else {
        addLog('❌ File sharing is not supported', 'warning');
      }
    } else {
      addLog('❌ Web Share API is not available', 'error');
    }
  };

  const testCanvasGeneration = async () => {
    addLog('Testing canvas generation...', 'info');
    setIsSharing(true);
    
    try {
      const element = testElementRef.current;
      if (!element) {
        addLog('❌ Test element not found', 'error');
        return;
      }

      addLog(`Element dimensions: ${element.offsetWidth}x${element.offsetHeight}`, 'info');
      
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'transparent',
        scale: 2,
        width: element.offsetWidth,
        height: element.offsetHeight
      });
      
      addLog(`Canvas generated: ${canvas.width}x${canvas.height}`, 'success');
      
      // Test blob creation
      canvas.toBlob((blob) => {
        if (blob) {
          addLog(`Blob created: ${blob.size} bytes, type: ${blob.type}`, 'success');
        } else {
          addLog('❌ Failed to create blob', 'error');
        }
        setIsSharing(false);
      });
      
    } catch (error) {
      addLog(`❌ Canvas generation failed: ${error.message}`, 'error');
      setIsSharing(false);
    }
  };

  const testFileDownload = async () => {
    addLog('Testing file download...', 'info');
    
    try {
      const element = testElementRef.current;
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'transparent',
        scale: 2
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          const timestamp = Date.now();
          saveAs(blob, `mobile-test-${timestamp}.png`);
          addLog('✅ File download initiated', 'success');
        } else {
          addLog('❌ Failed to create blob for download', 'error');
        }
      });
      
    } catch (error) {
      addLog(`❌ Download test failed: ${error.message}`, 'error');
    }
  };

  const testWebShare = async () => {
    addLog('Testing Web Share API for saving to photos...', 'info');
    
    if (!navigator.share) {
      addLog('❌ Web Share API not available', 'error');
      return;
    }

    try {
      const element = testElementRef.current;
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'transparent',
        scale: 2
      });
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'Sage Truth Receipt.png', { type: 'image/png' });
          
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file]
              });
              addLog('✅ Web Share successful - Image saved to photos!', 'success');
            } catch (shareError) {
              if (shareError.name === 'AbortError') {
                addLog('⚠️ Share was cancelled by user', 'warning');
              } else {
                addLog(`❌ Share failed: ${shareError.message}`, 'error');
              }
            }
          } else {
            addLog('❌ Cannot share files with this device', 'error');
          }
        } else {
          addLog('❌ Failed to create blob for sharing', 'error');
        }
      });
      
    } catch (error) {
      addLog(`❌ Web Share test failed: ${error.message}`, 'error');
    }
  };

  const testMobileSaveToPhotos = async () => {
    addLog('Testing mobile save to photos functionality...', 'info');
    
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    addLog(`Device detected as mobile: ${isMobile}`, 'info');
    
    if (!isMobile) {
      addLog('⚠️ This test is designed for mobile devices', 'warning');
    }

    try {
      const element = testElementRef.current;
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'transparent',
        scale: 2
      });
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          addLog(`Blob created: ${blob.size} bytes`, 'success');
          
          if (isMobile && navigator.share && navigator.canShare) {
            const file = new File([blob], 'Sage Truth Receipt.png', { type: 'image/png' });
            
            if (navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  files: [file]
                });
                addLog('✅ Mobile save to photos successful!', 'success');
              } catch (shareError) {
                if (shareError.name === 'AbortError') {
                  addLog('⚠️ Save was cancelled by user', 'warning');
                } else {
                  addLog(`❌ Mobile save failed: ${shareError.message}`, 'error');
                }
              }
            } else {
              addLog('❌ Device cannot share files', 'error');
            }
          } else {
            addLog('❌ Mobile Web Share API not available', 'error');
          }
        } else {
          addLog('❌ Failed to create blob', 'error');
        }
      });
      
    } catch (error) {
      addLog(`❌ Mobile save test failed: ${error.message}`, 'error');
    }
  };

  const runAllTests = () => {
    setDebugLogs([]);
    addLog('🚀 Starting comprehensive mobile save/share tests...', 'info');
    
    setTimeout(() => testWebShareAPI(), 100);
    setTimeout(() => testCanvasGeneration(), 500);
    setTimeout(() => testFileDownload(), 1000);
    setTimeout(() => testWebShare(), 1500);
  };

  const clearLogs = () => {
    setDebugLogs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Bug className="w-10 h-10 text-teal-400" />
            Mobile Save/Share Debug
          </h1>
          <p className="text-gray-300">Test mobile save/share functionality locally</p>
        </div>

        {/* Device Info */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            {isMobile ? <Smartphone className="w-6 h-6 text-green-400" /> : <Monitor className="w-6 h-6 text-blue-400" />}
            Device Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Device Type:</span>
              <span className={`ml-2 font-medium ${isMobile ? 'text-green-400' : 'text-blue-400'}`}>
                {isMobile ? 'Mobile' : 'Desktop'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Web Share API:</span>
              <span className={`ml-2 font-medium ${navigator.share ? 'text-green-400' : 'text-red-400'}`}>
                {navigator.share ? 'Available' : 'Not Available'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400">User Agent:</span>
              <div className="mt-1 p-2 bg-black/20 rounded text-xs font-mono text-gray-300 break-all">
                {userAgent}
              </div>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Test Controls</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={testWebShareAPI}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test Web Share API
            </button>
            <button
              onClick={testCanvasGeneration}
              disabled={isSharing}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test Canvas
            </button>
            <button
              onClick={testFileDownload}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test Download
            </button>
            <button
              onClick={testWebShare}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test Share
            </button>
            <button
              onClick={testMobileSaveToPhotos}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test Save to Photos
            </button>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={runAllTests}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Bug className="w-4 h-4" />
              Run All Tests
            </button>
            <button
              onClick={clearLogs}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear Logs
            </button>
          </div>
        </div>

        {/* Test Element */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Test Element</h2>
          <div
            ref={testElementRef}
            className="bg-gradient-to-br from-teal-600 to-purple-600 p-6 rounded-xl text-white"
          >
            <h3 className="text-2xl font-bold mb-2">Sample Receipt</h3>
            <p className="text-lg mb-4">This is a test element for mobile save/share functionality.</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/20 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm">Into You</div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold">15%</div>
                <div className="text-sm">Wasting Time</div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold">3/10</div>
                <div className="text-sm">Red Flags</div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Logs */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Debug Logs</h2>
          <div className="bg-black/30 rounded-lg p-4 max-h-96 overflow-y-auto">
            {debugLogs.length === 0 ? (
              <p className="text-gray-400 italic">No logs yet. Run some tests to see results.</p>
            ) : (
              <div className="space-y-2">
                {debugLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <span className="text-gray-500 text-xs mt-1 min-w-[60px]">{log.timestamp}</span>
                    <span className={`font-medium min-w-[60px] ${
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'warning' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>
                      [{log.type.toUpperCase()}]
                    </span>
                    <span className="text-gray-200 flex-1">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileTestPage;
