import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Đảm bảo đã import
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // (Hoặc global.css)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* 2. Đảm bảo <App /> nằm BÊN TRONG <BrowserRouter> */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);