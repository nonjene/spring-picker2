import React from 'react';
import { Picker, Popup, PopupPicker} from '../../components';
// import { PickerAddress } from '../../components-ext';
import './index.scss';

const userData =  {
  data1:[
    {name: '杜保坤', value: 0},
    {name: '况宏瑞', value: 1},
    {name: '盘维', value: 2},
    {name: '杨泉', value: 3},
    {name: '福娃', value: 4},
    {name: 'Lincal', value: 5},
    {name: '记忆残骸', value: 6},
    {name: 'Raoh', value: 7},
    {name: '铁甲飞龙', value: 8},
    {name: '吴泽兵', value: 9},
    {name: '邱福龙', value: 10},
    {name: '小泥巴', value: 11},
  ],
  data2:[
    {name: '杜保坤', value: 0},
    {name: '况宏瑞', value: 1},
    {name: '盘维', value: 2},
    {name: '杨泉', value: 3},
    {name: '福娃', value: 4},
    {name: 'Lincal', value: 5},
    {name: '记忆残骸', value: 6},
    {name: 'Raoh', value: 7},
    {name: '铁甲飞龙', value: 8},
    {name: '吴泽兵', value: 9},
    {name: '邱福龙', value: 10},
    {name: '小泥巴', value: 11},
  ]

};

export default class PickerDemo extends React.Component {
  
  constructor() {
    super();

    this.state = {
      userPickerVisible: false,
      userPickerVisible2: false,
      addressPickerVisible: false,
      selectedValue: {
        data1:4,
        data2:5,
      },
      cacheSelectedValue1:4
      // address: this.defaultAddress,
    };

    

  }

  // user选择
  showUserPicker (e) {
    e.nativeEvent.stopImmediatePropagation();
    this.setState({userPickerVisible: true});
  }
  // user选择
  showUserPicker2 (e) {
    e.nativeEvent.stopImmediatePropagation();
    this.setState({userPickerVisible2: true});
  }

  handleChangeUser (value) {
    this.setState({selectedValue: value});
  }

  closeUserPicker () {
    this.setState({
      userPickerVisible: false,
      selectedValue: {...this.state.selectedValue, data1:this.state.cacheSelectedValue1 }
    });
  }

  cancelUserPicker () {
    this.setState({
      userPickerVisible: false,
    });
  }

  // // 地址选择
  // showAddressPicker (e) {
  //   e.nativeEvent.stopImmediatePropagation();
  //   this.setState({addressPickerVisible: true});
  // }

  // handleChangeAddress (address) {
  //   this.setState({address: address});
  // }

  // closeAddressPicker (address) {
  //   this.setState({
  //     address: address,
  //     addressPickerVisible: false,
  //   });
  // }

  // cancelAddressPicker () {
  //   this.setState({
  //     address: this.defaultAddress,
  //     addressPickerVisible: false,
  //   });
  // }

  render() {
    return (
      <div className = "picker-demo">
        <div className="item">
          已选择：{ JSON.stringify(PopupPicker.getName(userData,this.state.selectedValue)) }
        </div>
        <div className="single-picker">
          <Popup
            onCancel={this.cancelUserPicker.bind(this)}
            onConfirm={this.closeUserPicker.bind(this)}
            visible={this.state.userPickerVisible}>
            <Picker
              onChange={(value)=>this.setState({
                cacheSelectedValue1: value
              })}
              data={userData.data1}
              selectedValue={this.state.selectedValue.data1}
            />
          </Popup>
          <PopupPicker 
            data={userData} 
            selectedValue={this.state.selectedValue}
            visible={this.state.userPickerVisible2}
            liveUpdate={false}
            onCancel={()=>this.setState({ userPickerVisible2: false })}
            onSelect={selectedValue=>this.setState({
              userPickerVisible2:false,
              selectedValue
            })}
            onChanging={(selectedValue, key, value, name)=>{
              console.log(selectedValue, key, value, name)
            }}
          />
        </div>

        <div className="button-wrap">
          <button
            type="button"
            onClick={this.showUserPicker.bind(this)}
            className="btn button-primary">
              单项选择
          </button>
          <button
            type="button"
            onClick={this.showUserPicker2.bind(this)}
            className="btn button-primary">
              多项选择
          </button>
        </div>

        {/* <div className="item">
          { this.state.address }
        </div> 

        <div className="button-wrap">
          <button
            type="button"
            onClick={this.showAddressPicker.bind(this)}
            className="btn button-primary">
              选择地址
          </button>
        </div> */}

      </div>
    )
  }
}