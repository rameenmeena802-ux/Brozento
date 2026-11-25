const Page = require('../models/Page');

// Saare pages get karein
exports.getPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Single page get karein (slug se)
exports.getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Naya page add karein
exports.addPage = async (req, res) => {
  try {
    const { title, slug, content } = req.body;
    const existing = await Page.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Page with this URL already exists' });
    }
    const page = new Page({ title, slug, content });
    await page.save();
    res.status(201).json(page);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Page update karein
exports.updatePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Page delete karein
exports.deletePage = async (req, res) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ message: 'Page deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};