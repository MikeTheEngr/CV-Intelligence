import io
from fastapi import UploadFile, HTTPException

async def parse_cv(file: UploadFile) -> str:
    """
    Parse a CV file (PDF or DOCX) and return plain text.
    Supports: application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document
    """
    content = await file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        return _parse_pdf(content)
    elif filename.endswith(".docx"):
        return _parse_docx(content)
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a PDF or DOCX file."
        )


def _parse_pdf(content: bytes) -> str:
    """Extract text from PDF using PyMuPDF."""
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=content, filetype="pdf")
        text_parts = []
        for page in doc:
            text_parts.append(page.get_text())
        doc.close()
        full_text = "\n".join(text_parts).strip()
        if not full_text:
            raise HTTPException(status_code=422, detail="PDF appears to be empty or image-based (no extractable text).")
        return full_text
    except ImportError:
        raise HTTPException(status_code=500, detail="PyMuPDF not installed. Run: pip install pymupdf")
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to parse PDF: {str(e)}")


def _parse_docx(content: bytes) -> str:
    """Extract text from DOCX using python-docx."""
    try:
        from docx import Document
        doc = Document(io.BytesIO(content))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        full_text = "\n".join(paragraphs).strip()
        if not full_text:
            raise HTTPException(status_code=422, detail="DOCX appears to be empty.")
        return full_text
    except ImportError:
        raise HTTPException(status_code=500, detail="python-docx not installed. Run: pip install python-docx")
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to parse DOCX: {str(e)}")