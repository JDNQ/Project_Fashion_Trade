import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes'; // 1. Import
import './assets/styles/global.css'; // (Import CSS global)

function App() {
    return (
        <AuthProvider>
            {/* 2. Chỉ cần gọi AppRoutes, nó sẽ xử lý mọi logic hiển thị */}
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;