const express = require('express');
const router = express.Router();
const { getPages, getPageBySlug, addPage, updatePage, deletePage } = require('../controllers/pageController');

router.get('/', getPages);
router.get('/:slug', getPageBySlug);
router.post('/', addPage);
router.put('/:id', updatePage);
router.delete('/:id', deletePage);

module.exports = router;