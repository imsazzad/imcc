import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [tableData, setTableData] = useState(null);

    useEffect(() => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const date = String(today.getDate()).padStart(2, '0');
        const fileName = `${date}.json`;

        fetch(`/prayer_time/${month}/${fileName}`)
            .then(response => response.json())
            .then(data => setTableData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    if (!tableData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
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
                            <td>{row[0]}</td>
                            <td>{row[1]}</td>
                            {row[2] && <td>{row[2]}</td>}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default App;