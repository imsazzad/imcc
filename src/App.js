import React, { useEffect, useState } from 'react';
import './App.css';
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

    const getNextTimeIndex = () => {
        if (!tableData) return -1;
        const currentTimeString = currentTime.toTimeString().split(' ')[0];
        const currentTimeInSeconds = currentTimeString.split(':').reduce((acc, time) => (60 * acc) + +time);


        for (let i = 0; i < tableData.rows.length; i++) {
            const rowTimeString = tableData.rows[i][1] + ":00";
            const prayerName = tableData.rows[i][0];
            const rowTimeInSeconds = rowTimeString.split(':').reduce((acc, time) => (60 * acc) + +time);
            if (rowTimeInSeconds > currentTimeInSeconds) {
                const timeDifference = Math.abs(rowTimeInSeconds - currentTimeInSeconds);
                return { index: i, timeDifference, prayerName };
                // return i;
            }
        }

        // because after Isha finish it should show fajr time, first row
        const rowTimeString = tableData.rows[0][1] + ":00";
        const prayerName = tableData.rows[0][0];
        const rowTimeInSeconds = rowTimeString.split(':').reduce((acc, time) => (60 * acc) + +time);
        const timeDifference = "24:00:00".split(':').reduce((acc, time) => (60 * acc) + +time) + rowTimeInSeconds - currentTimeInSeconds;
        return { index: 0, timeDifference, prayerName };

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
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <div className="App-header">
                <img src={logo} alt="IMCC Logo" className="logo" />
                <div className="date-english">{englishDate}</div>
                <div className="current-time">{currentTime.toLocaleTimeString()}</div>
                <div className="date-arabic">{arabicDate}</div>
                <div className="remaining-time">{prayerName} : {formattedRemainingTime}</div>
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
                        <tr key={rowIndex} className={rowIndex === nextTimeIndex ? 'bold-row' : ''}>
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