// Enhanced Voice Service for Sage - GetTheReceipts
// Provides realistic AI voice with fallback to browser TTS

class VoiceService {
  constructor() {
    this.isPlaying = false;
    this.currentAudio = null;
    this.speechRef = null;
  }

  // ElevenLabs AI Voice Generation
  async generateElevenLabsAudio(text, voiceId = 'EXAVITQu4vr4xnSDxMaL') {
    // Sage's voice ID - this is Sarah (British, warm, conversational)
    // Alternative voices:
    // - 'TxGEqnHWrfWFTfGW9XjX' (Josh - American, warm)  
    // - 'pNInz6obpgDQGcFmaJgB' (Adam - American, deep)
    // - 'EXAVITQu4vr4xnSDxMaL' (Sarah - British, conversational) - SAGE DEFAULT
    
    const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
    
    if (!ELEVENLABS_API_KEY) {
      console.log('ElevenLabs API key not found, falling back to browser TTS');
      return null;
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.75,    // Stable but not robotic  
            similarity_boost: 0.8, // Keep Sage's personality
            style: 0.2,         // Slight style variation for naturalness
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('ElevenLabs TTS failed:', error);
      return null;
    }
  }

  // OpenAI TTS (Premium natural conversational voices)
  async generateOpenAIAudio(text, voice = 'nova') {
    // OpenAI voices: alloy, echo, fable, onyx, nova, shimmer
    // 'nova' - warm, engaging, perfect for Sage's bestie personality
    // 'alloy' - neutral, balanced (backup option)
    // 'shimmer' - gentle, warm (alternative for Sage)
    
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      console.log('OpenAI API key not found');
      return null;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voice,
          speed: 0.95 // Slightly slower for emphasis
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI TTS API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('OpenAI TTS failed:', error);
      return null;
    }
  }

  // Browser TTS Fallback (Current Implementation)
  speakWithBrowserTTS(text, onStart, onEnd, onError) {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Enhanced settings for Sage's personality
      utterance.rate = 0.9;   // Slightly slower for sass
      utterance.pitch = 1.1;  // Slightly higher for feminine voice
      utterance.volume = 0.8; // Intimate volume
      
      // Try to find the best available voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = this.findBestVoice(voices);
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = onStart;
      utterance.onend = onEnd;
      utterance.onerror = onError;

      this.speechRef = utterance;
      speechSynthesis.speak(utterance);
    } else {
      onError(new Error('Speech synthesis not supported'));
    }
  }

  // Find best available browser voice
  findBestVoice(voices) {
    // Priority order for Sage's personality
    const voicePreferences = [
      // Premium English voices
      'Samantha', 'Alex', 'Victoria', 'Karen', 'Moira',
      // Standard female voices  
      'female', 'woman', 'Google UK English Female', 
      'Microsoft Zira', 'Microsoft Hazel'
    ];

    for (const preference of voicePreferences) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(preference.toLowerCase()) ||
        (v.gender === 'female' && v.lang.startsWith('en'))
      );
      if (voice) return voice;
    }

    // Fallback to any English voice
    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  }

  // Main speak method with intelligent fallback
  async speak(text, options = {}) {
    const {
      onStart = () => {},
      onEnd = () => {},
      onError = () => {},
      preferredProvider = 'openai' // 'openai', 'elevenlabs', 'browser'
    } = options;

    // Stop any current playback
    this.stop();

    this.isPlaying = true;
    onStart();

    let audioUrl = null;

    // Try premium TTS first
    if (preferredProvider === 'openai') {
      audioUrl = await this.generateOpenAIAudio(text);
    } else if (preferredProvider === 'elevenlabs') {
      audioUrl = await this.generateElevenLabsAudio(text);
    }

    // If premium TTS worked, play the audio
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;
        
        audio.onplay = onStart;
        audio.onended = () => {
          this.isPlaying = false;
          this.currentAudio = null;
          URL.revokeObjectURL(audioUrl);
          onEnd();
        };
        audio.onerror = (error) => {
          this.isPlaying = false;
          this.currentAudio = null;
          URL.revokeObjectURL(audioUrl);
          console.error('Audio playback failed, falling back to browser TTS');
          // Fallback to browser TTS
          this.speakWithBrowserTTS(text, onStart, onEnd, onError);
        };
        
        await audio.play();
      } catch (error) {
        console.error('Premium TTS playback failed:', error);
        // Fallback to browser TTS
        this.speakWithBrowserTTS(text, onStart, onEnd, onError);
      }
    } else {
      // Use browser TTS as fallback
      this.speakWithBrowserTTS(text, onStart, onEnd, onError);
    }
  }

  // Stop any current speech
  stop() {
    this.isPlaying = false;
    
    // Stop premium audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    // Stop browser TTS
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    
    this.speechRef = null;
  }

  // Get playing status
  getIsPlaying() {
    return this.isPlaying;
  }
}

// Create singleton instance
export const voiceService = new VoiceService();
export default voiceService;