import React, { Component } from 'react';
import {
    Chart,
    Series,
    ArgumentAxis,
    CommonSeriesSettings,
    Legend,
    Tooltip,
    Grid,
    Size,
    Point,
    Label,
    ValueAxis,
} from 'devextreme-react/chart';
import service from './serviceNowTicketVolumeData.js';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

const dayInfo = service.getDayInfo();
const dataPointSources = service.getDataPointSources();

export default class ServiceNowTicketVolume extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'line',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center' }}>
                <Typography color={'#000000'} fontWeight={'bold'} fontSize={18}>
                    Daily ServiceNow Ticket Volume
                </Typography>
                <Chart dataSource={dayInfo}>
                    <Size height={200} width={300} />
                    <CommonSeriesSettings argumentField="day" type={this.state.type} />
                    {dataPointSources.map((item) => (
                        <Series key={item.value} valueField={item.value} name={item.name}>
                            <Point visible={false} />
                            <Label backgroundColor={'#FFFFFF'} />
                        </Series>
                    ))}
                    <ArgumentAxis color={'#FFFFFF'}>
                        <Label color={'#FFFFFF'} />
                        <Grid visible={true} />
                    </ArgumentAxis>
                    <ValueAxis color={'#FFFFFF'} />
                    <Legend visible={false} />
                    <Tooltip enabled={true} />
                </Chart>
            </Box>
        );
    }

    handleChange(e) {
        this.setState({ type: e.value });
    }
}
