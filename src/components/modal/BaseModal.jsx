import React from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

const propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func
};

class BaseModal extends React.Component {
  constructor(props) {
    super(props);

  }
  
  //componentDidUpdate(props, state) {}
  componentDidMount() {}
  componentWillUnmount(){}
  handleClickOverlay(){
    this.props.onCancel && this.props.onCancel();
  }
  handleClickModal(e){
    e.stopPropagation();
  }

  render() {
    return (
      <div
        className="modal-overlay"
        onClick={this.handleClickOverlay.bind(this)}
      >
        <div
          className="modal"
          onClick={this.handleClickModal.bind(this)}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

BaseModal.propTypes = propTypes;

export default function(props) {
  return (
    <CSSTransition
      classNames="modal-transition"
      timeout={240}
      in={props.visible}
      unmountOnExit
    >
      <BaseModal {...props} />
    </CSSTransition>
  );
}
