## 移动端react选择器，支持拓展二级联动，三级联动

forked from [https://github.com/springalskey/picker](https://github.com/springalskey/picker)

处理多处bug，更换了更清晰的数据格式，新增PopPicker组件，可以在点击完成后再触发change，其他情况则还原数据。

更改幅度大，不提pr。

## How to use

```shell
$ npm install spring-picker2 -S
```
```js
import 'spring-picker/lib/style.css';
import { Picker, Popup, PopupPicker } from 'spring-picker';

// 自己组合
constructor(){
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

// PopupPicker 
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
}

```

## How to run

```
# install dependencies
npm install

# run server
npm start

# build for production with minification
npm run build

```

# preview
Chrome打开开发者工具，切换到手机模拟器预览  
[https://springalskey.github.io/picker/index.html#/picker-demo](https://springalskey.github.io/picker/index.html#/picker-demo)


# mobile qrcode preview
![image](https://github.com/springalskey/picker/blob/master/src/assets/picker-preview.jpeg)


### example1
![image](https://github.com/springalskey/picker/blob/master/src/assets/demo1.png)

### example2
![image](https://github.com/springalskey/picker/blob/master/src/assets/demo2.png)

