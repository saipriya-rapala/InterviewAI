package InterviewAI;

import InterviewAI.service.ResumeTextExtractor;
import java.io.ByteArrayOutputStream;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class ResumeTextExtractorTest {

    private final ResumeTextExtractor extractor = new ResumeTextExtractor();

    @Test
    void extractsTextFromPdf() throws Exception {
        byte[] pdf = createPdf("PROJECTS\nOrder API with Spring Boot and PostgreSQL");

        String text = extractor.extractPdf(pdf);

        assertTrue(text.contains("Order API"));
        assertTrue(text.contains("Spring Boot"));
    }

    @Test
    void extractsTextFromDocx() throws Exception {
        byte[] docx;
        try (XWPFDocument document = new XWPFDocument();
                ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            document.createParagraph().createRun().setText("SKILLS");
            document.createParagraph().createRun().setText("Java and Spring Boot");
            document.write(output);
            docx = output.toByteArray();
        }

        String text = extractor.extractDocx(docx);

        assertTrue(text.contains("SKILLS"));
        assertTrue(text.contains("Spring Boot"));
    }

    private byte[] createPdf(String text) throws Exception {
        try (PDDocument document = new PDDocument();
                ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            PDPage page = new PDPage();
            document.addPage(page);
            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                content.beginText();
                content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                content.newLineAtOffset(50, 750);
                for (String line : text.split("\\n")) {
                    content.showText(line);
                    content.newLineAtOffset(0, -18);
                }
                content.endText();
            }
            document.save(output);
            return output.toByteArray();
        }
    }
}