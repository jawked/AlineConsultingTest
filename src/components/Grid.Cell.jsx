import React from 'react';

export default class GridCell extends React.Component {
    static propTypes = {
        params: React.PropTypes.object
    };

    render() {
        if (this.props.params.value) {
            const {text, align} = this.props.params.value;
            return (
                <div style={{textAlign: align}}>
                    {text}
                </div>
            );
        }
        return null;
    }
}