import React from 'react';
import bind from 'autobind-decorator'
import _ from 'lodash'

export default class GridCell extends React.Component {
    static propTypes = {
        params: React.PropTypes.object
    };

    componentWillMount() {
        this.setState(
            _.pick(
                this.props.params.value,
                ['align', 'bold', 'italic', 'fontSize']
            )
        )
    }

    @bind
    handleCellClick() {
        this.props.params.handleCellClick && this.props.params.handleCellClick(
            this
        )
    }

    @bind
    setAlign(align) {
        this.setState({
            align
        })
    }

    @bind
    setBold(bold) {
        this.setState({
            bold
        })
    }

    @bind
    setItalic(italic) {
        this.setState({
            italic
        })
    }

    @bind
    setFontSize(fontSize) {
        this.setState({
            fontSize
        })
    }

    render() {
        //console.log('re-render')
        if (this.props.params.value) {
            return (
                <div
                    style={{
                        textAlign: this.state.align,
                        fontWeight: this.state.bold && 'bold',
                        fontStyle: this.state.italic && 'italic',
                        fontSize: this.state.fontSize
                    }}
                    onClick={this.handleCellClick}>
                    {this.props.params.value.text}
                </div>
            );
        }

        return null;

    }
}