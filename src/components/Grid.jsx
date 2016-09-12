import React from 'react'
import {AgGridReact, reactCellRendererFactory} from 'ag-grid-react'
import GridCell from './Grid.Cell'
import request from 'superagent'
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import _ from 'lodash'
import bind from 'autobind-decorator'

const COLUMN_NUM = 4;

export default class Grid extends React.Component {
    state = {
        data: [],
        headers: [],
        cellInstance: null
    };

    componentWillMount() {

        const cellRenderer = reactCellRendererFactory(GridCell, this);
        const cellRendererParams  = {
            handleCellClick: this.setCellInstance,
        };

        request.get('/api/grid/').end((err, res) => {
            this.setState({
                data: _.map(_.chunk(res.body, COLUMN_NUM), cell => (
                    _.zipObject(_.times(COLUMN_NUM), cell)
                ))
            })
        });

        const headers = [{ headerName: "#", valueGetter: "node.id / 1 + 1" }];

        _.times(COLUMN_NUM, i => {
            headers.push({
                headerName: i,
                field: i + '',
                cellRenderer,
                cellRendererParams

            })
        });

        this.setState({ headers })

    }

    @bind
    asyncPatchEntity(patchObj, clb) {
        if (this.state.cellInstance) {
            const id = this.state.cellInstance.props.params.value.id;
            request
                .patch(`/api/grid/${id}`)
                .send(patchObj)
                .end(err => {
                    !err && clb(patchObj)
                })
        }
    }

    @bind
    handleAlign(align) {
        this.asyncPatchEntity({ align },
            obj => this.state.cellInstance.setAlign(
                obj.align
            )
        );
    }

    @bind
    handleBold() {
        this.asyncPatchEntity({ bold: !this.state.cellInstance.state.bold },
            obj => this.state.cellInstance.setBold(
                obj.bold
            )
        );
    }

    @bind
    handleItalic() {
        this.asyncPatchEntity({ italic: !this.state.cellInstance.state.italic },
            obj => this.state.cellInstance.setItalic(
                obj.italic
            )
        );
    }

    @bind
    handleFontSize(e, i, fontSize) {
        this.asyncPatchEntity({ fontSize },
            obj => this.state.cellInstance.setFontSize(
                obj.fontSize
            )
        );
    }

    @bind
    setCellInstance(cellInstance) {
        this.setState({
            cellInstance
        })
    }

    render() {
        return <div className="ag-fresh" style={{ height: "50vh" }}>

            <RaisedButton
                disabled={!this.state.cellInstance}
                onTouchTap={_.wrap('left', this.handleAlign)}
                label="Left"
            />

            <RaisedButton
                disabled={!this.state.cellInstance}
                onTouchTap={_.wrap('center', this.handleAlign)}
                label="Center"
            />

            <RaisedButton
                disabled={!this.state.cellInstance}
                onTouchTap={_.wrap('right', this.handleAlign)}
                label="Right"
            />

            <RaisedButton
                disabled={!this.state.cellInstance}
                onTouchTap={this.handleBold}
                label="B"
            />

            <RaisedButton
                disabled={!this.state.cellInstance}
                onTouchTap={this.handleItalic}
                label="I"
            />

            Font Size: <SelectField
                disabled={!this.state.cellInstance}
                value={this.state.cellInstance && this.state.cellInstance.state.fontSize}
                onChange={this.handleFontSize} maxHeight={200}>
                <MenuItem value={12} primaryText={12} />
                <MenuItem value={14} primaryText={14} />
                <MenuItem value={16} primaryText={16} />
            </SelectField>

            <AgGridReact
                columnDefs={this.state.headers}
                rowData={this.state.data}
            />

        </div>
    }
};