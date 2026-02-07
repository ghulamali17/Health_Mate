import { toast } from "react-toastify";

// Helper function to extract file extension
export const getFileExtension = (filenameOrUrl) => {
  if (!filenameOrUrl) return "pdf";

  let filename = filenameOrUrl;
  if (filenameOrUrl.includes("/")) {
    filename = filenameOrUrl.split("/").pop() || "";
  }

  const extension = filename.split(".").pop()?.toLowerCase();
  const validExtensions = ["pdf", "jpg", "jpeg", "png", "doc", "docx", "txt"];
  return validExtensions.includes(extension) ? extension : "pdf";
};

// Download original report file
export const downloadReport = async (report) => {
  if (!report?.fileUrl) {
    toast.error("No file available for download");
    return;
  }

  try {
    const token = localStorage.getItem("pos-token");
    const response = await fetch(report.fileUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;

    const fileExtension = getFileExtension(report.fileName || report.fileUrl);
    const fileName =
      report.fileName && !report.fileName.includes(".")
        ? `${report.fileName}.${fileExtension}`
        : report.fileName || `report.${fileExtension}`;

    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    toast.success("Report downloaded successfully");
  } catch (error) {
    console.error("Download failed:", error);
    toast.error("Failed to download report");
    window.open(report.fileUrl, "_blank");
  }
};

// Download AI summary as optimized HTML
export const downloadAISummary = (report) => {
  if (!report?.aiSummary) {
    toast.error("No AI summary available to download");
    return;
  }

  try {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.fileName || "Report"} - AI Summary</title>
    <style>
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            line-height: 1.6; 
            margin: 0; 
            padding: 20px; 
            background: #f8fafc; 
            color: #1f2937;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); 
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #059669, #047857); 
            color: white; 
            padding: 24px; 
            text-align: center;
        }
        .header h1 { 
            margin: 0 0 8px 0; 
            font-size: 24px; 
            font-weight: 700;
        }
        .header p { 
            margin: 0; 
            opacity: 0.9;
        }
        .content { 
            padding: 24px;
        }
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; border-radius: 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Health Report Summary</h1>
            <p>${report.fileName} • ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="content">
            ${report.aiSummary}
        </div>
    </div>
</body>
</html>`;

    const originalName = report.fileName?.split(".")[0] || "report";
    const fileName = `${originalName}_summary.html`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Summary downloaded successfully");
  } catch (error) {
    console.error("Download failed:", error);
    toast.error("Failed to download summary");
  }
};
