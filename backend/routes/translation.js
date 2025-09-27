const express = require('express');
const translationService = require('../services/translationService');
const auth = require('../middleware/auth');
const { body, validationResult, param } = require('express-validator');
const router = express.Router();

// Validation middleware for translation requests
const validateTranslationRequest = [
  body('text')
    .notEmpty()
    .withMessage('Text is required')
    .isLength({ max: 5000 })
    .withMessage('Text must be less than 5000 characters'),
  body('targetLanguage')
    .notEmpty()
    .withMessage('Target language is required')
    .isLength({ min: 2, max: 3 })
    .withMessage('Target language must be a valid language code'),
  body('sourceLanguage')
    .optional()
    .isLength({ min: 2, max: 3 })
    .withMessage('Source language must be a valid language code')
];

const validateBatchTranslationRequest = [
  body('texts')
    .isArray({ min: 1, max: 20 })
    .withMessage('Texts must be an array with 1-20 items'),
  body('texts.*')
    .notEmpty()
    .withMessage('Each text item is required')
    .isLength({ max: 2000 })
    .withMessage('Each text must be less than 2000 characters'),
  body('targetLanguage')
    .notEmpty()
    .withMessage('Target language is required')
    .isLength({ min: 2, max: 3 })
    .withMessage('Target language must be a valid language code'),
  body('sourceLanguage')
    .optional()
    .isLength({ min: 2, max: 3 })
    .withMessage('Source language must be a valid language code')
];

const validateAgriculturalTranslationRequest = [
  ...validateTranslationRequest,
  body('context')
    .optional()
    .isIn(['weather', 'market', 'pest', 'soil', 'yield', 'general'])
    .withMessage('Context must be one of: weather, market, pest, soil, yield, general')
];

// Get all supported languages
router.get('/languages', (req, res) => {
  try {
    const languages = translationService.getSupportedLanguages();
    const languageCodes = translationService.getSupportedLanguageCodes();

    res.json({
      success: true,
      data: {
        languages,
        languageCodes,
        total: languageCodes.length
      }
    });
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get supported languages',
      error: error.message
    });
  }
});

// Translate text (made public for easier testing, add auth back if needed)
router.post('/translate', validateTranslationRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { text, targetLanguage, sourceLanguage } = req.body;

    const result = await translationService.translateText(text, targetLanguage, sourceLanguage);

    res.json({
      success: true,
      message: 'Translation completed successfully',
      data: result
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      success: false,
      message: 'Translation failed',
      error: error.message
    });
  }
});

// Detect language (made public for easier testing)
router.post('/detect', [
  body('text')
    .notEmpty()
    .withMessage('Text is required')
    .isLength({ max: 1000 })
    .withMessage('Text must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { text } = req.body;

    const result = await translationService.detectLanguage(text);

    res.json({
      success: true,
      message: 'Language detection completed successfully',
      data: result
    });

  } catch (error) {
    console.error('Language detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Language detection failed',
      error: error.message
    });
  }
});

// Translate agricultural content with context (made public for easier testing)
router.post('/translate/agricultural', validateAgriculturalTranslationRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { text, targetLanguage, context = 'general' } = req.body;

    const result = await translationService.translateAgriculturalContent(text, targetLanguage, context);

    res.json({
      success: true,
      message: 'Agricultural translation completed successfully',
      data: result
    });

  } catch (error) {
    console.error('Agricultural translation error:', error);
    res.status(500).json({
      success: false,
      message: 'Agricultural translation failed',
      error: error.message
    });
  }
});

// Batch translate multiple texts
router.post('/translate/batch', auth, validateBatchTranslationRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { texts, targetLanguage, sourceLanguage } = req.body;

    const result = await translationService.batchTranslate(texts, targetLanguage, sourceLanguage);

    res.json({
      success: true,
      message: 'Batch translation completed successfully',
      data: result
    });

  } catch (error) {
    console.error('Batch translation error:', error);
    res.status(500).json({
      success: false,
      message: 'Batch translation failed',
      error: error.message
    });
  }
});

// Get translation history for user (if we want to implement this feature)
router.get('/history', auth, async (req, res) => {
  try {
    // This would require a Translation model to store history
    // For now, return a placeholder response
    res.json({
      success: true,
      message: 'Translation history feature coming soon',
      data: {
        translations: [],
        total: 0
      }
    });

  } catch (error) {
    console.error('Translation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get translation history',
      error: error.message
    });
  }
});

module.exports = router;