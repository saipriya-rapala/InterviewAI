package InterviewAI.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.openxml4j.util.ZipSecureFile;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Component;

@Component
public class ResumeTextExtractor {

    private static final int MAX_PDF_PAGES = 100;
    private static final int MAX_EXTRACTED_CHARACTERS = 100_000;
    private static final long MAX_DOCX_ENTRY_BYTES = 10_000_000L;

    public String extractPdf(byte[] content) throws IOException {
        try (PDDocument document = Loader.loadPDF(content)) {
            if (document.getNumberOfPages() > MAX_PDF_PAGES) {
                throw new IllegalArgumentException("PDF exceeds the 100-page processing limit.");
            }
            String text = new PDFTextStripper().getText(document);
            return limitText(text);
        }
    }

    public String extractDocx(byte[] content) throws IOException {
        validateDocxArchive(content);
        ZipSecureFile.setMinInflateRatio(0.01);
        ZipSecureFile.setMaxEntrySize(MAX_DOCX_ENTRY_BYTES);

        try (XWPFDocument document = new XWPFDocument(new ByteArrayInputStream(content));
                XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return limitText(extractor.getText());
        }
    }

    private void validateDocxArchive(byte[] content) throws IOException {
        boolean hasDocument = false;
        boolean hasContentTypes = false;
        int entryCount = 0;
        long totalExpandedBytes = 0;

        try (ZipInputStream stream = new ZipInputStream(new ByteArrayInputStream(content))) {
            ZipEntry entry;
            byte[] buffer = new byte[8192];
            while ((entry = stream.getNextEntry()) != null) {
                if (++entryCount > 500) {
                    throw new IllegalArgumentException("DOCX archive contains too many entries.");
                }
                hasDocument |= entry.getName().equals("word/document.xml");
                hasContentTypes |= entry.getName().equals("[Content_Types].xml");
                int bytesRead;
                long entryBytes = 0;
                while ((bytesRead = stream.read(buffer)) != -1) {
                    entryBytes += bytesRead;
                    totalExpandedBytes += bytesRead;
                    if (entryBytes > MAX_DOCX_ENTRY_BYTES
                            || totalExpandedBytes > MAX_DOCX_ENTRY_BYTES) {
                        throw new IllegalArgumentException("DOCX archive expands beyond the processing limit.");
                    }
                }
                stream.closeEntry();
            }
        }

        if (!hasDocument || !hasContentTypes) {
            throw new IllegalArgumentException("The uploaded ZIP file is not a valid DOCX document.");
        }
    }

    private String limitText(String text) {
        if (text == null) {
            return "";
        }
        return text.length() <= MAX_EXTRACTED_CHARACTERS
                ? text
                : text.substring(0, MAX_EXTRACTED_CHARACTERS);
    }
}