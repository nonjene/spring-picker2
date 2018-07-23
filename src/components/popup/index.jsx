import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import BaseModal from '../modal/BaseModal';

const propTypes = {
  visible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

class Popup extends React.Component {
  constructor(props) {
    super(props);
  }

  handleCancel (e) {
    e && e.stopPropagation();
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  handleConfirm(e) {
    e.stopPropagation();
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  }


  render () {
    const isZh = !navigator.language || 
                  navigator.language.toLowerCase() === 'zh-cn' || 
                  navigator.language.toLowerCase() === 'zh';
    let text1 = !isZh ? 'Cancel' : '取消';
    let text2 = !isZh ? 'Finish' : '完成';
    return (
      <BaseModal
        onCancel={this.handleCancel.bind(this)}
        visible={this.props.visible}>
          <div className="ui-popup-title">
            <span onClick={this.handleCancel.bind(this)}>{text1}</span>
            <span onClick={this.handleConfirm.bind(this)}>{text2}</span>
          </div>
          <div className="ui-popup-content">
            {this.props.children}
          </div>
      </BaseModal>
    )
  }
}

Popup.propTypes = propTypes;

export default Popup;
