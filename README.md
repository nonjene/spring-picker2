## 移动端react选择器，支持拓展二级联动，三级联动

forked from [springalskey/picker](https://github.com/springalskey/picker)

在原有的基础上优化了实现，更换了更清晰的数据格式，更好的交互体验。

## 特点

 * ios的滚轮UI风格
 * 更合理的用户交互
 * 支持多级联动，选项动态更新
 * 灵活的选项配置

## demo预览

Chrome打开开发者工具，切换到手机模拟器预览  
[https://nonjene.github.io/demo/spring-picker2/index.html](https://nonjene.github.io/demo/spring-picker2/index.html)


手机二维码扫描预览
![image]()


## 如何使用

```shell
$ npm install spring-picker2 -S
```
```js
import 'spring-picker/lib/style.css';
import { Picker, Popup, PopupPicker } from 'spring-picker';

constructor(){
  // 数据结构例子
  this.state = {
    selected:{
      year: '2018',
      month: '02'
    }
  }
  this.data = {
     "year": [
        {name:"2018年",value:"2018"},
        {name:"2019年",value:"2019"},
      ],
      "month":[
        {name:"1月", value:"01"},
        {name:"2月", value:"02"},
      ]
  };
}
render(){
  // 使用方式1，使用PopupPicker，只需要传递数据
  <PopupPicker 
    data={this.data} 
    selectedValue={this.state.selected}
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

  // 使用方式2，自己组合
  <Popup
    onCancel={this.cancelUserPicker.bind(this)}
    onConfirm={this.closeUserPicker.bind(this)}
    visible={this.state.userPickerVisible}>
    <Picker
      onChange={this.handleChangeUser.bind(this)}
      data={this.data.year}
      selectedValue={this.state.selected.year}
    />
  </Popup>
}

```

