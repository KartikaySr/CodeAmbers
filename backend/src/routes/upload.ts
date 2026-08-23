import { Router } from 'express';
import multer from 'multer';
import * as pdfParseModule from 'pdf-parse';
const pdfParse = (pdfParseModule as any).default || pdfParseModule;

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    // Parse the PDF from memory buffer
    const data = await pdfParse(req.file.buffer);

    // Return the extracted text
    return res.json({ text: data.text, numpages: data.numpages });
  } catch (error) {
    console.error('PDF parsing error:', error);
    return res.status(500).json({ error: 'Failed to parse PDF' });
  }
});

export default router;
