import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DengueAlert } from '../types/DengueAlert';

interface DengueChartProps {
    data: DengueAlert[];
}

const DengueChart: React.FC<DengueChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semanaEpidemiologicaFormatada" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="casosEstimados"
                    name="Casos Estimados"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
                <Line
                    type="monotone"
                    dataKey="casosNotificados"
                    name="Casos Notificados"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default DengueChart; 