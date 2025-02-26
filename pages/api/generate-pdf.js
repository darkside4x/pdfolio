// pages/api/generate-pdf.js
import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Content is required to generate PDF' });
  }

  try {
    // Create a new PDF document
    const doc = new PDFDocument({
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      },
      info: {
        Title: 'PDFolio Generated Document',
        Author: 'PDFolio App',
        Subject: 'AI Generated Content',
        Keywords: 'pdf, ai, content',
        Creator: 'PDFolio using PDFKit',
        Producer: 'PDFolio'
      }
    });

    // Generate a unique filename
    const filename = `${uuidv4()}.pdf`;
    // Path where we'll save the PDF temporarily
    const outputDir = path.join(process.cwd(), 'public', 'pdfs');
    const filePath = path.join(outputDir, filename);

    // Ensure the directory exists
    fs.mkdirSync(outputDir, { recursive: true });

    // Pipe the PDF into a file
    const stream = fs.createWriteStream(filePath);
    
    // Set up event listeners first
    const streamPromise = new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(true));
      stream.on('error', reject);
    });
    
    doc.pipe(stream);

    // Add a styled header
    doc.fontSize(24)
       .fillColor('#2563eb')
       .text('PDFolio Document', {
         align: 'center'
       });
    
    doc.moveDown();
    
    // Add a horizontal line
    doc.moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .strokeColor('#94a3b8')
       .stroke();
    
    doc.moveDown();

    // Add the main content
    doc.fontSize(12)
       .fillColor('#1e293b')
       .text(content, {
         width: doc.page.width - 100,
         align: 'left'
       });
       
    // Add a footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      
      // Save position for the main content area
      const originalY = doc.y;
      
      // Move to the bottom of the page
      doc.fontSize(10)
         .fillColor('#64748b')
         .text(
           `Generated by PDFolio • Page ${i + 1} of ${pageCount}`, 
           50, 
           doc.page.height - 50, 
           { 
             width: doc.page.width - 100, 
             align: 'center' 
           }
         );
      
      // Add a timestamp
      doc.text(
        `Generated on ${new Date().toLocaleString()}`,
        50,
        doc.page.height - 35,
        {
          width: doc.page.width - 100,
          align: 'center'
        }
      );
      
      // Restore position
      doc.y = originalY;
    }

    // Finalize the PDF file
    doc.end();

    // Wait for the file writing to complete
    await streamPromise;
    
    // Return the file URL
    const pdfUrl = `/pdfs/${filename}`;
    return res.status(200).json({ pdfUrl });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    return res.status(500).json({ message: 'Error generating PDF', details: error.message });
  }
}