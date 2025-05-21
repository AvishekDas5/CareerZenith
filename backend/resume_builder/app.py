from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import uuid
import jinja2
import subprocess
import shutil
import requests
from pathlib import Path

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories if they don't exist
os.makedirs("static/resumes", exist_ok=True)
os.makedirs("templates", exist_ok=True)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Define Ollama API endpoint
OLLAMA_API_ENDPOINT = "http://localhost:11434/api/generate"

# Define Pydantic models for request validation
class SummarizeRequest(BaseModel):
    bullets: List[str]

class ProjectModel(BaseModel):
    name: str
    description: str

class ResumeRequest(BaseModel):
    name: str
    email: str
    phone: str
    summary: str
    skills: List[str] = []
    projects: List[ProjectModel]
    template: str

# Initialize Jinja2 template environment
template_env = jinja2.Environment(
    loader=jinja2.FileSystemLoader("templates"),
    autoescape=jinja2.select_autoescape(['tex'])
)

# Create template files
def create_templates():
    # Classic template
    classic_template = r'''
\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage[margin=1in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}

\titleformat{\section}{\large\bfseries}{\thesection}{0em}{}[\titlerule]
\titlespacing{\section}{0pt}{12pt}{6pt}

\begin{document}

\begin{center}
    {\LARGE \textbf{ {{name}} }}\\
    \vspace{0.2cm}
    {{email}} | {{phone}}
\end{center}

\section*{Summary}
{{summary}}

\section*{Skills}
{% if skills %}
\begin{itemize}[leftmargin=*]
    {% for skill in skills %}
    \item {{skill}}
    {% endfor %}
\end{itemize}
{% endif %}

\section*{Projects}
{% for project in projects %}
\textbf{ {{project.name}} }\\
{{project.description}}
{% if not loop.last %}
\vspace{0.3cm}
{% endif %}
{% endfor %}

\end{document}
'''

    # Modern template
    modern_template = r'''
\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage[margin=0.8in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}
\definecolor{accent}{RGB}{70, 130, 180}

\titleformat{\section}{\large\color{accent}\bfseries}{\thesection}{0em}{}
\titlespacing{\section}{0pt}{12pt}{6pt}

\begin{document}

\begin{center}
    {\LARGE \textbf{\textcolor{accent}{ {{name}} }}}\\
    \vspace{0.2cm}
    {{email}} | {{phone}}
\end{center}

\section*{Summary}
{{summary}}

\section*{Skills}
{% if skills %}
\begin{itemize}[leftmargin=*]
    {% for skill in skills %}
    \item {{skill}}
    {% endfor %}
\end{itemize}
{% endif %}

\section*{Projects}
{% for project in projects %}
\textbf{\textcolor{accent}{ {{project.name}} }}\\
{{project.description}}
{% if not loop.last %}
\vspace{0.3cm}
{% endif %}
{% endfor %}

\end{document}
'''

    # Creative template
    creative_template = r'''
\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage[margin=0.75in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}
\usepackage{tikz}

\definecolor{accent1}{RGB}{70, 150, 120}
\definecolor{accent2}{RGB}{200, 120, 50}

\titleformat{\section}{\large\color{accent1}\bfseries}{\thesection}{0em}{}[{\color{accent2}\titlerule[1pt]}]
\titlespacing{\section}{0pt}{12pt}{8pt}

\begin{document}

% Header with decorative element
\begin{tikzpicture}[remember picture, overlay]
\filldraw[fill=accent1!20] 
  (current page.north west) rectangle 
  ([yshift=-3cm]current page.north east);
\end{tikzpicture}

\vspace*{1.5cm}
\begin{center}
    {\LARGE \textbf{\textcolor{accent1}{ {{name}} }}}\\
    \vspace{0.2cm}
    {\color{accent2}{{email}} | {{phone}}}
\end{center}

\section*{Summary}
{{summary}}

\section*{Skills}
{% if skills %}
\begin{itemize}[leftmargin=*]
    {% for skill in skills %}
    \item {{skill}}
    {% endfor %}
\end{itemize}
{% endif %}

\section*{Projects}
{% for project in projects %}
\textbf{\textcolor{accent1}{ {{project.name}} }}\\
{{project.description}}
{% if not loop.last %}
\vspace{0.3cm}
{% endif %}
{% endfor %}

\end{document}
'''

    # Write templates to files
    with open("templates/classic.tex", "w") as f:
        f.write(classic_template)
    
    with open("templates/modern.tex", "w") as f:
        f.write(modern_template)
    
    with open("templates/creative.tex", "w") as f:
        f.write(creative_template)

