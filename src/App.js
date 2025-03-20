import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './imcc.svg'; // Import the logo
import Papa from 'papaparse';

function App() {
    const [tableData, setTableData] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const date = String(today.getDate()).padStart(2, '0');
        const fileName = `${date}.json`;
        console.log(fileName, month)
        const baseUrl = process.env.PUBLIC_URL;

        //     reading a sample file for now
        // fetch(`${baseUrl}/prayertime/${month}/${fileName}`)
        console.log(`${baseUrl}/prayertime/03/abcd.json`)
        console.log(`${baseUrl}/prayertime/${month}/${fileName}`)
        fetch(`${baseUrl}/prayertime/03/20.json`)
            .then(response => response.json())
            .then(data => setTableData(data))
            .catch(error => console.error('Error fetching data:', error));

        // fetch(`${baseUrl}/prayertime/03.csv`)
        //     .then(response => response.text())
        //     .then(csvData => {
        //         Papa.parse(csvData, {
        //             header: true,
        //             skipEmptyLines: true,
        //             complete: (result) => {
        //                 const selectedRows = [result.data[0], result.data[date]];
        //                 console.log(selectedRows); // Log the selected rows
        //                 // setTableData(result.data);
        //             },
        //             error: (error) => {
        //                 console.error('Error parsing CSV data:', error);
        //             }
        //         });
        //     })
        //     .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const englishDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const arabicDate = currentTime.toLocaleDateString('en-GB-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' });

    const getNextTimeIndex = () => {
        if (!tableData) return -1;
        const currentTimeString = currentTime.toTimeString().split(' ')[0];
        const currentTimeInSeconds = currentTimeString.split(':').reduce((acc, time) => (60 * acc) + +time);


        for (let i = 0; i < tableData.rows.length; i++) {
            const rowAdhanTimeString = tableData.rows[i][1] + ":00";
            const rowIqamahTimeString = tableData.rows[i][2] + ":00";
            const prayerName = tableData.rows[i][0];
            const rowAdhanTimeInSeconds = rowAdhanTimeString.split(':').reduce((acc, time) => (60 * acc) + +time);
            const rowIqamahTimeInSeconds = rowIqamahTimeString.split(':').reduce((acc, time) => (60 * acc) + +time);
            if (rowAdhanTimeInSeconds > currentTimeInSeconds) {
                const timeDifference = Math.abs(rowAdhanTimeInSeconds - currentTimeInSeconds);
                return { index: i, timeDifference, prayerName:prayerName };
                // return i;
            }
            else if (rowAdhanTimeInSeconds < currentTimeInSeconds &&  rowIqamahTimeInSeconds > currentTimeInSeconds) {
                const timeDifference = Math.abs(rowIqamahTimeInSeconds - currentTimeInSeconds);
                return { index: i, timeDifference, prayerName: `${prayerName} IQAMAH` };
            }
        }

        // because after Isha finish it should show fajr time, first row
        const rowTimeString = tableData.rows[0][1] + ":00";
        const prayerName = tableData.rows[0][0];
        const rowTimeInSeconds = rowTimeString.split(':').reduce((acc, time) => (60 * acc) + +time);
        const timeDifference = "24:00:00".split(':').reduce((acc, time) => (60 * acc) + +time) + rowTimeInSeconds - currentTimeInSeconds;
        return { index: 0, timeDifference, prayerName:prayerName };

    };

    const { index: nextTimeIndex, timeDifference: remainingTime, prayerName} = getNextTimeIndex();

    const formatRemainingTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formattedRemainingTime = formatRemainingTime(remainingTime);

    console.log("formattedRemainingTime", formattedRemainingTime, prayerName);


    if (!tableData) {
        return <div>Prayer Time Not Available.</div>;
    }

    return (
        <div className="App">
            <div className="App-header">
                <img src={logo} alt="IMCC Logo" className="logo" />
                <div className="date-english">{englishDate}</div>
                <div className="current-time">{currentTime.toLocaleTimeString()}</div>
                <div className="date-arabic">{arabicDate}</div>
                <div className="remaining-time">{prayerName}  {formattedRemainingTime}</div>
            </div>
            <main className="App-main">
                <table className="App-table">
                    <thead>
                    <tr>
                        <th>PRAYER</th>
                        <th>ADHAN</th>
                        <th>IQAMAH</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex === nextTimeIndex ? 'bold-colored-row' : ''}>
                            <td data-label={tableData.header1}>{row[0]}</td>
                            {rowIndex === 1 ? (
                                <td data-label={tableData.header2} colSpan="2">{row[1]}</td>
                            ) : (
                                <>
                                    <td data-label={tableData.header2}>{row[1]}</td>
                                    {row[2] && <td data-label={tableData.header3}>{row[2]}</td>}
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default App;