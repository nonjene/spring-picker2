## 移动端react选择器，支持多级联动

forked from [springalskey/picker](https://github.com/springalskey/picker)

在原有的基础上优化了实现，更换了更清晰的数据格式，更好的交互体验。

## 特点

 * 真实的3D滚轮，效果更接近原生，秒杀其它大多数picker组件🙃
 * 更合理的用户交互
 * 支持多级联动，选项动态更新
 * 灵活的选项配置
 * 兼容ios的背景滚动问题

## demo预览

![image](https://nonjene.github.io/demo/spring-picker2/out.gif)

Chrome打开开发者工具，切换到手机模拟器预览  
[demo](https://nonjene.github.io/demo/spring-picker2/index.html)


手机二维码扫描预览

![image](https://nonjene.github.io/demo/spring-picker2/qrcode.png)


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
    visible={this.state.visible2}
    onCancel={()=>this.setState({ visible2: false })}
    onSelect={selectedValue=>this.setState({
      visible2: false,
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

## API

### PopupPicker

| props | type | default value | description |
|--|--| -- | -- |
| visible | bool | `false` | 是否显示组件 |
| data | object | `{}` | 选项列表数据，数据结构参考上面的例子 |
| selectedValue | object | `{}` | 已选择的值 |
| liveUpdate | bool | `false` | 用户滑动到某个位置时，是否立即是更新为选中☑️的值，并通过onSelect传递出去 |
| viewCount | number | `5` | 每列选项中可显示的行数。建议不要改，没有完全自动兼容UI。修改的话，请拷贝`src/components/scss/index.scss`到自己的项目，并修改里面的`$viewCount`变量。 |
| onSelect | func | `undefined` | 用户点击`确定`时触发，传递两个参数：`(selectedValue, selectedName)` |
| onCancel | func | `undefined` | 用户点击`取消`时触发，无参数传递 |
| onChanging | func | `undefined` | 用户正在滑动或选择时触发 |

### Popup

| props | type | default value | description |
|--|--| --| -- |
| visible | boolean | 必填 | 是否显示组件 |
| onConfirm | func | 必填 | 用户点击`确定`时触发 |
| onCancel | func | 必填 | 用户点击`取消`时触发 |

### Picker

| props | type | default value | description |
|--|--| --| -- |
| data | object | `{}` | 选项列表数据，数据结构参考上面的例子 |
| selectedValue | object | `{}` | 已选择的值 |
| onChange |  func | `undefined` | 用户正在或选择时触发 |
| viewCount | number | `5`  | 同PopupPicker 的 viewCount |