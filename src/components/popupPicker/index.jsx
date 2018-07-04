import React from 'react';
import PropTypes from 'prop-types';

import Picker from '../picker';
import Popup from '../popup';

const propTypes = {
  visible: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  selectedValue: PropTypes.any,
  liveUpdate: PropTypes.bool
};
const defaultProps = {
  data: [],
  visible: false,
  selectedValue: null,
  liveUpdate: false,
}
const getName = (data, value) =>
  (data.find(item => item.value === value) || {}).name;


/**
 * @功能：
 *    用户点击“确认”后，才传数据出去。
 *    这个组件的作用是把数据回路在做了缓冲，而不是强绑定。
 *    外层要做的只需在那两个响应函数中 同步 visible 和 selectedValue
 */
class PopupPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeValue: props.selectedValue
    };
    this.updOriVal(this.state.activeValue);
  }
  componentWillReceiveProps(nextProps) {
    // 更新原始选择，
    if (nextProps.selectedValue !== this._oriValue) {
      // 在当前用户没正在选择中的情况下，才更新state。
      if(this._oriValue === this.state.activeValue){
          this.setState({
            activeValue: nextProps.selectedValue
          })
      }

      this.updOriVal(nextProps.selectedValue);
      
    }
  }
  updOriVal(val) {
    this._oriValue = val;
  }
  handleSelect() {
    this.props.onSelect &&
      this.props.onSelect(
        this.state.activeValue,
        getName(this.props.data, this.state.activeValue)
      );
  }

  handleChange(value, name) {
    this.setState({ activeValue: value }, () => {
      if (this.props.liveUpdate) {
        this.handleSelect();
      }
    });
  }

  handleCancel() {
    // 把值改为原来的值
    this.setState({ activeValue: this._oriValue }, () => {
      this.props.onCancel && this.props.onCancel();
    });
  }

  render() {
    return (
      <Popup
        onCancel={this.handleCancel.bind(this)}
        onConfirm={this.handleSelect.bind(this)}
        visible={this.props.visible}
      >
        <Picker
          onChange={this.handleChange.bind(this)}
          data={this.props.data}
          selectedValue={this.state.activeValue}
        />
      </Popup>
    );
  }
}

PopupPicker.propTypes = propTypes;
PopupPicker.defaultProps = defaultProps;

export default PopupPicker;
