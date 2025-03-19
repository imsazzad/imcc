import React, { useEffect, useState } from 'react';
import './App.css';
// import logo from './imcc.png'; // Import the logo
import logo from './imcc.svg'; // Import the logo

function App() {
    const [tableData, setTableData] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const date = String(today.getDate()).padStart(2, '0');
        const fileName = `${date}.json`;
        const baseUrl = process.env.PUBLIC_URL;

        fetch(`${baseUrl}/prayertime/${month}/${fileName}`)
            .then(response => response.json())
            .then(data => setTableData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const englishDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const arabicDate = currentTime.toLocaleDateString('en-GB-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' });

    function convertToBanglaDate(date) {
        const monthsInBangla = [
            'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
            'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
        ];

        const daysInBangla = [
            'শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'
        ];

        const numbersInBangla = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];

        const day = daysInBangla[date.getDay()];
        const month = monthsInBangla[date.getMonth()];
        const year = date.getFullYear().toString().replace(/[0-9]/g, digit => numbersInBangla[digit]);
        const dateOfMonth = date.getDate().toString().replace(/[0-9]/g, digit => numbersInBangla[digit]);

        return `${day}, ${dateOfMonth} ${month}, ${year} বঙ্গাব্দ`;
    }

    // const banglaDate = convertToBanglaDate(currentTime);

    if (!tableData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <div className="App-header">
                <img src={logo} alt="IMCC Logo" className="logo" />
                <div className="date-english">{englishDate}</div>
                <div className="current-time">{currentTime.toLocaleTimeString()}</div>
                <div className="date-arabic">{arabicDate}</div>
                {/*<div className="date-bangla">{banglaDate}</div>*/}
            </div>
            <main className="App-main">
                <table className="App-table">
                    <thead>
                    <tr>
                        <th>{tableData.header1}</th>
                        <th>{tableData.header2}</th>
                        {tableData.header3 && <th>{tableData.header3}</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td data-label={tableData.header1}>{row[0]}</td>
                            <td data-label={tableData.header2}>{row[1]}</td>
                            {row[2] && <td data-label={tableData.header3}>{row[2]}</td>}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </main>

        </div>

    );
}

export default App;