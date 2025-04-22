import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './imcc.svg'; // Import the logo
// import Papa from 'papaparse';
import Calendar from 'date-bengali-revised'

function App() {
    const [tableData, setTableData] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const date = String(today.getDate()).padStart(2, '0');
        const fileName = `${date}.json`;
        // console.log(fileName, month);
        const baseUrl = process.env.PUBLIC_URL;

        // console.log(`${baseUrl}/prayertime/03/abcd.json`);
        // console.log(`${baseUrl}/prayertime/${month}/${fileName}`);
        fetch(`${baseUrl}/prayertime/03/20.json`)
            .then(response => response.json())
            .catch(error => console.error('Error fetching data:', error));

        const findIqamahTime = (time, minutes) => {
            const [hours, mins] = time.split(':').map(Number);
            const date = new Date();
            date.setHours(hours, mins + minutes);
            return date.toTimeString().split(' ')[0].slice(0, 5);
        };

        const iqamahTimeForDhuhr = (time) => {
            const [hours, mins] = time.split(':').map(Number);
            if (hours < 12 || (hours === 12 && mins < 50)) {
                return "12:50";
            } else {
                return "13:50";
            }
        };

        const fetchPrayerTimes = async () => {
            let url = 'https://api.aladhan.com/v1/timingsByCity?city=Dublin&country=Ireland&method=2';
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`;
                        try {
                            const response = await fetch(url);
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            const data = await response.json();
                            const timings = data.data.timings;

                            const formattedData = {
                                header1: "PRAYER",
                                header2: "ADHAN",
                                header3: "IQAMAH",
                                rows: [
                                    ["FAJR", timings.Fajr, findIqamahTime(timings.Fajr, 20)],
                                    ["SUNRISE", timings.Sunrise, ""],
                                    ["DHUHR", timings.Dhuhr, iqamahTimeForDhuhr(timings.Dhuhr)],
                                    ["ASR", timings.Asr, findIqamahTime(timings.Asr, 10)],
                                    ["MAGHRIB", timings.Maghrib, findIqamahTime(timings.Maghrib, 10)],
                                    ["ISHA", timings.Isha, findIqamahTime(timings.Isha, 20)]
                                ]
                            };

                            setTableData(formattedData);
                        } catch (error) {
                            console.error('Error fetching data:', error);
                        }
                    },
                    async (error) => {
                        console.error('Error getting location:', error);
                        try {
                            const response = await fetch(url);
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            const data = await response.json();
                            const timings = data.data.timings;

                            const formattedData = {
                                header1: "PRAYER",
                                header2: "ADHAN",
                                header3: "IQAMAH",
                                rows: [
                                    ["FAJR", timings.Fajr, findIqamahTime(timings.Fajr, 20)],
                                    ["SUNRISE", timings.Sunrise, ""],
                                    ["DHUHR", timings.Dhuhr, iqamahTimeForDhuhr(timings.Dhuhr)],
                                    ["ASR", timings.Asr, findIqamahTime(timings.Asr, 10)],
                                    ["MAGHRIB", timings.Maghrib, findIqamahTime(timings.Maghrib, 10)],
                                    ["ISHA", timings.Isha, findIqamahTime(timings.Isha, 20)]
                                ]
                            };

                            setTableData(formattedData);
                        } catch (error) {
                            console.error('Error fetching data:', error);
                        }
                    }
                );
            } else {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    const timings = data.data.timings;

                    const formattedData = {
                        header1: "PRAYER",
                        header2: "ADHAN",
                        header3: "IQAMAH",
                        rows: [
                            ["FAJR", timings.Fajr, findIqamahTime(timings.Fajr, 20)],
                            ["SUNRISE", timings.Sunrise, ""],
                            ["DHUHR", timings.Dhuhr, iqamahTimeForDhuhr(timings.Dhuhr)],
                            ["ASR", timings.Asr, findIqamahTime(timings.Asr, 10)],
                            ["MAGHRIB", timings.Maghrib, findIqamahTime(timings.Maghrib, 10)],
                            ["ISHA", timings.Isha, findIqamahTime(timings.Isha, 20)]
                        ]
                    };

                    setTableData(formattedData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        // Ensure the promise is handled
        fetchPrayerTimes();

    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);


    const englishDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const arabicDate = currentTime.toLocaleDateString('en-GB-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' });
    const today = new Date();
    const bengaliDate= new Calendar().fromGregorian(today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0')).format('dddd, D MMMM, Y [Q]')
    console.log("bangla cal", bengaliDate)



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

    // console.log("formattedRemainingTime", formattedRemainingTime, prayerName);


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
                <div className="date-bangla">{bengaliDate}</div>
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