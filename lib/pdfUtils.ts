import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { CustomerFormData, GARMENTS } from "./validations/customer";

export const generateCustomerBill = (data: CustomerFormData) => {
    const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let currentY = 15;

    const checkPageOverflow = (neededHeight: number) => {
        if (currentY + neededHeight > pageHeight - 20) {
            doc.addPage();
            currentY = 15;
            return true;
        }
        return false;
    };

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("RK DATA ENTRY", pageWidth / 2, currentY, { align: "center" });

    currentY += 10;
    doc.setFontSize(14);
    doc.text("MEASUREMENT BILL", pageWidth / 2, currentY, { align: "center" });

    currentY += 5;
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    // Generation Info
    currentY += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const now = new Date();
    doc.text(`Bill Generated: ${format(now, "dd/MM/yyyy hh:mm a")}`, pageWidth - margin, currentY, { align: "right" });

    // Customer Details
    currentY += 2;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER INFORMATION", margin, currentY);

    currentY += 7;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const leftColX = margin;
    const rightColX = pageWidth / 2 + 5;

    doc.text(`Name: ${data.name}`, leftColX, currentY);
    doc.text(`Phone: ${data.phone}`, rightColX, currentY);

    currentY += 7;
    doc.text(`Measurement Date: ${format(new Date(data.date), "dd/MM/yyyy")}`, leftColX, currentY);
    doc.text(`Trial Date: ${format(new Date(data.trial_date), "dd/MM/yyyy")}`, rightColX, currentY);

    currentY += 7;
    doc.text(`Delivery Date: ${format(new Date(data.delivery_date), "dd/MM/yyyy")}`, leftColX, currentY);
    if (data.dob) {
        doc.text(`DOB: ${format(new Date(data.dob), "dd/MM/yyyy")}`, rightColX, currentY);
    }

    currentY += 10;
    doc.setLineWidth(0.2);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    // Measurements
    currentY += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("MEASUREMENTS (IN POINTS)", margin, currentY);

    currentY += 5;

    const selectedGarments = GARMENTS.filter(g => data.selected_garments.includes(g.id));

    if (selectedGarments.length > 0) {
        selectedGarments.forEach((garment) => {
            // Check if we need a new page for the title + at least one row of table
            checkPageOverflow(15);

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(garment.label.toUpperCase(), margin, currentY);
            currentY += 2;

            const fieldsData = garment.fields.map(f => {
                const val = data[f.key as keyof CustomerFormData];
                return {
                    label: f.label.replace(" (pts)", ""),
                    value: val !== undefined && val !== null ? val : "—"
                };
            });

            const tableRows = [];
            for (let i = 0; i < fieldsData.length; i += 4) {
                const row = fieldsData.slice(i, i + 4);
                const displayRow: any = {};
                row.forEach((item, index) => {
                    displayRow[`col${index}`] = `${item.label}: ${item.value}`;
                });
                tableRows.push(displayRow);
            }

            autoTable(doc, {
                startY: currentY,
                body: tableRows,
                columns: [
                    { header: "", dataKey: "col0" },
                    { header: "", dataKey: "col1" },
                    { header: "", dataKey: "col2" },
                    { header: "", dataKey: "col3" },
                ],
                margin: { left: margin, right: margin, bottom: 20 },
                theme: "plain",
                styles: {
                    fontSize: 10,
                    cellPadding: 2,
                    textColor: [0, 0, 0],
                    lineWidth: 0,
                },
                columnStyles: {
                    col0: { cellWidth: (pageWidth - 2 * margin) / 4 },
                    col1: { cellWidth: (pageWidth - 2 * margin) / 4 },
                    col2: { cellWidth: (pageWidth - 2 * margin) / 4 },
                    col3: { cellWidth: (pageWidth - 2 * margin) / 4 },
                },
                didDrawPage: (d: any) => {
                    currentY = d.cursor.y + 6;
                },
            });
        });
    } else {
        doc.setFontSize(11);
        doc.setFont("helvetica", "italic");
        doc.text("No measurements recorded.", margin, currentY);
        currentY += 10;
    }

    // Notes
    if (data.notes) {
        checkPageOverflow(20);
        currentY += 4;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("ADDITIONAL NOTES", margin, currentY);
        currentY += 6;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const splitNotes = doc.splitTextToSize(data.notes, pageWidth - 2 * margin);

        // Handle multi-page notes
        for (let i = 0; i < splitNotes.length; i++) {
            if (currentY > pageHeight - 25) {
                doc.addPage();
                currentY = 20;
            }
            doc.text(splitNotes[i], margin, currentY);
            currentY += 5;
        }
    }

    // Footer on the last page
    const finalPageHeight = doc.internal.pageSize.getHeight();
    doc.setLineWidth(0.5);
    doc.line(margin, finalPageHeight - 20, pageWidth - margin, finalPageHeight - 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("RK DATA ENTRY - PROFESSIONAL TAILORING SOLUTIONS", pageWidth / 2, finalPageHeight - 14, { align: "center" });

    // Save PDF
    const safeName = data.name.replace(/[^a-z0-9]/gi, "_");
    const safeDate = format(new Date(data.date), "dd-MM-yyyy");
    const fileName = `${safeName}_${safeDate}.pdf`;
    doc.save(fileName);
};
