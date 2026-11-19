"""Validate the portfolio course source and packaged SCORM 1.2 manifest."""
import json
import re
import subprocess
import tempfile
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

root = Path(__file__).resolve().parents[1]
html = (root / "index.html").read_text(encoding="utf-8")
manifest = (root / "imsmanifest.xml").read_bytes()
assert '<html lang="es">' in html
assert 'src="assets/lms-analytics-welcome.avif"' in html
assert (root / "assets" / "lms-analytics-welcome.avif").is_file()
assert 'id="course-app"' in html
for field in ("cmi.suspend_data", "cmi.core.score.raw", "cmi.core.lesson_status",
              "cmi.core.session_time", "LMSInitialize", "LMSFinish"):
    assert field in html, field
script = re.search(r'<script id="course-app">([\s\S]*?)</script>', html)
assert script, "Embedded script missing"
with tempfile.TemporaryDirectory() as folder:
    js = Path(folder) / "app.js"
    js.write_text(script.group(1), encoding="utf-8")
    subprocess.run(["node", "--check", str(js)], check=True)
    zip_path = Path(folder) / "course.zip"
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.write(root / "index.html", "index.html")
        archive.write(root / "imsmanifest.xml", "imsmanifest.xml")
        archive.write(root / "assets" / "lms-analytics-welcome.avif", "assets/lms-analytics-welcome.avif")
    with zipfile.ZipFile(zip_path) as archive:
        assert archive.testzip() is None
        assert set(archive.namelist()) == {"index.html", "imsmanifest.xml", "assets/lms-analytics-welcome.avif"}
        document = ET.fromstring(archive.read("imsmanifest.xml"))
        ns = {"im": "http://www.imsproject.org/xsd/imscp_rootv1p1p2"}
        resource = document.find(".//im:resource", ns)
        assert resource is not None
        assert resource.attrib.get("href") == "index.html"
        assert any(child.attrib.get("href") == "assets/lms-analytics-welcome.avif" for child in resource)
        score = document.find(".//{http://www.adlnet.org/xsd/adlcp_rootv1p2}masteryscore")
        assert score is not None and score.text == "80"
print("SCORM structure and JavaScript syntax OK; LMS integration still needs testing.")
