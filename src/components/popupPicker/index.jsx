import React from 'react';
import PropTypes from 'prop-types';

import Picker from '../picker';
import Popup from '../popup';
const deepEqual = require('fast-deep-equal');

const propTypes = {
  visible: PropTypes.bool.isRequired,
  // 用户点确认
  onSelect: PropTypes.func.isRequired,
  // 点取消
  onCancel: PropTypes.func.isRequired,
  /* 例子(键值命名随意)：
    {
      "year": [
        {name:"2018年",value:"2018"},
        {name:"2019年",value:"2019"},
      ],
      "month":[
        {name:"1月", value:"01"},
        {name:"2月", value:"02"},
      ]
    }
  */
  data: PropTypes.object.isRequired,
  
  /* 默认选中的value 例子：
    {
      "year": "2019",
      "month":"02"
    }
  */
  selectedValue: PropTypes.object,
  // 是否在选择过程即时传递数据
  liveUpdate: PropTypes.bool,
  // 正在滑动选择
  onChanging: PropTypes.func,
  viewCount: PropTypes.number
};
const defaultProps = {
  data: {},
  visible: false,
  selectedValue: {},
  liveUpdate: false
};
const getName = (bundleData, values) =>{
  return Object.keys(bundleData).reduce((o,name)=>{
    o[name] = (bundleData[name].find(item => item.value === values[name]) || {}).name;
    return o;
  }, {});
}
  

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
      activeValue: this.props.selectedValue,
    };
    this._activeValue = this.props.selectedValue;
    this._oriValue = this._activeValue;
  }
  componentWillReceiveProps(nextProps) {
    const isSelectValueChanged = !deepEqual(nextProps.selectedValue, this._oriValue);
    // 更新原始选择，
    if (isSelectValueChanged) {
      this.syncVal(nextProps.selectedValue);

    }else{
      //选择没变化，但选项变化
      let newer = false;
      const activeValue = {...this.state.activeValue};
      Object.keys(nextProps.data).forEach(name=>{
        // 选项变化了
        if(!deepEqual(nextProps.data[name], this.props.data[name])){
          // 重置选项
          const val = (nextProps.data[name][0] || {}).value;
          activeValue[name] = val;
          this._oriValue[name] = val;
          newer = true;
        }
      });
      newer && this.syncVal(activeValue);
    }
    

  }
  syncVal(val){
    this._oriValue = this._activeValue = val; // _oriValue 用于用户点取消后, 重置state.activeValue
    this.setState({ activeValue: val });
  }
  handleSelect() {
    this.props.onSelect &&
      this.props.onSelect(
        this.state.activeValue,
        getName(this.props.data, this.state.activeValue)
      );
  }

  handleChange(key, value, name) {
    //console.log('change:', key, value, name)
    this._activeValue = {
      ...this._activeValue,
      [key]: value
    };
    this.setState({ activeValue: this._activeValue }, () => {
      this.props.onChanging && this.props.onChanging(this.state.activeValue, key, value, name);
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
    //console.log('render:', this.state.activeValue);
    return (
      <Popup
        onCancel={this.handleCancel.bind(this)}
        onConfirm={this.handleSelect.bind(this)}
        visible={this.props.visible}
      >
        {Object.keys(this.props.data).map(name => (
          <Picker
            key={name}
            onChange={this.handleChange.bind(this, name)}
            data={this.props.data[name]}
            selectedValue={this.state.activeValue[name]}
            viewCount={this.props.viewCount}
          />
        ))}
      </Popup>
    );
  }
}
PopupPicker.getName = getName;
PopupPicker.propTypes = propTypes;
PopupPicker.defaultProps = defaultProps;

export default PopupPicker;
