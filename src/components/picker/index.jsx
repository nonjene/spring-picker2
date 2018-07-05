import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const getIndex = (list, value) => {
  if (list && list.length < 1) {
    return 0;
  }
  const index = list.findIndex((item)=>item.value === value);
  if (index < 0) {
    console.warn(`指定的value:${value}不存在`);
  }
  return index;
}

const existValue = (val)=>!!~'number,string'.indexOf(typeof val);

class Picker extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.startY = 0;
    this.endY   = 0;
    //当前拖动的Y坐标
    this.currentY = 0;
    this.itemHeight = 36;
    this.selectedIndex = this.getInitialIndex();
    this.state = {style: {}};
    
  }

  // 初始化获得selectedIndex
  getInitialIndex() {
    let index;
    if (!existValue(this.props.selectedValue)) {
      if(this.props.data.length > 3){
        index = Math.floor(this.props.data.length / 2);
        
      }else{
        index = 0;
      }
      //没指定value，选了index后定义对应的value
      this.setSelectedValue(index)
    }else{
      index = getIndex(
        this.props.data,
        this.props.selectedValue
      );
      //制定value不存在
      if(index < 0){
        index = 0;
        this.setSelectedValue(index);
      }
    }
    return index;
  }

  componentWillReceiveProps(nextProps) {
    const isEqual = nextProps.selectedValue === this.props.selectedValue;

    if (!isEqual) {
      this.selectedIndex = getIndex(nextProps.data, nextProps.selectedValue);
      if (this.selectedIndex === 0) {
        //这是干嘛的？
        this.setState({
          style: {
            transform: `translate3d(0px, ${this.itemHeight * 2}px, 0px)`
          }
        })
      }
    }
  }

  getInitialStyle () {
    this.currentY = 0;
    if (this.selectedIndex > 2) {
      this.currentY = - (this.selectedIndex - 2) * this.itemHeight;
    } else {
      this.currentY = (2 - this.selectedIndex) * this.itemHeight;
    }
    return `translate3d(0px, ${ this.currentY }px, 0px)`;
  }

  handleTouchStart (e) {
    e.preventDefault();
    if (this.props.data.length <= 1) {
      return;
    }
    this.startY = e.nativeEvent.changedTouches[0].pageY;
  }

  handleTouchEnd (e) {
    e.preventDefault();
    if (this.props.data.length <= 1) {
      return;
    }
    this.endY = e.nativeEvent.changedTouches[0].pageY;
    // 实际滚动距离
    let v = parseInt(this.endY - this.startY);
    let value = v % this.itemHeight;
    // 计算出每次拖动的36px整倍数
    this.currentY += (v - value);

    // 正数y最大值
    const max1 = 2 * this.itemHeight;
    // 负数y最小值
    const max2 = (this.props.data.length - 3) * this.itemHeight;

    if (this.currentY > max1) {
      this.currentY = max1;
    }
    else if (this.currentY > 0 && this.currentY < max1) {
      this.currentY = this.currentY;
    }
    else if (this.currentY === max1) {
      this.currentY = this.currentY;
    }
    else if (Math.abs(this.currentY) > max2) {
      this.currentY = - max2;
    }

    this.countListIndex(this.currentY);

    this.setState({
      style: {
        transform: `translate3d(0px, ${ this.currentY }px, 0px)`
      }
    });
  }

  handleTouchMove (e) {
    e.preventDefault();
    if (this.props.data.length <= 1) {
      return;
    }
    const pageY = e.nativeEvent.changedTouches[0].pageY;
    let value = parseInt(pageY - this.startY);
    const y = this.currentY + value;
    let style = `translate3d(0px, ${ y }px, 0px)`;
    this.setState({
      style: {
        transform: style
      }
    });
  }

  // 计算list数组索引
  countListIndex (pageY) {
    let n = pageY / this.itemHeight;
    n = n > 0 ? 2 - n : Math.abs(n) + 2;
    this.setSelectedValue(n);
  }

  // set选中值
  setSelectedValue (index) {
    const length = this.props.data.length;
    if (length === 0) {
      this.callback({});
      return;
    }
    if (index < 0 ) index = 0;
    if(index > length -1) index = length -1;

    const item = this.props.data[index];
    this.selectedIndex = index;

    this.callback(item)
  }

  // 回调
  callback (item) {
    this.props.onChange(item.value, item.name);
  }

  getSelectedClass (index) {
    if (this.selectedIndex === index) {
      return 'ui-picker-item-selected';
    }
    return '';
  }

  componentDidMount () {
    //this.setSelectedValue(this.selectedIndex, 'slient');
  }

  handleWrapperStart (e) {
    e.preventDefault();
  }

  render () {
    const style = {
      transform: this.getInitialStyle()
    }
    return (
      <div className="ui-picker-wrapper" onTouchStart={this.handleWrapperStart.bind(this)}>
          <div className="ui-picker"
            style = {this.state.style.transform ? this.state.style : style}
            onTouchStart={this.handleTouchStart.bind(this)}
            onTouchMove={this.handleTouchMove.bind(this)}
            onTouchEnd = {this.handleTouchEnd.bind(this)}>
            {
              this.props.data.map((item, index) => {
                const displayValue = item.name;
                return <div key={index}
                  className={ 'ui-picker-item ' + this.getSelectedClass(index)}>
                  {displayValue}
                </div>
              })
            }
          </div>
          <div className="ui-picker-center"></div>
      </div>
    )
  }
}

Picker.propTypes = {
  // 数据源
  data: PropTypes.array.isRequired,
  // 选中的value
  selectedValue: PropTypes.any,
  // 当停止滑动选中立即回调onchange方法
  onChange: PropTypes.func,
};

export default Picker;
