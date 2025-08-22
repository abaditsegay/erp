#!/usr/bin/env python3
"""
ERP System Documentation PDF Generator
Converts the markdown documentation to a professional PDF document
"""

import os
import subprocess
import sys
from pathlib import Path

def install_dependencies():
    """Install required Python packages"""
    packages = [
        'markdown2',
        'weasyprint',
        'pygments'
    ]
    
    for package in packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✓ {package} is already installed")
        except ImportError:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])

def generate_pdf():
    """Generate PDF from markdown documentation"""
    try:
        import markdown2
        from weasyprint import HTML, CSS
        from weasyprint.text.fonts import FontConfiguration
    except ImportError as e:
        print(f"Error importing required modules: {e}")
        print("Installing dependencies...")
        install_dependencies()
        import markdown2
        from weasyprint import HTML, CSS
        from weasyprint.text.fonts import FontConfiguration

    # File paths
    current_dir = Path(__file__).parent
    md_file = current_dir / "ERP_System_Documentation.md"
    pdf_file = current_dir / "ERP_System_Implementation_Guide.pdf"
    
    if not md_file.exists():
        print(f"Error: Markdown file not found at {md_file}")
        return False
    
    # Read markdown content
    with open(md_file, 'r', encoding='utf-8') as file:
        markdown_content = file.read()
    
    # Convert markdown to HTML with syntax highlighting
    html_content = markdown2.markdown(
        markdown_content, 
        extras=[
            'fenced-code-blocks', 
            'tables', 
            'toc',
            'code-friendly',
            'header-ids'
        ]
    )
    
    # CSS styling for professional PDF
    css_styling = """
    @page {
        size: A4;
        margin: 2cm;
        @top-center {
            content: "ERP System Implementation Guide";
            font-family: Arial, sans-serif;
            font-size: 10px;
            color: #666;
        }
        @bottom-center {
            content: counter(page) " of " counter(pages);
            font-family: Arial, sans-serif;
            font-size: 10px;
            color: #666;
        }
    }
    
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: none;
        margin: 0;
        padding: 0;
    }
    
    h1 {
        color: #1e3a8a;
        border-bottom: 3px solid #3b82f6;
        padding-bottom: 10px;
        margin-top: 40px;
        font-size: 28px;
        page-break-before: always;
    }
    
    h1:first-child {
        page-break-before: avoid;
        margin-top: 0;
    }
    
    h2 {
        color: #1e40af;
        border-bottom: 2px solid #60a5fa;
        padding-bottom: 8px;
        margin-top: 30px;
        font-size: 22px;
    }
    
    h3 {
        color: #1e40af;
        margin-top: 25px;
        font-size: 18px;
        border-left: 4px solid #3b82f6;
        padding-left: 15px;
    }
    
    h4 {
        color: #374151;
        margin-top: 20px;
        font-size: 16px;
    }
    
    h5, h6 {
        color: #4b5563;
        margin-top: 15px;
    }
    
    code {
        background-color: #f3f4f6;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 0.9em;
        color: #dc2626;
    }
    
    pre {
        background-color: #1f2937;
        color: #f9fafb;
        padding: 20px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 20px 0;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 0.85em;
        line-height: 1.4;
        border: 1px solid #374151;
    }
    
    pre code {
        background: none;
        padding: 0;
        color: inherit;
        border-radius: 0;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 0.9em;
    }
    
    th, td {
        border: 1px solid #d1d5db;
        padding: 12px;
        text-align: left;
    }
    
    th {
        background-color: #f3f4f6;
        font-weight: bold;
        color: #374151;
    }
    
    tr:nth-child(even) {
        background-color: #f9fafb;
    }
    
    ul, ol {
        margin: 15px 0;
        padding-left: 30px;
    }
    
    li {
        margin: 8px 0;
    }
    
    blockquote {
        border-left: 4px solid #3b82f6;
        margin: 20px 0;
        padding: 10px 20px;
        background-color: #eff6ff;
        font-style: italic;
    }
    
    .toc ul {
        list-style-type: none;
    }
    
    .toc a {
        text-decoration: none;
        color: #1e40af;
    }
    
    .toc a:hover {
        text-decoration: underline;
    }
    
    strong {
        color: #374151;
        font-weight: 600;
    }
    
    em {
        font-style: italic;
        color: #4b5563;
    }
    
    .page-break {
        page-break-before: always;
    }
    
    /* Syntax highlighting for code blocks */
    .codehilite .k { color: #3b82f6; font-weight: bold; } /* Keyword */
    .codehilite .s { color: #059669; } /* String */
    .codehilite .c { color: #6b7280; font-style: italic; } /* Comment */
    .codehilite .n { color: #f9fafb; } /* Name */
    .codehilite .o { color: #f59e0b; } /* Operator */
    .codehilite .p { color: #d1d5db; } /* Punctuation */
    """
    
    # Create complete HTML document
    full_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ERP System Implementation Guide</title>
        <style>{css_styling}</style>
    </head>
    <body>
        <div class="cover-page">
            <h1 style="text-align: center; margin-top: 200px; font-size: 36px; color: #1e3a8a;">
                Enterprise Resource Planning (ERP)<br>
                System Implementation Guide
            </h1>
            <p style="text-align: center; font-size: 18px; color: #6b7280; margin-top: 50px;">
                Comprehensive Documentation and Architecture Guide
            </p>
            <p style="text-align: center; font-size: 14px; color: #9ca3af; margin-top: 100px;">
                Generated on: {Path(__file__).stat().st_mtime}
            </p>
        </div>
        <div class="page-break"></div>
        {html_content}
    </body>
    </html>
    """
    
    # Configure font
    font_config = FontConfiguration()
    
    # Create CSS object
    css = CSS(string=css_styling, font_config=font_config)
    
    try:
        # Generate PDF
        print("Generating PDF...")
        HTML(string=full_html).write_pdf(
            pdf_file,
            stylesheets=[css],
            font_config=font_config
        )
        
        print(f"✓ PDF generated successfully: {pdf_file}")
        print(f"File size: {pdf_file.stat().st_size / 1024 / 1024:.2f} MB")
        return True
        
    except Exception as e:
        print(f"Error generating PDF: {e}")
        return False

if __name__ == "__main__":
    print("ERP System Documentation PDF Generator")
    print("=" * 50)
    
    if generate_pdf():
        print("\n✓ Documentation PDF generated successfully!")
        print("You can now download the 'ERP_System_Implementation_Guide.pdf' file.")
    else:
        print("\n✗ Failed to generate PDF. Please check the error messages above.")
