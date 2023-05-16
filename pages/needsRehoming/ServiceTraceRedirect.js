import React, { useEffect } from 'react';

export default function ServiceTraceRedirect() {
    useEffect(() => {
        window.location.replace('http://10.89.196.159:3000/d-solo/_Pj5pX5Vk/trace-dashboard?orgId=1&panelId=11');
        return null;
    }, []);

    return <></>;
}
