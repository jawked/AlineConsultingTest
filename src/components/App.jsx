import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin';

import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-fresh.css';

const containerStyle = {
    margin: "30px 30px 30px 290px"
};

injectTapEventPlugin();

export default class App extends React.Component {
    render() {
        return <MuiThemeProvider>
            <Paper zDepth={0} style={containerStyle}>
                <Drawer open={true}>
                    <MenuItem
                        containerElement={<Link to="/home" />}>
                        Home
                    </MenuItem>
                    <MenuItem
                        containerElement={<Link to="/grid" />}>
                        Grid
                    </MenuItem>
                    <MenuItem
                        containerElement={<Link to="/about" />}>
                        Home
                    </MenuItem>
                </Drawer>
                {this.props.children}
            </Paper>
        </MuiThemeProvider>
    }
};