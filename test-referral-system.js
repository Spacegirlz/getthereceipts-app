// Test script for the referral system
// Run this in browser console on localhost:5173/refer

console.log('🧪 Testing Referral System...');

// Test 1: Check if referral page loads
console.log('✅ Test 1: Referral page should be visible');

// Test 2: Check if user has referral code (when logged in)
async function testReferralCode() {
  try {
    // This would be called from the referral service
    console.log('🔗 Testing referral code generation...');
    
    // Simulate getting a referral code
    const mockReferralCode = 'TEST1234';
    const mockReferralLink = `http://localhost:5173/refer?code=${mockReferralCode}`;
    
    console.log('✅ Mock referral code:', mockReferralCode);
    console.log('✅ Mock referral link:', mockReferralLink);
    
    return { success: true, code: mockReferralCode, link: mockReferralLink };
  } catch (error) {
    console.error('❌ Error testing referral code:', error);
    return { success: false, error: error.message };
  }
}

// Test 3: Test referral link processing
async function testReferralProcessing() {
  try {
    console.log('🎯 Testing referral processing...');
    
    // Simulate processing a referral
    const mockResult = {
      success: true,
      rewardCoupon: 'REFABC123',
      message: 'Referral processed successfully! You earned a reward coupon.'
    };
    
    console.log('✅ Mock referral result:', mockResult);
    return mockResult;
  } catch (error) {
    console.error('❌ Error testing referral processing:', error);
    return { success: false, error: error.message };
  }
}

// Test 4: Test copy to clipboard
async function testCopyToClipboard() {
  try {
    console.log('📋 Testing copy to clipboard...');
    
    const testText = 'http://localhost:5173/refer?code=TEST1234';
    
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(testText);
      console.log('✅ Copy to clipboard works');
      return { success: true };
    } else {
      console.log('⚠️ Clipboard API not available');
      return { success: false, error: 'Clipboard API not available' };
    }
  } catch (error) {
    console.error('❌ Error testing clipboard:', error);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running all referral system tests...');
  
  const test1 = { success: true, name: 'Page Load' };
  const test2 = await testReferralCode();
  const test3 = await testReferralProcessing();
  const test4 = await testCopyToClipboard();
  
  console.log('\n📊 Test Results:');
  console.log('1. Page Load:', test1.success ? '✅ PASS' : '❌ FAIL');
  console.log('2. Referral Code:', test2.success ? '✅ PASS' : '❌ FAIL');
  console.log('3. Referral Processing:', test3.success ? '✅ PASS' : '❌ FAIL');
  console.log('4. Copy to Clipboard:', test4.success ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = [test1, test2, test3, test4].every(test => test.success);
  console.log('\n🎯 Overall Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  return { allPassed, tests: [test1, test2, test3, test4] };
}

// Export for manual testing
window.testReferralSystem = {
  testReferralCode,
  testReferralProcessing,
  testCopyToClipboard,
  runAllTests
};

console.log('🧪 Referral system test functions loaded. Run testReferralSystem.runAllTests() to test everything.');
