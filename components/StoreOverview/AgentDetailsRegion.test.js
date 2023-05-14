import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentDetailsRegion from './AgentDetailsRegion';
import UserContext from '../../pages/UserContext';

test('Agent Details Region shows loading animation when collection is empty', async () => {
    //arrange
    render(<AgentDetailsRegion storeAgents={[]} screenshotView={false} />);
    //act & assert
    await waitFor(() => expect(screen.getByRole('progressbar', { id: 'triplemaze' })).toBeInTheDocument());
});

test('Agent Details Region shows store paper when collection is populated', async () => {
    // arrange
    const userRoles = ['admin'];
    render(
        <UserContext.Provider value={{ userRoles: userRoles, currentPage: 'StoreOverview', userRetailers: ['All'] }}>
            <AgentDetailsRegion
                storeAgents={[
                    {
                        _id: '63a66799f29fb50f846adeb4',
                        agentName: 'US0418-CP',
                        os: 'Sky',
                        retailer_id: 'T0BGBBL',
                        storeName: 'US0418',
                        deviceType: 1,
                        ipaddress: '10.89.66.66',
                        last_updated: '2023-01-13 14:56:30',
                        is_master: true,
                        is_master_agent: true,
                        online: true,
                        status: {
                            EleraServices: {
                                'Elera-Instance-6369d5d4c94d93501b4bfb22-Services':
                                    '[{"name":"id","value":"6369d5d4c94d93501b4bfb22"},{"name":"version","value":115},{"name":"status","value":"ONLINE"},{"name":"lastModifiedTimestamp","value":"2022-11-08T23:06:44.74Z"},{"name":"createTimestamp","value":"2022-11-08T04:06:44.914Z"},{"name":"services","value":[{"endpoint-status":"1.0.0-2022.9.9-2572-3f6bd21"},{"dead-message":"1.0.0-2022.9.9-1561-0fa205a"},{"fulfillments":"1.0.0-2022.9.9-3955-fbcfa4a"},{"inventory":"1.0.0-2022.9.9-3739-5d5b859"},{"authorization":"1.0.0-2022.9.9-5025-7...',
                            },
                            RMA: {
                                Version: '1.0',
                            },
                            RMQ: {
                                'RMQ Data Aggregate':
                                    '{"messageStats":null,"churnRates":null,"objectTotals":null,"queueTotals":null,"nodeStats":[]}',
                            },
                            MongoDB: {
                                'DBName-wpstatus':
                                    '{"asserts":"null","globalLock":"null","cache":null,"numSlowwSSLOperations":null,"transactions":null,"connections":"null","generic":null,"uptime":"null","bytesIn":null,"bytesOut":null,"capacity":null}',
                            },
                            JRE: {
                                JavaVersion: '1.8.0_272',
                            },
                            Controller: {
                                configured: 'true',
                            },
                            snapshot: '2023/01/13 13:58:55',
                            restartType: 'Restart',
                            docker: {},
                        },
                    },
                ]}
                screenshotView={false}
            />
        </UserContext.Provider>
    );

    //act & assert
    await waitFor(() => expect(screen.getByText('Controller - Master')).toBeInTheDocument());
});
