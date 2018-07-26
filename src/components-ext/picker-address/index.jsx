import React from 'react';
import PropTypes from 'prop-types';
import { PopupPicker } from '../../components';
//import { provins, citys, areas } from './address';
import './index.scss';

let provins=[], citys={}, areas={};

const getProvinsList = () => {
  return provins.map((name, i) => ({ name, value: i }));
};

const getCitysList = provinName => {
  if(!citys[provinName]) return [];
  return citys[provinName].map((name, i) => ({ name, value: i }));
};

const getAreasList = citysName => {
  if(!areas[citysName]) {
    return [];
  };
  return areas[citysName].map((name, i) => ({ name, value: i }));
};

const getProvNameByIndex = ind => {
  return provins[ind];
};

const getCityNameByIndex = (provInd, cityInd) => {
  const citysList = citys[getProvNameByIndex(provInd)];
  if(!citysList) return [];
  return citysList[cityInd];
};

const getAreaNameByIndex = (provInd, cityInd, areaInd) => {
  return areas[getCityNameByIndex(provInd, cityInd)][areaInd];
};

const propTypes = {
  selectedValue: PropTypes.object,
  onCancel: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  onChanging: PropTypes.func
};
const defaultProps = {
  visible: false
};

class PickerAddress extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    const selectedValue = props.selectedValue
      ? props.selectedValue
      : {
          prov: 0,
          city: 0,
          area: 0
        };
    this.state = {
      selectedValue
    };
  }

  handleSelect(selectedValue, selectedName) {
    this.props.onSelect(selectedValue, selectedName);
  }

  handleChanging(selectedValue, key, value, name) {
    console.log(selectedValue, key, value, name);
    // this.setState({ selectedValue }, () => {
    //   this.props.onChanging &&
    //     this.props.onChanging(selectedValue, key, value, name);
    // });
    let { prov, city, area } = selectedValue;
    switch (key) {
      case 'prov':
        city = 0;
        area = 0;
        break;
      case 'city':
        area = 0;
        break;
    }
    this.setState(
      {
        selectedValue: { prov, city, area }
      },
      () => {
        this.props.onChanging &&
          this.props.onChanging(this.state.selectedValue, key, value, name);
      }
    );
  }

  handleCancel() {
    this.props.onCancel && this.props.onCancel();
  }
  componentWillReceiveProps(nexProps) {
    if(nexProps.visible){
      this.loadAddrFile();
    }

    // 选项更新
    if (
      nexProps.selectedValue &&
      Object.keys(nexProps.selectedValue).find(
        key => this.state.selectedValue[key] !== nexProps.selectedValue[key]
      )
    ) {
      this.setState({
        selectedValue: nexProps.selectedValue
      });
    }
  }
  componentDidMount(){
    if(this.props.visible){
      this.loadAddrFile();
    }
  }
  loadAddrFile(){
    if(this._hasReqAddrFile) return;
    this._hasReqAddrFile = true;
    require.ensure([], ()=>{
      const addr = require('./address');
      provins=addr.provins;
      citys=addr.citys;
      areas=addr.areas;
      this.setState({
        loadAddr: true
      })
    })
  }
  render() {
    const selected = this.state.selectedValue;
    const provList = getProvinsList();
    const cityList = getCitysList(getProvNameByIndex(selected.prov || 0));
    const areaList = getAreasList(
      getCityNameByIndex(selected.prov || 0, selected.city || 0)
    );
    return (
      <div className="ui-picker-address">
        <PopupPicker
          data={{
            prov: provList,
            city: cityList,
            area: areaList
          }}
          selectedValue={selected}
          visible={this.props.visible}
          onCancel={this.handleCancel.bind(this)}
          onSelect={this.handleSelect.bind(this)}
          onChanging={this.handleChanging.bind(this)}
        />
      </div>
    );
  }
}

PickerAddress.propTypes = propTypes;
PickerAddress.defaultProps = defaultProps;
export default PickerAddress;
