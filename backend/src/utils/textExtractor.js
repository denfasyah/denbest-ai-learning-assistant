const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const extractTextFromFile = async (filePath, mimeType) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    // TXT
    if (ext === '.txt' || mimeType === 'text/plain') {
      return fs.readFileSync(filePath, 'utf-8');
    }
    
    // PDF
    if (ext === '.pdf' || mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text || '';
    }
    
    // DOCX
    if (ext === '.docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    }
    
    // DOC (legacy binary - extract printable characters as fallback)
    if (ext === '.doc' || mimeType === 'application/msword') {
      const buffer = fs.readFileSync(filePath);
      const rawString = buffer.toString('binary');
      const cleanString = rawString.replace(/[^\x20-\x7E\t\r\n]/g, '');
      return cleanString.trim().substring(0, 50000);
    }
    
    return '';
  } catch (error) {
    console.error('[textExtractor] Error extracting text:', error);
    return '';
  }
};

module.exports = {
  extractTextFromFile
};