# Create templates at startup
create_templates()

@app.post("/summarize/")
async def summarize_bullets(request: SummarizeRequest):
    """Generate a summary from bullet points using Gemma 2 via Ollama"""
    try:
        # Format bullet points for the prompt
        formatted_bullets = "\n".join([f"- {bullet}" for bullet in request.bullets if bullet.strip()])
        
        # Skip processing if there are no meaningful bullets
        if not formatted_bullets:
            return {"summary": ""}
        
        # Create the prompt for Gemma 2
        prompt = f"Generate one paragraph summary, which should look highly professional and enthusiastic for the following lines:\n{formatted_bullets}"
        
        # Call Ollama API
        response = requests.post(
            OLLAMA_API_ENDPOINT,
            json={
                "model": "gemma2",
                "prompt": prompt,
                "stream": False
            }
        )
        
        if response.status_code != 200:
            raise Exception(f"Ollama API error: {response.text}")
            
        # Extract the generated summary
        summary = response.json().get("response", "").strip()
        
        # Make sure the summary is not empty
        if not summary:
            summary = "Experienced professional with a diverse skill set."
        
        return {"summary": summary}
        
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")

@app.post("/generate-pdf/")
async def generate_pdf(resume_data: ResumeRequest):
    """Generate a PDF resume from the provided data"""
    try:
        # Create a unique ID for this resume
        resume_id = str(uuid.uuid4())
        temp_dir = f"static/resumes/{resume_id}"
        os.makedirs(temp_dir, exist_ok=True)
        
        # Select the appropriate template
        template_name = resume_data.template
        if template_name not in ["classic", "modern", "creative"]:
            template_name = "classic"  # Default to classic if template not found
            
        # Get the template
        template = template_env.get_template(f"{template_name}.tex")
        
        # Process skills if they're provided as a string
        skills = resume_data.skills
        if isinstance(skills, str):
            skills = [skill.strip() for skill in skills.split(',') if skill.strip()]
        
        # Render the template with data
        tex_content = template.render(
            name=resume_data.name,
            email=resume_data.email,
            phone=resume_data.phone,
            summary=resume_data.summary,
            skills=skills,
            projects=resume_data.projects
        )
        
        # Write the TeX file
        tex_file_path = os.path.join(temp_dir, "resume.tex")
        with open(tex_file_path, "w", encoding="utf-8") as tex_file:
            tex_file.write(tex_content)
        
        # Compile the TeX file to PDF using pdflatex
        # -interaction=nonstopmode prevents pdflatex from stopping on errors
        # -output-directory specifies where to put the output files
        process = subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", 
             f"-output-directory={temp_dir}", tex_file_path],
            capture_output=True,
            text=True
        )
        
        # Check if PDF was successfully created
        pdf_path = os.path.join(temp_dir, "resume.pdf")
        if not os.path.exists(pdf_path):
            print(f"PDF generation failed: {process.stdout}\n{process.stderr}")
            raise HTTPException(status_code=500, detail="Failed to generate PDF")
        
        # Return the URL to access the PDF
        pdf_url = f"/static/resumes/{resume_id}/resume.pdf"
        return {"pdf_url": pdf_url}
        
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Resume Wizard API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8009, reload=True)
