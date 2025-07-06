import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

interface PlaceOfInterest {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface DayPlan {
  id: number;
  dayNumber: number;
  startLocation: Location;
  finishLocation: Location;
  distanceKm: number;
  introduction: string;
  placesOfInterest: PlaceOfInterest[];
}

interface Trip {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  dayPlans: DayPlan[];
}

export const generateTripPDF = async (trip: Trip): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  let currentY = margin;
  
  // Title page with better styling
  pdf.setFillColor(59, 130, 246); // Blue background
  pdf.rect(0, 0, pageWidth, 60, 'F');
  
  pdf.setTextColor(255, 255, 255); // White text
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text(trip.title, pageWidth / 2, 35, { align: 'center' });
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${trip.dayPlans.length} Days`, pageWidth / 2, 50, { align: 'center' });
  
  // Reset text color for rest of document
  pdf.setTextColor(0, 0, 0);
  currentY = 80;
  
  // Trip description with better formatting
  if (trip.description) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Trip Overview', margin, currentY);
    currentY += 10;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const descriptionLines = pdf.splitTextToSize(trip.description, contentWidth);
    descriptionLines.forEach((line: string) => {
      if (currentY > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(line, margin, currentY);
      currentY += 6;
    });
    currentY += 15;
  }
  
  // Table of contents with better styling
  pdf.setFillColor(243, 244, 246); // Light gray background
  pdf.rect(margin - 5, currentY - 5, contentWidth + 10, 20, 'F');
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Table of Contents', margin, currentY);
  currentY += 15;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  trip.dayPlans.forEach((day, index) => {
    if (currentY > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }
    
    // Fix the text splitting issue by using proper text formatting
    const dayNumber = `Day ${day.dayNumber}`;
    const route = `${day.startLocation.name} to ${day.finishLocation.name}`;
    const distance = `(${day.distanceKm} km)`;
    
    // Draw each part separately to avoid text splitting issues
    pdf.text(dayNumber, margin, currentY);
    pdf.text(': ', margin + 25, currentY);
    pdf.text(route, margin + 30, currentY);
    pdf.text(` ${distance}`, margin + 120, currentY);
    
    currentY += 8;
  });
  
  currentY += 10;
  
  // Add trip overview map
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Trip Overview Map', margin, currentY);
  currentY += 10;
  
  // Try to capture the map
  try {
    const mapElement = document.querySelector('.leaflet-container');
    if (mapElement) {
      const canvas = await html2canvas(mapElement as HTMLElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 1.5,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (currentY + imgHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
      
      pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 10;
    }
  } catch (error) {
    console.error('Error capturing map:', error);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(107, 114, 128); // Gray text
    pdf.text('Interactive map available in the web application.', margin, currentY);
    currentY += 10;
  }
  
  // Generate content for each day with better styling
  for (let i = 0; i < trip.dayPlans.length; i++) {
    const day = trip.dayPlans[i];
    
    // Add new page for each day (except first)
    if (i > 0) {
      pdf.addPage();
      currentY = margin;
    }
    
    // Day header with background
    pdf.setFillColor(59, 130, 246);
    pdf.rect(margin - 5, currentY - 5, contentWidth + 10, 15, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Day ${day.dayNumber}`, margin, currentY + 5);
    
    pdf.setTextColor(0, 0, 0);
    currentY += 20;
    
    // Route info with better formatting
    pdf.setFillColor(239, 246, 255); // Light blue background
    pdf.rect(margin - 5, currentY - 5, contentWidth + 10, 35, 'F');
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Route Information', margin, currentY);
    currentY += 10;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`From: ${day.startLocation.name}`, margin, currentY);
    currentY += 7;
    pdf.text(`To: ${day.finishLocation.name}`, margin, currentY);
    currentY += 7;
    pdf.text(`Distance: ${day.distanceKm} km`, margin, currentY);
    currentY += 15;
    
    // Introduction with better styling
    if (day.introduction) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Day Overview', margin, currentY);
      currentY += 10;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const introLines = pdf.splitTextToSize(day.introduction, contentWidth);
      introLines.forEach((line: string) => {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        pdf.text(line, margin, currentY);
        currentY += 6;
      });
      currentY += 10;
    }
    
    // Places of Interest with better styling
    if (day.placesOfInterest.length > 0) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Places of Interest', margin, currentY);
      currentY += 10;
      
      day.placesOfInterest.forEach((poi, index) => {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        
        // Place header with background
        pdf.setFillColor(219, 234, 254); // Very light blue
        pdf.rect(margin - 3, currentY - 3, contentWidth + 6, 10, 'F');
        
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. ${poi.name}`, margin, currentY + 5);
        currentY += 12;
        
        // Description
        const descriptionLines = pdf.splitTextToSize(poi.description, contentWidth);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        descriptionLines.forEach((line: string) => {
          if (currentY > pageHeight - margin) {
            pdf.addPage();
            currentY = margin;
          }
          pdf.text(line, margin + 5, currentY);
          currentY += 5;
        });
        currentY += 8;
      });
    }
  }
  
  // Save the PDF
  pdf.save(`${trip.title.replace(/[^a-zA-Z0-9]/g, '_')}_trip_plan.pdf`);
};

// Function to capture map as image and add to PDF
export const captureMapAsImage = async (mapElementId: string): Promise<string> => {
  try {
    const mapElement = document.getElementById(mapElementId);
    if (!mapElement) {
      throw new Error('Map element not found');
    }
    
    const canvas = await html2canvas(mapElement, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scale: 2, // Higher resolution
      logging: false,
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing map:', error);
    return '';
  }
};

// Function to add map image to PDF
export const addMapToPDF = (pdf: jsPDF, imageDataUrl: string, x: number, y: number, width: number, height: number): void => {
  try {
    pdf.addImage(imageDataUrl, 'PNG', x, y, width, height);
  } catch (error) {
    console.error('Error adding map to PDF:', error);
  }
}; 