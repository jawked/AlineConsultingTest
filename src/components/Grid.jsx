import React from 'react'
import {AgGridReact, reactCellRendererFactory} from 'ag-grid-react'
import GridCell from './Grid.Cell'
import request from 'superagent'
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash'

const COLUMN_NUM = 4;

export default class Grid extends React.Component {
    state = {
        data: [],
        headers: [],
        cell: null
    };

    componentWillMount() {

        const cellRenderer = reactCellRendererFactory(GridCell, this);

        request.get('/api/grid/').end((err, res) => {
            this.setState({
                data: _.map(_.chunk(res.body, COLUMN_NUM), cell => (
                    _.zipObject(_.times(COLUMN_NUM), cell)
                ))
            })
        });

        const headers = [{ headerName: "#", valueGetter: "node.id / 1 + 1", exclude: true }];

        _.times(COLUMN_NUM, i => {
            headers.push({
                headerName: i,
                field: i + '',
                cellRenderer,
            })
        });

        this.setState({ headers })

    }

    handleAlign(align = 'left') {
        if (this.state.cell) {
            request
                .patch(`/api/grid/${this.state.cell.data.id}`)
                .send({ align })
                .end(err => {
                    !err && (this.state.cell.target.style.textAlign = align)
                })
        }
    }

    handleCellClick(params) {
        this.state.cell && (this.state.cell.target.style.background = 'inherit');
        if (!params.colDef.exclude && params.value) {
            const target = params.event.target;
            target.style.background = 'gray';
            this.setState({
                cell: {
                    data: params.value,
                    target
                }
            })
        } else { this.setState({ cell: null }) }

    }

    render() {
        return <div className="ag-fresh" style={{ height: "50vh" }}>

            <RaisedButton
                disabled={!this.state.cell}
                onTouchTap={_.wrap('left', this.handleAlign.bind(this))}
                label="Left"
            />

            <RaisedButton
                disabled={!this.state.cell}
                onTouchTap={_.wrap('center', this.handleAlign.bind(this))}
                label="Center"
            />

            <RaisedButton
                disabled={!this.state.cell}
                onTouchTap={_.wrap('right', this.handleAlign.bind(this))}
                label="Right"
            />

            <AgGridReact
                onCellClicked={this.handleCellClick.bind(this)}
                columnDefs={this.state.headers}
                rowData={this.state.data}
            />

        </div>
    }
};