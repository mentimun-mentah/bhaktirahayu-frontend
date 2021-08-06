import { Button } from 'antd'
import React from 'react'
import FileSaver from "file-saver";
import * as XLSX from "xlsx";

export const ExportToExcel = ({ jsonData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (jsonData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button 
      type="text" 
      className="border" 
      icon={<i className="far fa-download mr-2" />}
      onClick={() => exportToCSV(jsonData, fileName)}
    >
      Export
    </Button>
  );
};
