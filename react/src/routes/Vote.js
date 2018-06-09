import React from 'react';
import YPlayer from '../components/YPlayer';

class Vote extends React.Component
{
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>
        { this.props.match.params.time }
        <YPlayer />
        </div>
    );
  }
};

export default Vote;
