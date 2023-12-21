import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentDetailsRegion from './AgentDetailsRegion';

test('Agent Details Region shows loading animation when collection is empty', async () => {
    //arrange
    render(<AgentDetailsRegion storeAgents={[]} screenshotView={false} />);
    //act & assert
    await waitFor(() => expect(screen.getByRole('progressbar', { id: 'triplemaze' })).toBeInTheDocument());
});

