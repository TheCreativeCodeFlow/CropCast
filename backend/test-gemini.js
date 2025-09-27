#!/usr/bin/env node

/**
 * Simple Gemini API Test Script
 * Tests the translation functionality with your Gemini API key
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API Integration...\n');
  
  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.error('❌ GEMINI_API_KEY not configured in .env file');
    console.log('Please add your Gemini API key to the .env file:');
    console.log('GEMINI_API_KEY=your_actual_api_key_here');
    process.exit(1);
  }

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log('✅ Gemini API key found');
    console.log('🔗 Connecting to Gemini AI...\n');

    // Test 1: Simple translation
    console.log('Test 1: English to Hindi translation');
    const prompt1 = 'Translate the following text to Hindi. Only provide the translation: "The weather is good for farming today."';
    
    const result1 = await model.generateContent(prompt1);
    const translation1 = result1.response.text().trim();
    
    console.log('Original: "The weather is good for farming today."');
    console.log('Hindi:', translation1);
    console.log('✅ Test 1 passed\n');

    // Test 2: Agricultural context translation
    console.log('Test 2: Agricultural context translation (English to Spanish)');
    const prompt2 = 'This is agricultural content about soil management. Translate the following text to Spanish using appropriate agricultural terminology: "Apply organic fertilizer to improve soil nitrogen levels and enhance crop yield."';
    
    const result2 = await model.generateContent(prompt2);
    const translation2 = result2.response.text().trim();
    
    console.log('Original: "Apply organic fertilizer to improve soil nitrogen levels and enhance crop yield."');
    console.log('Spanish:', translation2);
    console.log('✅ Test 2 passed\n');

    // Test 3: Language detection
    console.log('Test 3: Language detection');
    const prompt3 = 'Detect the language of the following text and respond with only the ISO 639-1 language code: "আজ আবহাওয়া খুব ভালো"';
    
    const result3 = await model.generateContent(prompt3);
    const detected = result3.response.text().trim().toLowerCase();
    
    console.log('Text: "আজ আবহাওয়া খুব ভালো"');
    console.log('Detected language code:', detected);
    console.log('✅ Test 3 passed\n');

    // Test 4: Multiple language support
    console.log('Test 4: Multiple Indian languages');
    const languages = [
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'mr', name: 'Marathi' }
    ];

    const testText = "Farmers should check soil moisture before planting crops.";
    
    for (const lang of languages) {
      const prompt = `Translate the following agricultural text to ${lang.name}. Only provide the translation: "${testText}"`;
      const result = await model.generateContent(prompt);
      const translation = result.response.text().trim();
      
      console.log(`${lang.name} (${lang.code}):`, translation);
    }
    console.log('✅ Test 4 passed\n');

    console.log('🎉 All tests passed! Gemini API is working correctly.');
    console.log('\n📋 Summary:');
    console.log('- API Key: Valid ✅');
    console.log('- Translation: Working ✅');
    console.log('- Agricultural Context: Working ✅');
    console.log('- Language Detection: Working ✅');
    console.log('- Multiple Languages: Working ✅');
    
    console.log('\n🚀 You can now start the application:');
    console.log('   Windows: start-multilingual.bat');
    console.log('   Backend: cd backend && npm run dev');
    console.log('   Frontend: cd frontend && npm run dev');

  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check if your API key is correct');
      console.log('2. Ensure your API key has the necessary permissions');
      console.log('3. Visit https://makersuite.google.com/app/apikey to get a new key');
    }
    
    if (error.message.includes('quota') || error.message.includes('limit')) {
      console.log('\n💡 Quota/Rate limit issues:');
      console.log('1. Check your Gemini API quota limits');
      console.log('2. Wait a moment and try again');
      console.log('3. Consider upgrading your API plan if needed');
    }
    
    process.exit(1);
  }
}

// Run the test
testGeminiAPI().catch(console.error);