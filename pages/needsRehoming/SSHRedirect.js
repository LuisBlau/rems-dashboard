import React, { useEffect } from 'react';

export default function SSHRedirect() {
    useEffect(() => {
        window.location.replace(
            'http://10.89.196.159:2222/ssh/host/52.146.25.6?port=50001&header=Script&headerBackground=black'
        );
        return null;
    }, []);

    return <></>;
}
