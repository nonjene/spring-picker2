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
const defaultProps = {
  viewCount: 7
}


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
    this.viewCount = props.viewCount % 2 ? props.viewCount : props.viewCount + 1;//要奇数
    this.halfCount = this.viewCount / 2 | 0;
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
      this.setSelectedValue(index, 'init')
    }else{
      index = getIndex(
        this.props.data,
        this.props.selectedValue
      );
      //制定value不存在
      if(index < 0){
        index = 0;
        this.setSelectedValue(index,'init');
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
        this.setTransForm(this.itemHeight * this.halfCount);
      }
    }
  }

  getInitialStyle () {
    this.currentY = 0;
    if (this.selectedIndex > this.halfCount) {
      this.currentY = - (this.selectedIndex - this.halfCount) * this.itemHeight;
    } else {
      this.currentY = (this.halfCount - this.selectedIndex) * this.itemHeight;
    }
    return this.currentY;
  }
  setTransForm(y, type){
    //todo: 改为scroll
    if(!this.dom) return;
    const val = `translate3d(0px, ${y}px, 0px)`;
    (window.requestAnimationFrame || window.webkitRequestAnimationFrame)(()=>{
      this.dom.style.webkitTransform = val;
      this.dom.style.transform = val;
      if(type==='end'){
        this.dom.style.transition = '';
      }else{
        this.dom.style.transition = 'none';
      }
    })
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
    const v = +(this.endY - this.startY);
    const value = Math.round(v / this.itemHeight) * this.itemHeight;
    // 计算出每次拖动的36px整倍数
    this.currentY += Math.round(value);

    // 正数y最大值
    const max = this.halfCount * this.itemHeight;
    // 负数y最小值
    const min = -(this.props.data.length - this.halfCount - 1) * this.itemHeight;

    if (this.currentY > max) {
      this.currentY = max;
    }
    else if (this.currentY < min) {
      this.currentY =  min;
    }

    this.countListIndex(this.currentY);

    this.setTransForm(this.currentY, 'end');
  }

  handleTouchMove (e) {
    e.preventDefault();
    if (this.props.data.length <= 1) {
      return;
    }
    const pageY = e.nativeEvent.changedTouches[0].pageY;
    let value = parseInt(pageY - this.startY);
    const y = this.currentY + value;
    this.setTransForm(y);
  }
  

  // 计算list数组索引
  countListIndex (pageY) {
    let n = pageY / this.itemHeight;
    n = n > 0 ? this.halfCount - n : Math.abs(n) + this.halfCount;
    this.setSelectedValue(n);
  }

  // set选中值
  setSelectedValue (index, type) {
    const length = this.props.data.length;
    if (length === 0) {
      this.callback({});
      return;
    }
    if (index < 0 ) index = 0;
    if(index > length -1) index = length -1;

    const item = this.props.data[index];
    this.selectedIndex = index;

    this.callback(item, type)
  }

  // 回调
  callback (item, type) {
    if(type==='init'){
        this._triggerChangeWhenMount = item;
    }else{
      this.props.onChange(item.value, item.name);
    }
  }

  getSelectedClass (index) {
    if (this.selectedIndex === index) {
      return 'ui-picker-item-selected';
    }
    return '';
  }

  componentDidMount () {
    if(this._triggerChangeWhenMount){
        this.callback(this._triggerChangeWhenMount);
        this._triggerChangeWhenMount = null;
    }
    this.setTransForm(this.getInitialStyle());
  }

  handleWrapperStart (e) {
    e.preventDefault();
  }

  render () {
    // const style = {
    //   transform: this.getInitialStyle()
    // }
    return (
      <div className="ui-picker-wrapper" onTouchStart={this.handleWrapperStart.bind(this)}>
          <div className="ui-picker"
            ref={dom=>this.dom = dom}
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
          <div className="ui-picker-deco" />
          <div className="ui-picker-center"/>
      </div>
    )
  }
}
Picker.defaultProps = defaultProps;
Picker.propTypes = {
  // 数据源
  data: PropTypes.array.isRequired,
  // 选中的value
  selectedValue: PropTypes.any,
  // 当停止滑动选中立即回调onchange方法
  onChange: PropTypes.func,
  viewCount: PropTypes.number
};

export default Picker;
