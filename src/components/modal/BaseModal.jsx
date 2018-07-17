import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

const propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func
};

class BaseModal extends React.Component {
  constructor(props) {
    super(props);

    this.handleClickOverlay = function(e) {
      this.props.onCancel && this.props.onCancel();
    }.bind(this);

    this.handleClickModal = function(e) {
      e.stopPropagation();
    }.bind(this);
  }
  doUnBind() {
    this.modalOverlay &&
      this.modalOverlay.removeEventListener('click', this.handleClickOverlay, false);
    this.modal &&
      this.modal.removeEventListener('click', this.handleClickModal, false);
  }
  doBind() {
    // 点击阴影背景时cancel() popup
    this.modalOverlay.addEventListener('click', this.handleClickOverlay, false);
    this.modal.addEventListener('click', this.handleClickModal, false);
  }
  componentDidUpdate(props, state) {}
  componentDidMount() {
    console.log('mount');
    this.doBind();
  }
  componentWillUnmount() {
    console.log('un');
    this.doUnBind();
  }

  render() {
    return (
      <div
        className="modal-overlay"
        ref={modalOverlay => {
          this.modalOverlay = modalOverlay;
        }}
      >
        <div
          className="modal"
          ref={modal => {
            this.modal = modal;
          }}
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
