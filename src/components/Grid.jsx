import React from 'react'
import {AgGridReact, reactCellRendererFactory} from 'ag-grid-react'
import GridCell from './Grid.Cell'
import request from 'superagent-es6-promise';
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import DropDownMenu from 'material-ui/DropDownMenu'
import _ from 'lodash'
import bind from 'autobind-decorator'

export default class Grid extends React.Component {
    state = {
        rows: [],
        headers: [],
        cellInstance: null,
        notSavedChanges: []
    };

    componentWillMount() {

        const cellRenderer = reactCellRendererFactory(GridCell, this);
        const cellRendererParams  = {
            handleCellClick: this.setCellInstance,
        };

        const headers = [{ headerName: "#", valueGetter: "node.id / 1 + 1" }];

        Promise.all([

            request.get('/api/HEADERS/').then(({ body }) => body),
            request.get('/api/ROWS/').then(({ body }) => body),
            request.get('/api/META/').then(({ body }) => body),

        ]).then(([HEADERS, ROWS, META]) => {

            _.forOwn(HEADERS, (field, headerName) => {
                headers.push({
                    headerName,
                    field,
                    cellRenderer,
                    cellRendererParams
                })
            });

            const rows = _.map(ROWS, (row, index) => {
                return _.mapValues(row, (cellValue, header) => {
                    return {
                        ...META[index][header],
                        text: cellValue
                    }
                })
            });

            this.setState({ headers, rows })

        });

    }

    @bind
    saveChanges() {
        if (!_.isEmpty(this.state.notSavedChanges)) {
            // FIXME: collection patch by one request.
            _.forOwn(this.state.notSavedChanges, (patch, id) => {
                request
                    .patch(`/api/grid/${id}`)
                    .send(patch)
                    .end(err => {
                        !err &&  this.setState({ notSavedChanges: [] })
                    })
            });
        }
    }

    @bind
    collectChanges(changes) {
        const cellInstance = this.state.cellInstance;
        if (cellInstance) {
            const id = cellInstance.props.params.value.id;
            this.setState({
                notSavedChanges: {
                    ...this.state.notSavedChanges,
                    [id]: {
                        ...this.state.notSavedChanges[id],
                        ...changes
                    }
                }
            })
        }
    }

    @bind
    handleAlign(align) {
        this.state.cellInstance.setAlign(align);
        this.collectChanges({ align });
    }

    @bind
    handleBold() {
        const bold = !this.state.cellInstance.state.bold;
        this.state.cellInstance.setBold(bold);
        this.collectChanges({ bold })
    }

    @bind
    handleItalic() {
        const italic = !this.state.cellInstance.state.italic;
        this.state.cellInstance.setItalic(italic);
        this.collectChanges({ italic })
    }

    @bind
    handleFontSize(e, i, fontSize) {
        this.state.cellInstance.setFontSize(fontSize);
        this.collectChanges({ fontSize });
    }

    @bind
    setCellInstance(cellInstance) {
        this.setState({
            cellInstance
        })
    }

    render() {

        console.log('collected changes:', this.state.notSavedChanges);

        return <div className="ag-fresh" style={{ height: "50vh" }}>

            <Toolbar>
                <ToolbarGroup firstChild={true}>
                    <IconButton
                        disabled={!this.state.cellInstance}
                        onTouchTap={_.wrap('left', this.handleAlign)}>
                        <i className="material-icons">&#xE236;</i>
                    </IconButton>
                    <IconButton
                        disabled={!this.state.cellInstance}
                        onTouchTap={_.wrap('center', this.handleAlign)}>
                        <i className="material-icons">&#xE234;</i>
                    </IconButton>
                    <IconButton
                        disabled={!this.state.cellInstance}
                        onTouchTap={_.wrap('right', this.handleAlign)}>
                        <i className="material-icons">&#xE237;</i>
                    </IconButton>
                    <IconButton
                        disabled={!this.state.cellInstance}
                        onTouchTap={this.handleBold}>
                        <i className="material-icons">&#xE238;</i>
                    </IconButton>
                    <IconButton
                        disabled={!this.state.cellInstance}
                        onTouchTap={this.handleItalic}>
                        <i className="material-icons">&#xE23F;</i>
                    </IconButton>
                    <DropDownMenu
                        disabled={!this.state.cellInstance}
                        value={this.state.cellInstance && this.state.cellInstance.state.fontSize}
                        onChange={this.handleFontSize} maxHeight={200}>
                        <MenuItem value={12} primaryText={12} />
                        <MenuItem value={14} primaryText={14} />
                        <MenuItem value={16} primaryText={16} />
                    </DropDownMenu>
                </ToolbarGroup>
                <ToolbarGroup>
                    <FontIcon className="muidocs-icon-custom-sort" />
                    <ToolbarSeparator />
                    <RaisedButton
                        disabled={_.isEmpty(this.state.notSavedChanges)}
                        onTouchTap={this.saveChanges}
                        label="SAVE"
                        primary={true}
                    />
                </ToolbarGroup>
            </Toolbar>

            <AgGridReact
                columnDefs={this.state.headers}
                rowData={this.state.rows}
            />

        </div>
    }
};