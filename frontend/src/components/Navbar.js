import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
export const Navbar = ({ title = 'Compliance Dashboard' }) => {
    return (_jsx("nav", { style: {
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
            padding: '16px 24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }, children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx(Link, { to: "/", style: { textDecoration: 'none', color: 'white' }, children: _jsx("h1", { style: { margin: 0, fontSize: '24px', fontWeight: 'bold' }, children: title }) }), _jsxs("div", { style: { display: 'flex', gap: '20px' }, children: [_jsx(Link, { to: "/", style: {
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                transition: 'background 0.3s',
                            }, onMouseEnter: (e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'), onMouseLeave: (e) => (e.currentTarget.style.background = 'transparent'), children: "Dashboard" }), _jsx(Link, { to: "/compliance", style: {
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                transition: 'background 0.3s',
                            }, onMouseEnter: (e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'), onMouseLeave: (e) => (e.currentTarget.style.background = 'transparent'), children: "Compliance Areas" }), _jsx(Link, { to: "/positions", style: {
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                transition: 'background 0.3s',
                            }, onMouseEnter: (e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'), onMouseLeave: (e) => (e.currentTarget.style.background = 'transparent'), children: "Positions" }), _jsx(Link, { to: "/audit", style: {
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                transition: 'background 0.3s',
                            }, onMouseEnter: (e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'), onMouseLeave: (e) => (e.currentTarget.style.background = 'transparent'), children: "Audit Logs" }), _jsx(Link, { to: "/mtl", style: {
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                transition: 'background 0.3s',
                            }, onMouseEnter: (e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'), onMouseLeave: (e) => (e.currentTarget.style.background = 'transparent'), children: "MTL Licenses" }), _jsx(Link, { to: "/remedial", style: {
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                transition: 'background 0.3s',
                            }, onMouseEnter: (e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'), onMouseLeave: (e) => (e.currentTarget.style.background = 'transparent'), children: "Remedial Actions" }), _jsx(Link, { to: "/bsa-aml", style: {
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                transition: 'background 0.3s',
                            }, onMouseEnter: (e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'), onMouseLeave: (e) => (e.currentTarget.style.background = 'transparent'), children: "BSA / AML" })] })] }) }));
};
