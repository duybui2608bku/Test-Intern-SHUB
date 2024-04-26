import React, { useEffect, useState } from 'react';
import axios from 'axios';
import xlsx from 'xlsx';

function App() {
  const [filteredIndexes, setFilteredIndexes] = useState([]);

  useEffect(() => {
    async function fetchExcelData() {
      const url = 'https://go.microsoft.com/fwlink/?LinkID=521962';

      try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const workbook = xlsx.read(new Uint8Array(response.data), { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        data.forEach((item,index) => {
          if ((item["  Sales "]) >= 50000) {
            setFilteredIndexes(prev => [...prev, index + 2]);
          }
        })
      } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
      }
    }

    fetchExcelData();
  }, []);

  useEffect(() => {
    if (filteredIndexes.length > 0) {
      createExcelFile(filteredIndexes);
    }
  }, [filteredIndexes]);

  function createExcelFile(indexes) {
    const url = 'https://go.microsoft.com/fwlink/?LinkID=521962'; 
    axios.get(url, { responseType: 'arraybuffer' })
      .then(response => {
        const workbook = xlsx.read(new Uint8Array(response.data), { type: 'array' });
  
        const newWorkbook = xlsx.utils.book_new();
  
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
          const headerRow = { Sales: "  Sales ", COGS: 'COGS', 'Discount Band': 'Discount Band', Discounts: 'Discounts', 'Gross Sales': 'Gross Sales', 'Manufacturing Price': 'Manufacturing Price', 'Month Name': 'Month Name', Product: 'Product', Profit: 'Profit', 'Sale Price': 'Sale Price', Country: 'Country', Date: 'Date', 'Month Number': 'Month Number', Segment: 'Segment', 'Units Sold': 'Units Sold', Year: 'Year' }; 
          const newData = [headerRow, ...data];
          const filteredData = newData.filter((row, rowIndex) => indexes.includes(rowIndex));
          const newWorksheet = xlsx.utils.aoa_to_sheet(filteredData);
          xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
        });
        xlsx.writeFile(newWorkbook, 'filtered_data.xlsx');
      })
      .catch(error => {
        console.error('Đã xảy ra lỗi khi tạo tệp Excel mới:', error);
      });
  }
  return (
    <div className="App">
    </div>
  );
}

export default App;
